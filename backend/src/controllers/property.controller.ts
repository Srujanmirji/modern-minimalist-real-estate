import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import prisma from '../utils/db';
import { AppError } from '../middleware/error.middleware';
import { PropertyStatus } from '@prisma/client';
import { MOCK_PROPERTIES, filterMockProperties } from '../utils/mockData';

export const getProperties = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      search,
      city,
      type,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      minArea,
      maxArea,
      status,
      featured,
      sortBy,
      page = '1',
      limit = '12',
    } = req.query;

    const parsedPage = parseInt(page as string, 10);
    const parsedLimit = parseInt(limit as string, 10);
    const skip = (parsedPage - 1) * parsedLimit;

    // Build filters
    const where: any = {};

    // Standard properties are approved for users/agents. 
    // Admins can see PENDING_APPROVAL properties.
    if (status) {
      where.status = status as PropertyStatus;
    } else {
      where.status = PropertyStatus.FOR_SALE; // Default to public active listings
    }

    if (featured === 'true') {
      where.featured = true;
    }

    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
        { location: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    if (city) {
      where.city = { contains: city as string, mode: 'insensitive' };
    }

    if (type && type !== 'Property Type') {
      where.type = type as string;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice as string);
      if (maxPrice) where.price.lte = parseFloat(maxPrice as string);
    }

    if (bedrooms) {
      where.bedrooms = { gte: parseInt(bedrooms as string, 10) };
    }

    if (bathrooms) {
      where.bathrooms = { gte: parseFloat(bathrooms as string) };
    }

    if (minArea || maxArea) {
      where.area = {};
      if (minArea) where.area.gte = parseFloat(minArea as string);
      if (maxArea) where.area.lte = parseFloat(maxArea as string);
    }

    // Sort order
    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'Price: Low to High') {
      orderBy = { price: 'asc' };
    } else if (sortBy === 'Price: High to Low') {
      orderBy = { price: 'desc' };
    } else if (sortBy === 'Square Footage') {
      orderBy = { area: 'desc' };
    }

    let properties: any[] = [];
    let totalCount = 0;
    let totalPages = 0;
    let currentPageVal = parsedPage;

    try {
      const [dbProperties, dbTotalCount] = await prisma.$transaction([
        prisma.property.findMany({
          where,
          orderBy,
          skip,
          take: parsedLimit,
          include: {
            images: true,
            agent: {
              select: { id: true, name: true, email: true, avatarUrl: true },
            },
          },
        }),
        prisma.property.count({ where }),
      ]);
      properties = dbProperties;
      totalCount = dbTotalCount;
      totalPages = Math.ceil(totalCount / parsedLimit);
    } catch (error) {
      console.error('Database query failed. Falling back to mock data:', error);
      const mockResult = filterMockProperties(req.query);
      properties = mockResult.properties;
      totalCount = mockResult.totalCount;
      totalPages = mockResult.totalPages;
      currentPageVal = mockResult.currentPage;
    }

    if (properties.length === 0) {
      console.log('Database returned 0 properties. Falling back to mock data...');
      const mockResult = filterMockProperties(req.query);
      properties = mockResult.properties;
      totalCount = mockResult.totalCount;
      totalPages = mockResult.totalPages;
      currentPageVal = mockResult.currentPage;
    }

    res.status(200).json({
      success: true,
      count: properties.length,
      totalPages,
      currentPage: currentPageVal,
      totalCount,
      properties,
    });
  } catch (error) {
    next(error);
  }
};

export const getPropertyById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    let property: any = null;

    try {
      property = await prisma.property.findUnique({
        where: { id },
        include: {
          images: true,
          agent: {
            select: { id: true, name: true, email: true, avatarUrl: true },
          },
          reviews: {
            include: {
              user: { select: { id: true, name: true, avatarUrl: true } },
            },
          },
        },
      });
    } catch (error) {
      console.error('Database findUnique failed. Falling back to mock data:', error);
    }

    if (!property) {
      // Find in mock data
      property = MOCK_PROPERTIES.find((p) => p.id === id);
    }

    if (!property) {
      return next(new AppError('Property not found.', 404));
    }

    // Mocking nearby amenities for interactive maps (schools, hospitals, transit)
    const nearbyAmenities = {
      schools: [
        { name: 'Beverly Hills High School', distance: '1.2 miles', rating: '9/10' },
        { name: 'El Rodeo Elementary School', distance: '0.8 miles', rating: '8/10' },
      ],
      hospitals: [
        { name: 'Cedars-Sinai Medical Center', distance: '3.5 miles', rating: 'A+' },
        { name: 'UCLA Medical Center', distance: '4.8 miles', rating: 'A+' },
      ],
      restaurants: [
        { name: 'The Ivy', distance: '1.4 miles', cuisine: 'American' },
        { name: 'Spago Beverly Hills', distance: '1.6 miles', cuisine: 'Fine Dining' },
      ],
    };

    res.status(200).json({
      success: true,
      property,
      nearbyAmenities,
    });
  } catch (error) {
    next(error);
  }
};

export const createProperty = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new AppError('Unauthorized.', 401));
    }

    const {
      title,
      description,
      price,
      location,
      address,
      city,
      state,
      country,
      latitude,
      longitude,
      bedrooms,
      bathrooms,
      area,
      type,
      amenities,
      images, // array of image URLs
    } = req.body;

    const property = await prisma.property.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        location,
        address,
        city,
        state,
        country,
        latitude: parseFloat(latitude || '34.0522'),
        longitude: parseFloat(longitude || '-118.2437'),
        bedrooms: parseInt(bedrooms, 10),
        bathrooms: parseFloat(bathrooms),
        area: parseFloat(area),
        type,
        amenities: amenities || [],
        agentId: req.user.role === 'ADMIN' ? req.body.agentId || req.user.id : req.user.id,
        status: req.user.role === 'ADMIN' ? PropertyStatus.FOR_SALE : PropertyStatus.PENDING_APPROVAL,
        images: {
          create: images && images.length > 0 
            ? images.map((url: string) => ({ imageUrl: url }))
            : [{ imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800' }],
        },
      },
    });

    res.status(201).json({
      success: true,
      message: req.user.role === 'ADMIN' ? 'Property created and listed.' : 'Property submitted for Admin approval.',
      property,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProperty = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new AppError('Unauthorized.', 401));
    }

    const { id } = req.params;
    const body = req.body;

    const existing = await prisma.property.findUnique({ where: { id } });

    if (!existing) {
      return next(new AppError('Property not found.', 404));
    }

    // Check permissions (Only owner Agent or Admin)
    if (existing.agentId !== req.user.id && req.user.role !== 'ADMIN') {
      return next(new AppError('You do not have permission to modify this property.', 403));
    }

    // Update property fields
    const updated = await prisma.property.update({
      where: { id },
      data: {
        title: body.title || undefined,
        description: body.description || undefined,
        price: body.price ? parseFloat(body.price) : undefined,
        location: body.location || undefined,
        address: body.address || undefined,
        city: body.city || undefined,
        state: body.state || undefined,
        country: body.country || undefined,
        latitude: body.latitude ? parseFloat(body.latitude) : undefined,
        longitude: body.longitude ? parseFloat(body.longitude) : undefined,
        bedrooms: body.bedrooms ? parseInt(body.bedrooms, 10) : undefined,
        bathrooms: body.bathrooms ? parseFloat(body.bathrooms) : undefined,
        area: body.area ? parseFloat(body.area) : undefined,
        type: body.type || undefined,
        status: body.status || undefined,
        featured: body.featured !== undefined ? body.featured : undefined,
        amenities: body.amenities || undefined,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Property updated successfully.',
      property: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProperty = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new AppError('Unauthorized.', 401));
    }

    const { id } = req.params;

    const existing = await prisma.property.findUnique({ where: { id } });

    if (!existing) {
      return next(new AppError('Property not found.', 404));
    }

    if (existing.agentId !== req.user.id && req.user.role !== 'ADMIN') {
      return next(new AppError('You do not have permission to delete this property.', 403));
    }

    await prisma.property.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: 'Property deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// Admin workflow: Approval / Rejection
export const approveProperty = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // e.g. FOR_SALE or PENDING_APPROVAL

    const property = await prisma.property.update({
      where: { id },
      data: { status },
    });

    res.status(200).json({
      success: true,
      message: `Property status updated to ${status}.`,
      property,
    });
  } catch (error) {
    next(error);
  }
};

// Favorite property logic
export const toggleFavorite = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new AppError('Unauthorized.', 401));
    }

    const { propertyId } = req.body;

    const existing = await prisma.favorite.findUnique({
      where: {
        userId_propertyId: {
          userId: req.user.id,
          propertyId,
        },
      },
    });

    if (existing) {
      await prisma.favorite.delete({
        where: { id: existing.id },
      });
      return res.status(200).json({
        success: true,
        isFavorite: false,
        message: 'Property removed from favorites.',
      });
    } else {
      await prisma.favorite.create({
        data: {
          userId: req.user.id,
          propertyId,
        },
      });
      return res.status(200).json({
        success: true,
        isFavorite: true,
        message: 'Property added to favorites.',
      });
    }
  } catch (error) {
    next(error);
  }
};

// Add reviews and ratings
export const addReview = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new AppError('Unauthorized.', 401));
    }

    const { propertyId, rating, review } = req.body;

    const created = await prisma.review.upsert({
      where: {
        userId_propertyId: {
          userId: req.user.id,
          propertyId,
        },
      },
      update: { rating: parseInt(rating), review },
      create: {
        userId: req.user.id,
        propertyId,
        rating: parseInt(rating),
        review,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Review saved successfully.',
      review: created,
    });
  } catch (error) {
    next(error);
  }
};

export const getRecommendations = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Recommend similar items based on user favorites or default to top featured properties
    let recommendations: any[] = [];
    let favIds: string[] = [];

    try {
      const userFavorites = req.user
        ? await prisma.favorite.findMany({
            where: { userId: req.user.id },
            select: { propertyId: true },
          })
        : [];
      favIds = userFavorites.map((f) => f.propertyId);

      recommendations = await prisma.property.findMany({
        where: {
          status: PropertyStatus.FOR_SALE,
          id: { notIn: favIds },
        },
        take: 4,
        include: { images: true },
      });
    } catch (error) {
      console.error('Database recommendations query failed. Falling back to mock data:', error);
    }

    if (recommendations.length === 0) {
      // Get featured/sale properties from mock data
      recommendations = MOCK_PROPERTIES.filter(
        (p) => p.status === PropertyStatus.FOR_SALE && !favIds.includes(p.id)
      ).slice(0, 4);
    }

    res.status(200).json({
      success: true,
      recommendations,
    });
  } catch (error) {
    next(error);
  }
};
