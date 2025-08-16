import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Menu, X, Upload, Search as Explore, User, Moon, Sun } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';
import { useTheme } from '../hooks/useTheme';

export const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { wallet, connectWallet, disconnectWallet } = useWallet();
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();

    const navigation = [
        { name: 'Explore', href: '/explore', icon: Explore },
        { name: 'Upload', href: '/upload', icon: Upload },
        { name: 'Profile', href: '/profile', icon: User },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <header className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-xl text-gray-900 dark:text-white">LibertySafe</span>
                    </Link>

                    <nav className="hidden md:flex space-x-8">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(item.href)
                                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                                        : 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="flex items-center space-x-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        {wallet.isConnected ? (
                            <div className="flex items-center space-x-3">
                                <div className="hidden sm:block text-sm">
                                    <div className="text-gray-700 dark:text-gray-300">
                                        {wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}
                                    </div>
                                    <div className="text-xs text-gray-500">{wallet.balance} sats</div>
                                </div>
                                <button
                                    onClick={disconnectWallet}
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    Disconnect
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={connectWallet}
                                disabled={wallet.connecting}
                                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                {wallet.connecting ? 'Connecting...' : 'Connect Wallet'}
                            </button>
                        )}

                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};