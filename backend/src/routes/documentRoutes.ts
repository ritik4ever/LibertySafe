import express from 'express';
import multer from 'multer';
import { body, query } from 'express-validator';
import {
    getDocuments,
    getDocument,
    uploadDocument,
    updateDocument,
    deleteDocument,
    likeDocument,
    getDocumentStats,
} from '../controllers/documentController';
import { authMiddleware, optionalAuth } from '../middleware/authMiddleware';
import { asyncHandler } from '../middleware/errorMiddleware';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB limit
    },
    fileFilter: (req, file, cb) => {
        // Allow most document and media types
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain',
            'text/markdown',
            'image/jpeg',
            'image/png',
            'image/gif',
            'audio/mpeg',
            'audio/wav',
            'video/mp4',
            'video/webm',
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('File type not supported'));
        }
    },
});

// Get all documents with filters
router.get('/', [
    query('category').optional().isIn(['journalism', 'activism', 'whistleblowing', 'research', 'legal', 'other']),
    query('sortBy').optional().isIn(['recent', 'popular', 'alphabetical']),
    query('tags').optional().isString(),
    query('author').optional().isString(),
], optionalAuth, asyncHandler(getDocuments));

// Get document by ID
router.get('/:id', optionalAuth, asyncHandler(getDocument));

// Upload new document
router.post('/upload', authMiddleware, upload.single('file'), [
    body('title').isString().isLength({ min: 1, max: 200 }).withMessage('Title must be 1-200 characters'),
    body('description').optional().isLength({ max: 1000 }).withMessage('Description must be max 1000 characters'),
    body('category').isIn(['journalism', 'activism', 'whistleblowing', 'research', 'legal', 'other']),
    body('tags').optional().isString(),
    body('isEncrypted').optional().isBoolean(),
    body('isAnonymous').optional().isBoolean(),
], asyncHandler(uploadDocument));

// Update document
router.put('/:id', authMiddleware, [
    body('title').optional().isString().isLength({ min: 1, max: 200 }),
    body('description').optional().isLength({ max: 1000 }),
    body('category').optional().isIn(['journalism', 'activism', 'whistleblowing', 'research', 'legal', 'other']),
    body('tags').optional().isString(),
], asyncHandler(updateDocument));

// Delete document
router.delete('/:id', authMiddleware, asyncHandler(deleteDocument));

// Like/unlike document
router.post('/:id/like', authMiddleware, asyncHandler(likeDocument));

// Get document statistics
router.get('/:id/stats', asyncHandler(getDocumentStats));

export default router;