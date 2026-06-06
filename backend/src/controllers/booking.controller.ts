import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import prisma from '../utils/db';
import { AppError } from '../middleware/error.middleware';
import { BookingStatus, Role } from '@prisma/client';

export const createBooking = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new AppError('Unauthorized.', 401));
    }

    const { propertyId, date, time, notes } = req.body;

    if (!propertyId || !date || !time) {
      return next(new AppError('Property, date, and preferred time slot are required.', 400));
    }

    // Check if the property exists
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      return next(new AppError('Property not found.', 404));
    }

    // Optional check: Double booking check (same date, same time slot, same user)
    const existing = await prisma.booking.findFirst({
      where: {
        userId: req.user.id,
        propertyId,
        date,
        time,
      },
    });

    if (existing) {
      return next(new AppError('You already have a tour scheduled for this property at this slot.', 400));
    }

    const booking = await prisma.booking.create({
      data: {
        userId: req.user.id,
        propertyId,
        date,
        time,
        notes,
        status: BookingStatus.PENDING,
      },
      include: {
        property: {
          select: { title: true, location: true },
        },
      },
    });

    // Create a notification for the Agent of this property
    await prisma.notification.create({
      data: {
        userId: property.agentId,
        title: 'New Tour Request',
        message: `${req.user.name} has requested a private tour for ${property.title} on ${date} (${time}).`,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Your viewing tour request has been sent successfully.',
      booking,
    });
  } catch (error) {
    next(error);
  }
};

export const getBookings = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new AppError('Unauthorized.', 401));
    }

    let bookings;

    if (req.user.role === Role.ADMIN) {
      // Admins can see all bookings
      bookings = await prisma.booking.findMany({
        include: {
          user: { select: { id: true, name: true, email: true, avatarUrl: true } },
          property: { select: { id: true, title: true, location: true, price: true } },
        },
        orderBy: { date: 'asc' },
      });
    } else if (req.user.role === Role.AGENT) {
      // Agents can see bookings for their properties
      bookings = await prisma.booking.findMany({
        where: {
          property: {
            agentId: req.user.id,
          },
        },
        include: {
          user: { select: { id: true, name: true, email: true, avatarUrl: true } },
          property: { select: { id: true, title: true, location: true, price: true } },
        },
        orderBy: { date: 'asc' },
      });
    } else {
      // Normal users can see their own bookings
      bookings = await prisma.booking.findMany({
        where: { userId: req.user.id },
        include: {
          property: {
            select: { id: true, title: true, location: true, price: true, agentId: true },
          },
        },
        orderBy: { date: 'asc' },
      });
    }

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

export const updateBookingStatus = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new AppError('Unauthorized.', 401));
    }

    const { id } = req.params;
    const { status } = req.body; // CONFIRMED, CANCELLED, COMPLETED

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { property: true },
    });

    if (!booking) {
      return next(new AppError('Booking not found.', 404));
    }

    // Access control: Only property Agent, Admin or the booker himself can update
    const isOwner = booking.userId === req.user.id;
    const isAgent = booking.property.agentId === req.user.id;
    const isAdmin = req.user.role === Role.ADMIN;

    if (!isOwner && !isAgent && !isAdmin) {
      return next(new AppError('You do not have permission to modify this appointment.', 403));
    }

    // Booker can only cancel, Agent/Admin can confirm, cancel, or complete
    if (isOwner && !isAgent && !isAdmin && status !== BookingStatus.CANCELLED) {
      return next(new AppError('You can only cancel your own appointments.', 403));
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: { status: status as BookingStatus },
      include: {
        property: { select: { title: true } },
        user: { select: { name: true } },
      },
    });

    // Notify the user about status changes
    if (req.user.id !== booking.userId) {
      await prisma.notification.create({
        data: {
          userId: booking.userId,
          title: `Tour ${status}`,
          message: `Your tour request for ${booking.property.title} has been ${status.toLowerCase()}.`,
        },
      });
    }

    res.status(200).json({
      success: true,
      message: `Booking appointment is now ${status.toLowerCase()}.`,
      booking: updated,
    });
  } catch (error) {
    next(error);
  }
};
