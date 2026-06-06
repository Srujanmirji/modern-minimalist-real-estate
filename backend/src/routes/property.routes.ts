import { Router } from 'express';
import {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  approveProperty,
  toggleFavorite,
  addReview,
  getRecommendations,
} from '../controllers/property.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Public property search and detail view
router.get('/', getProperties);
router.get('/recommendations', getRecommendations);
router.get('/:id', getPropertyById);

// Protected CRUD properties (Agents / Admins)
router.post('/', authenticate, requireRole([Role.AGENT, Role.ADMIN]), createProperty);
router.put('/:id', authenticate, requireRole([Role.AGENT, Role.ADMIN]), updateProperty);
router.delete('/:id', authenticate, requireRole([Role.AGENT, Role.ADMIN]), deleteProperty);

// Admin property approval workflow
router.patch('/:id/approve', authenticate, requireRole([Role.ADMIN]), approveProperty);

// Favorites and Reviews
router.post('/favorite', authenticate, toggleFavorite);
router.post('/review', authenticate, addReview);

export default router;
