import React, { useState } from 'react';
import type { NavigationProps } from '../types';
import { SCREENS } from '../constants';
import ScreenHeader from '../components/ScreenHeader';

const TaxReportScreen: React.FC<NavigationProps> = ({ navigate }) => {
    const [selectedYear, setSelectedYear] = useState('FY 2025-26');
    const [isGenerating, setIsGenerating] = useState(false);

    const years = ['FY 2025-26', 'FY 2024-25', 'FY 2023-24'];

    const taxSummary = {
        totalGains: 45250,
        shortTermGains: 12500,
        longTermGains: 32750,
        dividends: 3200,
        taxPayable: 8525,
    };

    const handleGenerate = () => {
        setIsGenerating(true);
        setTimeout(() => setIsGenerating(false), 2000);
    };

    return (
        <div className="min-h-full bg-gray-50 pb-20">
            <ScreenHeader
                title="Tax Reports"
                showBack={true}
                onBack={() => navigate(SCREENS.PROFILE)}
            />

            <div className="p-4 space-y-4">
                {/* Year Selector */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Financial Year</h3>
                    <div className="flex gap-2">
                        {years.map(year => (
                            <button
                                key={year}
                                onClick={() => setSelectedYear(year)}
                                className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${selectedYear === year
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {year}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tax Summary */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Tax Summary</h3>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-600">Short-Term Capital Gains</span>
                            <span className="font-bold text-gray-800">₹{taxSummary.shortTermGains.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-600">Long-Term Capital Gains</span>
                            <span className="font-bold text-gray-800">₹{taxSummary.longTermGains.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-600">Dividend Income</span>
                            <span className="font-bold text-gray-800">₹{taxSummary.dividends.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-600">Total Gains</span>
                            <span className="font-bold text-positive">₹{taxSummary.totalGains.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between items-center py-3 bg-red-50 rounded-lg px-3 -mx-1">
                            <span className="text-sm font-medium text-red-700">Estimated Tax Payable</span>
                            <span className="font-bold text-red-700">₹{taxSummary.taxPayable.toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                </div>

                {/* Available Reports */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Available Reports</h3>

                    <div className="space-y-3">
                        {[
                            { name: 'Capital Gains Statement', desc: 'Detailed P&L for all trades' },
                            { name: 'Dividend Summary', desc: 'All dividend receipts' },
                            { name: 'Form 16A', desc: 'TDS certificates from dividends' },
                            { name: 'Schedule FA', desc: 'Foreign asset disclosure' },
                        ].map((report, i) => (
                            <button key={i} className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <div className="text-left">
                                        <h4 className="font-medium text-gray-800 text-sm">{report.name}</h4>
                                        <p className="text-xs text-gray-500">{report.desc}</p>
                                    </div>
                                </div>
                                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Generate Button */}
                <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primary-dark transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {isGenerating ? (
                        <>
                            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Generating Report...
                        </>
                    ) : (
                        'Generate Complete Tax Report'
                    )}
                </button>

                {/* Disclaimer */}
                <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                    <div className="flex gap-3">
                        <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <p className="text-xs text-yellow-700">
                            <strong>Disclaimer:</strong> These are indicative calculations only. Please consult a qualified tax professional for accurate tax advice.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaxReportScreen;
