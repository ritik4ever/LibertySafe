export async function encryptFile(file: File): Promise<{ encryptedFile: Blob; key: string }> {
    const key = 'demo-encryption-key-' + Date.now();
    return {
        encryptedFile: new Blob([await file.arrayBuffer()], { type: file.type }),
        key,
    };
}

export async function decryptFile(encryptedBlob: Blob, keyHex: string): Promise<Blob> {
    return encryptedBlob;
}