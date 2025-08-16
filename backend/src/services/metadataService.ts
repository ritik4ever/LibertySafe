import { IDocument } from '../models/Document';

export interface OOMDMetadata {
  title: string;
  description: string;
  category: string;
  tags: string[];
  author: string;
  createdAt: string;
  encrypted: boolean;
  fileHash: string;
  fileSize: number;
  mimeType: string;
  version: string;
}

export const generateOOMDMetadata = (document: IDocument): OOMDMetadata => {
  return {
    title: document.title,
    description: document.description,
    category: document.category,
    tags: document.tags,
    author: document.isAnonymous ? 'Anonymous' : document.authorAddress,
    createdAt: document.createdAt.toISOString(),
    encrypted: document.isEncrypted,
    fileHash: document.fileHash,
    fileSize: document.fileSize,
    mimeType: document.mimeType,
    version: '1.0.0',
  };
};

export const generateBootstrapConfig = (documentId: string, encrypted: boolean) => {
  return {
    mode: 4,
    data: {
      documentId,
      encrypted,
      app: 'LibertySafe',
      version: '1.0.0',
    },
    oo: {
      metadata: true,
      api: true,
      stitch: true,
    },
  };
};