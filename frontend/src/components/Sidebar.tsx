import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Home,
    Upload,
    Search,
    FileText,
    User,
    Settings,
    Shield,
    TrendingUp,
    Clock,
    Star
} from 'lucide-react';

export const Sidebar: React.FC = () => {
    const location = useLocation();

    const navigation = [
        { name: 'Dashboard', href: '/', icon: Home },
        { name: 'Upload Document', href: '/upload', icon: Upload },
        { name: 'Explore', href: '/explore', icon: Search },
        { name: 'My Documents', href: '/profile', icon: FileText },
    ];

    const quickStats = [
        { name: 'Total Documents', value: '1,234', icon: FileText, color: 'text-blue-600' },
        { name: 'This Week', value: '+23', icon: TrendingUp, color: 'text-green-600' },
        { name: 'Recent Views', value: '567', icon: Clock, color: 'text-purple-600' },
        { name: 'Favorites', value: '89', icon: Star, color: 'text-yellow-600' },
    ];

    return (
        <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
            <div className="flex flex-col flex-grow pt-16 pb-4 overflow-y-auto bg-white dark:bg-dark-800 border-r border-gray-200 dark:border-dark-700">
                <div className="flex flex-col flex-grow px-4">
                    {/* Navigation */}
                    <nav className="mt-6 space-y-1">
                        {navigation.map((item) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${isActive
                                            ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 border-r-2 border-primary-600'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700 hover:text-primary-600 dark:hover:text-primary-400'
                                        }`}
                                >
                                    <item.icon
                                        className={`mr-3 h-5 w-5 transition-colors ${isActive
                                                ? 'text-primary-600 dark:text-primary-400'
                                                : 'text-gray-400 group-hover:text-primary-500'
                                            }`}
                                    />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Quick Stats */}
                    <div className="mt-8">
                        <h3 className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Quick Stats
                        </h3>
                        <div className="mt-4 space-y-3">
                            {quickStats.map((stat) => (
                                <motion.div
                                    key={stat.name}
                                    whileHover={{ scale: 1.02 }}
                                    className="px-4 py-3 rounded-lg bg-gray-50 dark:bg-dark-700 border border-gray-200 dark:border-dark-600"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                                            <span className="text-xs text-gray-600 dark:text-gray-400">
                                                {stat.name}
                                            </span>
                                        </div>
                                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                            {stat.value}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Security Notice */}
                    <div className="mt-8 px-4">
                        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg p-4 text-white">
                            <div className="flex items-center space-x-2 mb-2">
                                <Shield className="h-5 w-5" />
                                <span className="font-semibold text-sm">Secure Storage</span>
                            </div>
                            <p className="text-xs opacity-90">
                                Your documents are encrypted and stored on Bitcoin's immutable blockchain.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
};