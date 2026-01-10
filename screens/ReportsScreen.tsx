import React, { useState } from 'react';
import type { NavigationProps } from '../types';
import { SCREENS } from '../constants';
import ScreenHeader from '../components/ScreenHeader';

const ReportsScreen: React.FC<NavigationProps> = ({ navigate }) => {
    const [activeTab, setActiveTab] = useState<'statements' | 'contracts'>('statements');

    const statements = [
        { month: 'January 2026', size: '245 KB', date: '01 Jan 2026' },
        { month: 'December 2025', size: '312 KB', date: '01 Dec 2025' },
        { month: 'November 2025', size: '198 KB', date: '01 Nov 2025' },
        { month: 'October 2025', size: '276 KB', date: '01 Oct 2025' },
    ];

    const contracts = [
        { stock: 'NVDA', type: 'Buy', shares: 10, date: '15 Jan 2026' },
        { stock: 'AAPL', type: 'Buy', shares: 20, date: '10 Jan 2026' },
        { stock: 'GOOGL', type: 'Sell', shares: 5, date: '05 Jan 2026' },
    ];

    return (
        <div className="min-h-full bg-gray-50 pb-20">
            <ScreenHeader
                title="Reports & Statements"
                showBack={true}
                onBack={() => navigate(SCREENS.PROFILE)}
            />

            <div className="p-4 space-y-4">
                {/* Tabs */}
                <div className="flex bg-gray-100 p-1 rounded-xl">
                    <button
                        onClick={() => setActiveTab('statements')}
                        className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${activeTab === 'statements' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
                    >
                        Statements
                    </button>
                    <button
                        onClick={() => setActiveTab('contracts')}
                        className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${activeTab === 'contracts' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
                    >
                        Contract Notes
                    </button>
                </div>

                {activeTab === 'statements' ? (
                    <div className="space-y-3">
                        {statements.map((stmt, i) => (
                            <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800 text-sm">{stmt.month}</h3>
                                        <p className="text-xs text-gray-500">{stmt.size} • Generated {stmt.date}</p>
                                    </div>
                                </div>
                                <button className="p-2 text-primary hover:bg-secondary rounded-lg transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {contracts.map((contract, i) => (
                            <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${contract.type === 'Buy' ? 'bg-positive' : 'bg-negative'}`}>
                                        <span className="font-bold text-xs">{contract.type === 'Buy' ? 'B' : 'S'}</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800 text-sm">{contract.stock}</h3>
                                        <p className="text-xs text-gray-500">{contract.type} {contract.shares} shares • {contract.date}</p>
                                    </div>
                                </div>
                                <button className="p-2 text-primary hover:bg-secondary rounded-lg transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Request Custom Report */}
                <div className="bg-gradient-to-r from-primary to-primary-dark rounded-xl p-4 text-white">
                    <h3 className="font-bold mb-1">Need a Custom Report?</h3>
                    <p className="text-sm text-white/70 mb-3">Generate reports for any custom date range</p>
                    <button className="w-full py-3 bg-white text-primary font-bold rounded-lg hover:bg-gray-100 transition-colors">
                        Request Custom Report
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReportsScreen;
