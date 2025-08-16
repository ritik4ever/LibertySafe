import express from 'express';
import { body, param } from 'express-validator';
import {
    getProfile,
    updateProfile,
    getUserDocuments,
    getUserStats,
} from '../controllers/userController';
import { authMiddleware, optionalAuth } from '../middleware/authMiddleware';
import { asyncHandler } from '../middleware/errorMiddleware';

const router = express.Router();

// Get user profile by address
router.get('/:address', [
    param('address').isString().notEmpty().withMessage('Address is required'),
], optionalAuth, asyncHandler(getProfile));

// Update user profile
router.put('/profile', authMiddleware, [
    body('username').optional().isLength({ max: 50 }).withMessage('Username must be max 50 characters'),
    body('bio').optional().isLength({ max: 500 }).withMessage('Bio must be max 500 characters'),
], asyncHandler(updateProfile));

// Get user documents
router.get('/:address/documents', [
    param('address').isString().notEmpty().withMessage('Address is required'),
], optionalAuth, asyncHandler(getUserDocuments));

// Get user statistics
router.get('/:address/stats', [
    param('address').isString().notEmpty().withMessage('Address is required'),
], optionalAuth, asyncHandler(getUserStats));

export default router;