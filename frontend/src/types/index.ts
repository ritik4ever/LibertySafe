export interface Document {
    id: string;
    title: string;
    description: string;
    content?: string;
    author: string;
    authorAddress: string;
    createdAt: string;
    updatedAt: string;
    category: 'journalism' | 'activism' | 'whistleblowing' | 'research' | 'legal' | 'other';
    tags: string[];
    isEncrypted: boolean;
    isAnonymous: boolean;
    fileName: string;
    fileSize: number;
    mimeType: string;
    viewCount: number;
    likes: number;
    ordinalsId?: string;
    ipfsHash?: string;
}

export interface User {
    address: string;
    username?: string;
    bio?: string;
    joinedAt: string;
    isVerified: boolean;
}

export interface WalletState {
    isConnected: boolean;
    address: string | null;
    balance: number;
    network: 'mainnet' | 'testnet';
}