const API_BASE = 'http://localhost:5000/api';

class ApiService {
    async getUser(address: string) {
        return { address, username: 'demo_user', documentCount: 0 };
    }

    async updateUser(address: string, data: any) {
        return { address, ...data };
    }

    async login(data: any) {
        return { user: { address: data.address } };
    }

    async getDocuments(params?: any) {
        return { documents: [], count: 0 };
    }

    async getDocument(id: string) {
        return { id, title: 'Sample Document' };
    }

    async createDocument(data: any) {
        return { id: Date.now().toString(), ...data };
    }

    async uploadToIPFS(file: File | Blob) {
        return 'QmMockHashForDemo123456789';
    }

    async searchDocuments(query: string, filters?: any) {
        return { documents: [], count: 0 };
    }

    async likeDocument(documentId: string) {
        return { success: true };
    }
}

export const api = new ApiService();