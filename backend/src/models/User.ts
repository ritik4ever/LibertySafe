import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    address: string;
    username?: string;
    bio?: string;
    avatar?: string;
    documents: string[];
    joinedAt: Date;
    isVerified: boolean;
    lastActive: Date;
    encryptionPublicKey?: string;
    preferences: {
        defaultEncryption: boolean;
        publicProfile: boolean;
        emailNotifications: boolean;
    };
}

const userSchema = new Schema<IUser>({
    address: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    username: {
        type: String,
        maxlength: 50,
        trim: true,
    },
    bio: {
        type: String,
        maxlength: 500,
        trim: true,
    },
    avatar: {
        type: String,
    },
    documents: [{
        type: Schema.Types.ObjectId,
        ref: 'Document',
    }],
    joinedAt: {
        type: Date,
        default: Date.now,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    lastActive: {
        type: Date,
        default: Date.now,
    },
    encryptionPublicKey: {
        type: String,
    },
    preferences: {
        defaultEncryption: {
            type: Boolean,
            default: true,
        },
        publicProfile: {
            type: Boolean,
            default: true,
        },
        emailNotifications: {
            type: Boolean,
            default: false,
        },
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

// Indexes
userSchema.index({ address: 1 });
userSchema.index({ username: 1 });
userSchema.index({ joinedAt: -1 });

// Virtual for document count
userSchema.virtual('documentCount', {
    ref: 'Document',
    localField: '_id',
    foreignField: 'author',
    count: true,
});

export default mongoose.model<IUser>('User', userSchema);