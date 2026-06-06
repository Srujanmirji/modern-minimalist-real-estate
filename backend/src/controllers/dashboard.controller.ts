import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import prisma from '../utils/db';
import { AppError } from '../middleware/error.middleware';
import { Role, PropertyStatus, BookingStatus } from '@prisma/client';

export const getDashboardStats = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new AppError('Unauthorized.', 401));
    }

    const { role, id: userId } = req.user;

    if (role === Role.ADMIN) {
      // 1. Admin Dashboard Stats
      const totalUsers = await prisma.user.count();
      const totalProperties = await prisma.property.count();
      const pendingApprovalCount = await prisma.property.count({
        where: { status: PropertyStatus.PENDING_APPROVAL },
      });
      const activeBookings = await prisma.booking.count({
        where: { status: BookingStatus.PENDING },
      });

      // Quick list of properties pending approval
      const pendingProperties = await prisma.property.findMany({
        where: { status: PropertyStatus.PENDING_APPROVAL },
        include: {
          agent: { select: { name: true, email: true } },
          images: true,
        },
        take: 5,
      });

      // Aggregate property types for simple analytics chart
      const propertiesByType = await prisma.property.groupBy({
        by: ['type'],
        _count: { _all: true },
      });

      // Mock platform logs
      const platformSettings = {
        commissionRate: '2.5%',
        autoApproveAgents: false,
        maintenanceMode: false,
      };

      return res.status(200).json({
        success: true,
        role,
        stats: {
          totalUsers,
          totalProperties,
          pendingApprovals: pendingApprovalCount,
          activeBookings,
        },
        pendingProperties,
        propertyDistribution: propertiesByType.map((p) => ({
          type: p.type,
          count: p._count._all,
        })),
        platformSettings,
      });
    }

    if (role === Role.AGENT) {
      // 2. Agent Dashboard Stats
      const totalListings = await prisma.property.count({
        where: { agentId: userId },
      });
      const pendingTours = await prisma.booking.count({
        where: {
          property: { agentId: userId },
          status: BookingStatus.PENDING,
        },
      });
      const confirmedTours = await prisma.booking.count({
        where: {
          property: { agentId: userId },
          status: BookingStatus.CONFIRMED,
        },
      });

      // List of properties managed by the agent
      const myProperties = await prisma.property.findMany({
        where: { agentId: userId },
        include: { images: true },
        orderBy: { createdAt: 'desc' },
      });

      // Upcoming client visits
      const clientBookings = await prisma.booking.findMany({
        where: {
          property: { agentId: userId },
          status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
        },
        include: {
          user: { select: { name: true, email: true, avatarUrl: true } },
          property: { select: { title: true, location: true } },
        },
        orderBy: { date: 'asc' },
        take: 5,
      });

      // Mock performance metrics for bento cards
      const performanceStats = {
        monthlyCommissionEst: 15500,
        totalViews: 1248,
        leadsGenerated: 42,
        satisfactionRate: 98,
      };

      return res.status(200).json({
        success: true,
        role,
        stats: {
          totalListings,
          pendingTours,
          confirmedTours,
        },
        properties: myProperties,
        upcomingVisits: clientBookings,
        performance: performanceStats,
      });
    }

    // 3. Normal Buyer/User Dashboard Stats
    const savedCount = await prisma.favorite.count({
      where: { userId },
    });
    const activeInquiries = await prisma.booking.count({
      where: { userId, status: BookingStatus.PENDING },
    });
    const upcomingTours = await prisma.booking.count({
      where: {
        userId,
        status: BookingStatus.CONFIRMED,
        date: { gte: new Date().toISOString().split('T')[0] },
      },
    });

    // Saved properties list (Wishlist)
    const savedProperties = await prisma.favorite.findMany({
      where: { userId },
      include: {
        property: {
          include: { images: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Upcoming schedules (Appointments calendar)
    const userAppointments = await prisma.booking.findMany({
      where: { userId },
      include: {
        property: {
          select: {
            title: true,
            location: true,
            agent: { select: { name: true, avatarUrl: true } },
          },
        },
      },
      orderBy: { date: 'asc' },
      take: 5,
    });

    // Recent notifications
    const recentNotifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    res.status(200).json({
      success: true,
      role,
      stats: {
        savedProperties: savedCount,
        activeInquiries,
        upcomingTours,
        profileStrength: 85,
      },
      saved: savedProperties.map((fav) => fav.property),
      appointments: userAppointments,
      notifications: recentNotifications,
    });
  } catch (error) {
    next(error);
  }
};
