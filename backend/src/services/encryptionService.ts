import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';

export interface EncryptionResult {
    encryptedData: Buffer;
    key: string;
    iv: string;
    authTag: string;
}

export interface DecryptionInput {
    encryptedData: Buffer;
    key: string;
    iv: string;
    authTag: string;
}

export const encryptFile = (fileBuffer: Buffer): EncryptionResult => {
    try {
        // Generate random key and IV
        const key = crypto.randomBytes(32);
        const iv = crypto.randomBytes(16);

        // Create cipher
        const cipher = crypto.createCipher(ALGORITHM, key);
        cipher.setAAD(Buffer.from('libertysafe-auth'));

        // Encrypt the file
        const encrypted = Buffer.concat([
            cipher.update(fileBuffer),
            cipher.final(),
        ]);

        const authTag = cipher.getAuthTag();

        return {
            encryptedData: encrypted,
            key: key.toString('hex'),
            iv: iv.toString('hex'),
            authTag: authTag.toString('hex'),
        };
    } catch (error) {
        console.error('File encryption error:', error);
        throw new Error('Failed to encrypt file');
    }
};

export const decryptFile = (input: DecryptionInput): Buffer => {
    try {
        const key = Buffer.from(input.key, 'hex');
        const iv = Buffer.from(input.iv, 'hex');
        const authTag = Buffer.from(input.authTag, 'hex');

        // Create decipher
        const decipher = crypto.createDecipher(ALGORITHM, key);
        decipher.setAAD(Buffer.from('libertysafe-auth'));
        decipher.setAuthTag(authTag);

        // Decrypt the file
        const decrypted = Buffer.concat([
            decipher.update(input.encryptedData),
            decipher.final(),
        ]);

        return decrypted;
    } catch (error) {
        console.error('File decryption error:', error);
        throw new Error('Failed to decrypt file');
    }
};

export const generateFileHash = (fileBuffer: Buffer): string => {
    return crypto.createHash('sha256').update(fileBuffer).digest('hex');
};

export const generateSecureToken = (length: number = 32): string => {
    return crypto.randomBytes(length).toString('hex');
};