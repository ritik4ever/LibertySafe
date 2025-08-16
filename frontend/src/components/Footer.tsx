import React from 'react';
import { Shield, Github, Twitter, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    const links = {
        product: [
            { name: 'Features', href: '#' },
            { name: 'Security', href: '#' },
            { name: 'API', href: '#' },
            { name: 'Documentation', href: '#' },
        ],
        support: [
            { name: 'Help Center', href: '#' },
            { name: 'Community', href: '#' },
            { name: 'Contact', href: '#' },
            { name: 'Status', href: '#' },
        ],
        legal: [
            { name: 'Privacy', href: '#' },
            { name: 'Terms', href: '#' },
            { name: 'Security', href: '#' },
            { name: 'Compliance', href: '#' },
        ],
    };

    const social = [
        { name: 'GitHub', href: '#', icon: Github },
        { name: 'Twitter', href: '#', icon: Twitter },
        { name: 'Website', href: '#', icon: Globe },
    ];

    return (
        <footer className="bg-white dark:bg-dark-800 border-t border-gray-200 dark:border-dark-700">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="xl:grid xl:grid-cols-3 xl:gap-8">
                    <div className="space-y-8 xl:col-span-1">
                        <div className="flex items-center space-x-2">
                            <Shield className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                            <span className="text-xl font-bold text-gray-900 dark:text-white">
                                LibertySafe
                            </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-base max-w-md">
                            Empowering journalists, activists, and whistleblowers with censorship-resistant
                            document storage on Bitcoin's blockchain.
                        </p>
                        <div className="flex space-x-6">
                            {social.map((item) => (

                                key = { item.name }
                  href = { item.href }
                  className = "text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-6 w-6" />
                </a>
              ))}
                    </div>
                </div>
                <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
                    <div className="md:grid md:grid-cols-2 md:gap-8">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase">
                                Product
                            </h3>
                            <ul className="mt-4 space-y-4">
                                {links.product.map((item) => (
                                    <li key={item.name}>

                                        href={item.href}
                                        className="text-base text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      >
                                        {item.name}
                                    </a>
                    </li>
                  ))}
                        </ul>
                    </div>
                    <div className="mt-12 md:mt-0">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase">
                            Support
                        </h3>
                        <ul className="mt-4 space-y-4">
                            {links.support.map((item) => (
                                <li key={item.name}>

                                    href={item.href}
                                    className="text-base text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      >
                                    {item.name}
                                </a>
                    </li>
                  ))}
                    </ul>
                </div>
            </div>
            <div className="md:grid md:grid-cols-1 md:gap-8">
                <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase">
                        Legal
                    </h3>
                    <ul className="mt-4 space-y-4">
                        {links.legal.map((item) => (
                            <li key={item.name}>

                                href={item.href}
                                className="text-base text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      >
                                {item.name}
                            </a>
                    </li>
                  ))}
                </ul>
            </div>
        </div>
          </div >
        </div >
    <div className="mt-12 border-t border-gray-200 dark:border-dark-700 pt-8">
        <div className="flex items-center justify-between">
            <p className="text-base text-gray-600 dark:text-gray-400">
                &copy; {currentYear} LibertySafe. Built for freedom.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <span>Powered by</span>
                <span className="font-semibold text-primary-600 dark:text-primary-400">
                    Open Ordinal Stack
                </span>
            </div>
        </div>
    </div>
      </div >
    </footer >
  );
};