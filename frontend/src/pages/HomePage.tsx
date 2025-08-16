import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Upload, Search, Lock, Bitcoin, Globe, ArrowRight, Check } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';

export const HomePage: React.FC = () => {
    const { wallet, connectWallet } = useWallet();

    return (
        <div className="min-h-screen">
            <section className="relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-purple-700">
                <div className="absolute inset-0 bg-black opacity-20"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
                    <div className="text-center">
                        <div className="mb-8">
                            <div className="w-20 h-20 bg-green-500 rounded-full mx-auto mb-6 flex items-center justify-center animate-pulse">
                                <Shield className="w-10 h-10 text-white" />
                            </div>
                            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
                                LibertySafe
                            </h1>
                            <p className="text-xl md:text-2xl text-blue-100 mb-8">
                                Freedom of Information, Protected Forever
                            </p>
                        </div>

                        <div className="glass-effect rounded-xl p-8 max-w-md mx-auto mb-12">
                            <h2 className="text-2xl font-semibold text-white mb-4">
                                Welcome to LibertySafe
                            </h2>
                            <p className="text-blue-100 mb-6">
                                Censorship-resistant document storage on Bitcoin's blockchain using the complete Open Ordinal stack.
                            </p>

                            <div className="space-y-3">
                                {wallet.isConnected ? (
                                    <>
                                        <Link
                                            to="/upload"
                                            className="w-full bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2"
                                        >
                                            <Upload className="w-5 h-5" />
                                            <span>Upload Document</span>
                                        </Link>
                                        <Link
                                            to="/explore"
                                            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                                        >
                                            <Search className="w-5 h-5" />
                                            <span>Explore Documents</span>
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={connectWallet}
                                            disabled={wallet.connecting}
                                            className="w-full bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
                                        >
                                            {wallet.connecting ? 'Connecting...' : 'Connect Wallet'}
                                        </button>
                                        <Link
                                            to="/explore"
                                            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                                        >
                                            <Search className="w-5 h-5" />
                                            <span>Explore Documents</span>
                                        </Link>
                                    </>
                                )}
                            </div>

                            <div className="mt-6 pt-6 border-t border-white/20">
                                <div className="flex justify-center space-x-6 text-sm text-blue-100">
                                    <div className="flex items-center space-x-1">
                                        <Check className="w-4 h-4" />
                                        <span>End-to-End Encryption</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Check className="w-4 h-4" />
                                        <span>Bitcoin Storage</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Check className="w-4 h-4" />
                                        <span>Open Ordinal</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};