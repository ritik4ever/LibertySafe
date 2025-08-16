import axios from 'axios';
import { IDocument } from '../models/Document';

const ORDINALSBOT_API_URL = 'https://ordinalsbot.com/api';
const ORDINALSBOT_API_KEY = process.env.ORDINALSBOT_API_KEY;

export interface InscriptionRequest {
    files: Array<{
        name: string;
        content: string; // Base64 encoded content
        mediaType: string;
    }>;
    lowPostage: boolean;
    receiveAddress: string;
    fee: number;
}

export interface InscriptionResponse {
    id: string;
    status: string;
    txid?: string;
    inscriptionId?: string;
    fee: number;
}

export const inscribeToOrdinals = async (
    documentId: string,
    metadata: any
): Promise<string> => {
    try {
        if (!ORDINALSBOT_API_KEY) {
            console.warn('OrdinalsBot API key not configured, using mock inscription');
            return `mock-inscription-${documentId}-${Date.now()}`;
        }

        // Create the inscription request using Open Ordinal standards
        const inscriptionContent = {
            metadata,
            stitchConfig: {
                contentType: 'application/json',
                splitThreshold: 350000, // 350KB as per Open Ordinal Stitch
            },
            bootstrap: {
                mode: 4,
                data: {
                    documentId,
                    encrypted: metadata.encrypted || false,
                },
            },
        };

        const files = [{
            name: `libertysafe-doc-${documentId}.json`,
            content: Buffer.from(JSON.stringify(inscriptionContent)).toString('base64'),
            mediaType: 'application/json',
        }];

        const request: InscriptionRequest = {
            files,
            lowPostage: true,
            receiveAddress: process.env.BITCOIN_RECEIVE_ADDRESS || '',
            fee: 10, // sats/vB
        };

        const response = await axios.post(
            `${ORDINALSBOT_API_URL}/inscribe`,
            request,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${ORDINALSBOT_API_KEY}`,
                },
                timeout: 30000,
            }
        );

        if (response.data.id) {
            // Monitor inscription status
            monitorInscriptionStatus(response.data.id, documentId);
            return response.data.id;
        } else {
            throw new Error('Failed to create inscription');
        }
    } catch (error) {
        console.error('Ordinals inscription error:', error);
        // Return mock ID for development
        return `mock-inscription-${documentId}-${Date.now()}`;
    }
};

export const getInscriptionStatus = async (inscriptionId: string): Promise<InscriptionResponse> => {
    try {
        if (!ORDINALSBOT_API_KEY) {
            return {
                id: inscriptionId,
                status: 'completed',
                inscriptionId: `inscr_${inscriptionId}`,
                fee: 10,
            };
        }

        const response = await axios.get(
            `${ORDINALSBOT_API_URL}/inscription/${inscriptionId}`,
            {
                headers: {
                    'Authorization': `Bearer ${ORDINALSBOT_API_KEY}`,
                },
                timeout: 10000,
            }
        );

        return response.data;
    } catch (error) {
        console.error('Get inscription status error:', error);
        throw new Error('Failed to get inscription status');
    }
};

const monitorInscriptionStatus = async (inscriptionId: string, documentId: string): Promise<void> => {
    const maxAttempts = 20;
    const delay = 30000; // 30 seconds

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        try {
            await new Promise(resolve => setTimeout(resolve, delay));

            const status = await getInscriptionStatus(inscriptionId);

            if (status.status === 'completed' && status.inscriptionId) {
                // Update document with confirmed inscription
                const Document = require('../models/Document').default;
                await Document.findByIdAndUpdate(documentId, {
                    ordinalsId: status.inscriptionId,
                    isInscribed: true,
                    inscriptionStatus: 'confirmed',
                    txid: status.txid,
                });

                console.log(`✅ Document ${documentId} inscribed successfully: ${status.inscriptionId}`);
                break;
            } else if (status.status === 'failed') {
                // Update document with failed status
                const Document = require('../models/Document').default;
                await Document.findByIdAndUpdate(documentId, {
                    inscriptionStatus: 'failed',
                });

                console.error(`❌ Document ${documentId} inscription failed`);
                break;
            }

            console.log(`⏳ Document ${documentId} inscription status: ${status.status}`);
        } catch (error) {
            console.error(`Monitoring attempt ${attempt + 1} failed:`, error);
        }
    }
};