import React, { useState } from 'react';
import type { NavigationProps } from '../types';
import { SCREENS } from '../constants';
import ScreenHeader from '../components/ScreenHeader';

const HelpCenterScreen: React.FC<NavigationProps> = ({ navigate }) => {
    const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

    const faqs = [
        {
            question: 'How do I start investing in US stocks?',
            answer: 'Simply complete your KYC verification (PAN & Aadhaar), link your bank account, fund your account via LRS remittance, and start trading! Our AI banker can guide you through the process step by step.'
        },
        {
            question: 'What is the Liberalised Remittance Scheme (LRS)?',
            answer: 'LRS is an RBI scheme that allows Indian residents to remit up to $250,000 per financial year for permitted capital account transactions, including investments in foreign securities.'
        },
        {
            question: 'Are my investments safe?',
            answer: 'Yes! Your investments are held with Interactive Brokers, a regulated US broker. Securities are protected by SIPC insurance up to $500,000. We also use bank-grade 256-bit encryption for all transactions.'
        },
        {
            question: 'What are the charges for trading?',
            answer: 'We charge a competitive commission of 0.05% per trade (minimum $1). There are no account maintenance fees, and currency conversion is done at interbank rates with a minimal spread.'
        },
        {
            question: 'How do I withdraw my money?',
            answer: 'You can withdraw funds anytime by selling your holdings and requesting a wire transfer to your linked bank account. Funds typically arrive within 3-5 business days.'
        },
        {
            question: 'What are AI-Managed Portfolios?',
            answer: 'These are thematic portfolios curated by our AI based on market trends and investment themes. The AI continuously monitors and rebalances these portfolios to optimize returns.'
        },
    ];

    const FaqItem: React.FC<{ faq: typeof faqs[0]; index: number }> = ({ faq, index }) => {
        const isExpanded = expandedFaq === index;
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <button
                    onClick={() => setExpandedFaq(isExpanded ? null : index)}
                    className="w-full flex justify-between items-center p-4 text-left"
                >
                    <span className="font-medium text-gray-800 text-sm pr-4">{faq.question}</span>
                    <svg
                        className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
                {isExpanded && (
                    <div className="px-4 pb-4 animate-fadeIn">
                        <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-full bg-gray-50 pb-20">
            <ScreenHeader
                title="Help Center"
                showBack={true}
                onBack={() => navigate(SCREENS.PROFILE)}
            />

            <div className="p-4 space-y-4">
                {/* Search */}
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search for help..."
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                    />
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>

                {/* Quick Links */}
                <div className="grid grid-cols-2 gap-3">
                    <button className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center gap-2 hover:bg-secondary transition-colors">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <span className="text-xs font-medium text-gray-800">Getting Started</span>
                    </button>
                    <button className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center gap-2 hover:bg-secondary transition-colors">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                        </div>
                        <span className="text-xs font-medium text-gray-800">Payments & Tax</span>
                    </button>
                    <button className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center gap-2 hover:bg-secondary transition-colors">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <span className="text-xs font-medium text-gray-800">Trading Guide</span>
                    </button>
                    <button className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center gap-2 hover:bg-secondary transition-colors">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <span className="text-xs font-medium text-gray-800">Security</span>
                    </button>
                </div>

                {/* FAQs */}
                <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-1">Frequently Asked Questions</h3>
                    <div className="space-y-3">
                        {faqs.map((faq, i) => <FaqItem key={i} faq={faq} index={i} />)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpCenterScreen;
