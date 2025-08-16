import mongoose, { Document as MongoDocument, Schema } from 'mongoose';

export type DocumentCategory =
    | 'journalism'
    | 'activism'
    | 'whistleblowing'
    | 'research'
    | 'legal'
    | 'other';

export interface IDocument extends MongoDocument {
    title: string;
    description: string;
    content?: string;
    author: mongoose.Types.ObjectId;
    authorAddress: string;
    category: DocumentCategory;
    tags: string[];
    isEncrypted: boolean;
    isAnonymous: boolean;

    // File information
    fileName: string;
    fileSize: number;
    mimeType: string;
    fileHash: string;

    // Storage information
    ipfsHash?: string;
    ordinalsId?: string;
    isInscribed: boolean;
    inscriptionStatus: 'pending' | 'confirmed' | 'failed';
    txid?: string;
    blockHeight?: number;

    // Encryption information
    encryptionKey?: string;
    encryptionIv?: string;

    // Engagement metrics
    viewCount: number;
    likes: number;
    downloads: number;

    // Timestamps
    createdAt: Date;
    updatedAt: Date;
    publishedAt?: Date;
}

const documentSchema = new Schema<IDocument>({
    title: {
        type: String,
        required: true,
        maxlength: 200,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        maxlength: 1000,
        trim: true,
    },
    content: {
        type: String,
        maxlength: 1000000, // 1MB text limit
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    authorAddress: {
        type: String,
        required: true,
        index: true,
    },
    category: {
        type: String,
        enum: ['journalism', 'activism', 'whistleblowing', 'research', 'legal', 'other'],
        required: true,
        index: true,
    },
    tags: [{
        type: String,
        maxlength: 50,
        trim: true,
    }],
    isEncrypted: {
        type: Boolean,
        default: true,
    },
    isAnonymous: {
        type: Boolean,
        default: false,
    },

    // File information
    fileName: {
        type: String,
        required: true,
    },
    fileSize: {
        type: Number,
        required: true,
    },
    mimeType: {
        type: String,
        required: true,
    },
    fileHash: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },

    // Storage information
    ipfsHash: {
        type: String,
        index: true,
    },
    ordinalsId: {
        type: String,
        index: true,
    },
    isInscribed: {
        type: Boolean,
        default: false,
    },
    inscriptionStatus: {
        type: String,
        enum: ['pending', 'confirmed', 'failed'],
        default: 'pending',
    },
    txid: {
        type: String,
        index: true,
    },
    blockHeight: {
        type: Number,
        index: true,
    },

    // Encryption information
    encryptionKey: {
        type: String,
    },
    encryptionIv: {
        type: String,
    },

    // Engagement metrics
    viewCount: {
        type: Number,
        default: 0,
    },
    likes: {
        type: Number,
        default: 0,
    },
    downloads: {
        type: Number,
        default: 0,
    },

    publishedAt: {
        type: Date,
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

// Indexes
documentSchema.index({ title: 'text', description: 'text', tags: 'text' });
documentSchema.index({ category: 1, createdAt: -1 });
documentSchema.index({ authorAddress: 1, createdAt: -1 });
documentSchema.index({ tags: 1 });
documentSchema.index({ isInscribed: 1, inscriptionStatus: 1 });
documentSchema.index({ createdAt: -1 });
documentSchema.index({ likes: -1 });
documentSchema.index({ viewCount: -1 });

// Pre-save middleware
documentSchema.pre('save', function (next) {
    if (this.isNew && !this.publishedAt) {
        this.publishedAt = new Date();
    }
    next();
});

export default mongoose.model<IDocument>('Document', documentSchema);