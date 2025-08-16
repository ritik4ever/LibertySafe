import React, { createContext, useContext, useState, useEffect } from 'react';

interface WalletState {
    isConnected: boolean;
    address: string | null;
    balance: number;
    network: 'mainnet' | 'testnet';
    connecting: boolean;
}

interface WalletContextType {
    wallet: WalletState;
    connectWallet: () => Promise<void>;
    disconnectWallet: () => void;
    signMessage: (message: string) => Promise<string>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
};

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [wallet, setWallet] = useState<WalletState>({
        isConnected: false,
        address: null,
        balance: 0,
        network: 'testnet',
        connecting: false,
    });

    const connectWallet = async () => {
        setWallet(prev => ({ ...prev, connecting: true }));

        try {
            // Mock wallet connection for demo
            setTimeout(() => {
                setWallet({
                    isConnected: true,
                    address: 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4',
                    balance: 50000,
                    network: 'testnet',
                    connecting: false,
                });
            }, 1000);
        } catch (error) {
            setWallet(prev => ({ ...prev, connecting: false }));
        }
    };

    const disconnectWallet = () => {
        setWallet({
            isConnected: false,
            address: null,
            balance: 0,
            network: 'testnet',
            connecting: false,
        });
    };

    const signMessage = async (message: string): Promise<string> => {
        return 'mock-signature-' + Date.now();
    };

    return (
        <WalletContext.Provider value={{ wallet, connectWallet, disconnectWallet, signMessage }}>
            {children}
        </WalletContext.Provider>
    );
};