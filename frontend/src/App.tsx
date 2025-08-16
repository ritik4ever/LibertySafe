import React, { useState } from 'react';
import { Shield, Upload, Search, Lock, Bitcoin, Globe, Check, Menu, X, File, Calendar, Users, Star, Heart } from 'lucide-react';

function App() {
    const [isWalletConnected, setIsWalletConnected] = useState(true); // Default connected for demo
    const [isConnecting, setIsConnecting] = useState(false);
    const [currentPage, setCurrentPage] = useState('home');
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'journalism'
    });

    const connectWallet = async () => {
        setIsConnecting(true);
        setTimeout(() => {
            setIsWalletConnected(true);
            setIsConnecting(false);
        }, 2000);
    };

    const disconnectWallet = () => {
        setIsWalletConnected(false);
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            setUploadedFiles(Array.from(files));
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files) {
            setUploadedFiles(Array.from(files));
        }
    };

    const submitUpload = () => {
        if (uploadedFiles.length > 0 && formData.title) {
            alert(`Successfully uploaded ${uploadedFiles.length} file(s) to Bitcoin blockchain!\n\nTitle: ${formData.title}\nCategory: ${formData.category}\nFiles: ${uploadedFiles.map(f => f.name).join(', ')}`);
            // Reset form
            setUploadedFiles([]);
            setFormData({ title: '', description: '', category: 'journalism' });
            setCurrentPage('explore');
        } else {
            alert('Please add files and enter a title');
        }
    };

    const Header = () => (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
                        <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-xl text-gray-900">LibertySafe</span>
                    </div>

                    <nav className="hidden md:flex items-center space-x-8">
                        <button
                            onClick={() => setCurrentPage('explore')}
                            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === 'explore'
                                ? 'bg-gray-100 text-gray-900'
                                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            <Search className="w-4 h-4" />
                            <span>Explore</span>
                        </button>
                        <button
                            onClick={() => setCurrentPage('upload')}
                            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === 'upload'
                                ? 'bg-gray-100 text-gray-900'
                                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            <Upload className="w-4 h-4" />
                            <span>Upload</span>
                        </button>
                    </nav>

                    <div className="flex items-center space-x-4">
                        {isWalletConnected ? (
                            <div className="flex items-center space-x-3">
                                <div className="hidden sm:flex items-center space-x-2 bg-gray-100 rounded-full px-3 py-2">
                                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                        <Check className="w-3 h-3 text-white" />
                                    </div>
                                    <div className="text-sm">
                                        <div className="text-gray-900 font-medium">bc1qw5...f3t4</div>
                                        <div className="text-gray-500 text-xs">50,000 sats</div>
                                    </div>
                                </div>
                                <button
                                    onClick={disconnectWallet}
                                    className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Disconnect
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={connectWallet}
                                disabled={isConnecting}
                                className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );

    const HomePage = () => (
        <div className="bg-white">
            {/* Hero Section */}
            <section className="relative bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="mb-8">
                            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
                                <Shield className="w-10 h-10 text-white" />
                            </div>
                            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                                LibertySafe
                            </h1>
                            <p className="text-xl md:text-2xl text-gray-600 mb-8 font-light">
                                Freedom of Information, Protected Forever
                            </p>
                            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                                Censorship-resistant document storage on Bitcoin's blockchain using end-to-end encryption and the complete Open Ordinal stack.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                            <button
                                onClick={() => setCurrentPage('upload')}
                                className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg flex items-center justify-center space-x-2"
                            >
                                <Upload className="w-5 h-5" />
                                <span>Upload Document</span>
                            </button>
                            <button
                                onClick={() => setCurrentPage('explore')}
                                className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center space-x-2"
                            >
                                <Search className="w-5 h-5" />
                                <span>Explore Documents</span>
                            </button>
                        </div>

                        <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500">
                            <div className="flex items-center space-x-2">
                                <Lock className="w-4 h-4 text-green-600" />
                                <span>End-to-End Encryption</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Bitcoin className="w-4 h-4 text-orange-500" />
                                <span>Bitcoin Storage</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Globe className="w-4 h-4 text-blue-500" />
                                <span>Open Ordinal Protocol</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="bg-gray-50 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Why Choose LibertySafe?
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Built for journalists, activists, whistleblowers, and anyone who values freedom of information.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Lock,
                                title: 'End-to-End Encryption',
                                desc: 'Your documents are encrypted before upload and can only be decrypted by you.',
                                color: 'text-green-600'
                            },
                            {
                                icon: Bitcoin,
                                title: 'Bitcoin Storage',
                                desc: 'Documents are inscribed on Bitcoin blockchain for permanent, censorship-resistant storage.',
                                color: 'text-orange-500'
                            },
                            {
                                icon: Globe,
                                title: 'Open Ordinal Protocol',
                                desc: 'Built on open standards ensuring interoperability and future-proof access.',
                                color: 'text-blue-500'
                            }
                        ].map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div key={index} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                                    <div className={`w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center mb-6`}>
                                        <Icon className={`w-6 h-6 ${feature.color}`} />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {feature.desc}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        {[
                            { label: 'Documents Stored', value: '1,247', description: 'Permanently preserved' },
                            { label: 'Countries Served', value: '89', description: 'Global access' },
                            { label: 'Uptime', value: '99.9%', description: 'Blockchain reliability' },
                        ].map((stat, index) => (
                            <div key={index}>
                                <div className="text-4xl font-bold text-gray-900 mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-lg font-semibold text-gray-900 mb-1">
                                    {stat.label}
                                </div>
                                <div className="text-gray-600">
                                    {stat.description}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );

    const ExplorePage = () => (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Explore Documents
                    </h1>
                    <p className="text-gray-600">
                        Discover censorship-resistant documents stored on Bitcoin blockchain.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[
                        { title: 'Investigative Report #1', category: 'Journalism', time: '2 hours ago', verified: true, type: 'PDF' },
                        { title: 'Whistleblower Document', category: 'Activism', time: '4 hours ago', verified: true, type: 'DOC' },
                        { title: 'Research Paper', category: 'Research', time: '6 hours ago', verified: false, type: 'PDF' },
                        { title: 'Legal Filing', category: 'Legal', time: '8 hours ago', verified: true, type: 'PDF' },
                        { title: 'News Article Draft', category: 'Journalism', time: '12 hours ago', verified: true, type: 'TXT' },
                        { title: 'Government Leak', category: 'Whistleblowing', time: '1 day ago', verified: true, type: 'DOC' },
                        { title: 'Academic Study', category: 'Research', time: '2 days ago', verified: false, type: 'PDF' },
                        { title: 'Court Document', category: 'Legal', time: '3 days ago', verified: true, type: 'PDF' },
                    ].map((doc, i) => (
                        <div key={i} className="bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow cursor-pointer group">
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                            <File className="w-5 h-5 text-gray-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 group-hover:text-gray-700 transition-colors line-clamp-2">
                                                {doc.title}
                                            </h3>
                                            <p className="text-sm text-gray-500">{doc.time}</p>
                                        </div>
                                    </div>
                                    <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Heart className="w-5 h-5 text-gray-400 hover:text-red-500" />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">
                                            {doc.category}
                                        </span>
                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                                            {doc.type}
                                        </span>
                                    </div>
                                    {doc.verified && (
                                        <div className="flex items-center space-x-1 text-green-600">
                                            <Check className="w-4 h-4" />
                                            <span className="text-xs font-medium">Verified</span>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
                                    <span className="flex items-center space-x-1">
                                        <Lock className="w-3 h-3" />
                                        <span>Encrypted</span>
                                    </span>
                                    <span className="flex items-center space-x-1">
                                        <Bitcoin className="w-3 h-3" />
                                        <span>On-chain</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const UploadPage = () => (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Upload Document
                    </h1>
                    <p className="text-gray-600">
                        Securely store your documents on the Bitcoin blockchain with end-to-end encryption.
                    </p>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 p-8">
                    {/* File Upload Area */}
                    <div
                        className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-gray-400 transition-colors cursor-pointer mb-8"
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onClick={() => document.getElementById('file-input')?.click()}
                    >
                        <input
                            id="file-input"
                            type="file"
                            multiple
                            onChange={handleFileUpload}
                            className="hidden"
                            accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.mp4,.mp3"
                        />
                        <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {uploadedFiles.length > 0 ? `${uploadedFiles.length} file(s) selected` : 'Drop your files here'}
                        </h3>
                        <p className="text-gray-600 mb-4">
                            or click to browse from your computer
                        </p>
                        <p className="text-sm text-gray-500">
                            PDF, DOC, TXT, Images, Videos, Audio (max 50MB each)
                        </p>

                        {uploadedFiles.length > 0 && (
                            <div className="mt-6 space-y-2">
                                {uploadedFiles.map((file, index) => (
                                    <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                                        <div className="flex items-center space-x-3">
                                            <File className="w-5 h-5 text-gray-500" />
                                            <div className="text-left">
                                                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                                <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setUploadedFiles(files => files.filter((_, i) => i !== index));
                                            }}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Form Fields */}
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Document Title *
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                                placeholder="Enter document title"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Category
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                            >
                                <option value="journalism">Journalism</option>
                                <option value="activism">Activism</option>
                                <option value="whistleblowing">Whistleblowing</option>
                                <option value="research">Research</option>
                                <option value="legal">Legal Documents</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="mb-8">
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors h-24"
                            placeholder="Describe your document..."
                        />
                    </div>

                    {/* Privacy Settings */}
                    <div className="bg-gray-50 rounded-xl p-6 mb-8">
                        <h4 className="font-semibold text-gray-900 mb-6">Privacy & Security</h4>
                        <div className="space-y-4">
                            {[
                                { icon: Lock, label: 'End-to-End Encryption', desc: 'Encrypt files before upload (recommended)', enabled: true, color: 'text-green-600' },
                                { icon: Globe, label: 'Public Access', desc: 'Allow others to discover this document', enabled: true, color: 'text-blue-500' },
                                { icon: Bitcoin, label: 'Bitcoin Storage', desc: 'Store permanently on Bitcoin blockchain', enabled: true, color: 'text-orange-500' },
                            ].map((setting, i) => {
                                const Icon = setting.icon;
                                return (
                                    <div key={i} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                                                <Icon className={`w-5 h-5 ${setting.color}`} />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{setting.label}</p>
                                                <p className="text-sm text-gray-600">{setting.desc}</p>
                                            </div>
                                        </div>
                                        <div className={`w-12 h-6 rounded-full ${setting.enabled ? 'bg-green-500' : 'bg-gray-300'} relative cursor-pointer`}>
                                            <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform shadow ${setting.enabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-4">
                        <button
                            onClick={() => setCurrentPage('home')}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={submitUpload}
                            disabled={!isWalletConnected || uploadedFiles.length === 0 || !formData.title}
                            className="px-8 py-3 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
                        >
                            {isWalletConnected ? 'Upload to Blockchain' : 'Connect Wallet First'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderPage = () => {
        switch (currentPage) {
            case 'explore': return <ExplorePage />;
            case 'upload': return <UploadPage />;
            default: return <HomePage />;
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Header />
            {renderPage()}
        </div>
    );
}

export default App;