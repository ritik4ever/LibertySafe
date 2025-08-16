import React, { createContext, useContext, useState } from 'react';

interface User {
    address: string;
    username?: string;
    bio?: string;
    avatar?: string;
    joinedAt: string;
    isVerified: boolean;
    documentCount: number;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: () => Promise<void>;
    logout: () => void;
    updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    const isAuthenticated = !!user;

    const login = async () => {
        // Mock login
        setUser({
            address: 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4',
            username: 'demo_user',
            joinedAt: new Date().toISOString(),
            isVerified: false,
            documentCount: 0,
        });
    };

    const logout = () => {
        setUser(null);
    };

    const updateProfile = async (data: Partial<User>) => {
        if (user) {
            setUser({ ...user, ...data });
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};