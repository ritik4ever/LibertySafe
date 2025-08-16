import mongoose, { Document, Schema } from 'mongoose';

export interface ILike extends Document {
    user: mongoose.Types.ObjectId;
    userAddress: string;
    document: mongoose.Types.ObjectId;
    createdAt: Date;
}

const likeSchema = new Schema<ILike>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    userAddress: {
        type: String,
        required: true,
    },
    document: {
        type: Schema.Types.ObjectId,
        ref: 'Document',
        required: true,
    },
}, {
    timestamps: true,
});

// Compound index to prevent duplicate likes
likeSchema.index({ user: 1, document: 1 }, { unique: true });
likeSchema.index({ document: 1, createdAt: -1 });

export default mongoose.model<ILike>('Like', likeSchema);