import React, { useState } from 'react';
import type { NavigationProps } from '../types';
import { SCREENS } from '../constants';
import ScreenHeader from '../components/ScreenHeader';

const BankAutoPayScreen: React.FC<NavigationProps> = ({ navigate }) => {
    const [autoPayEnabled, setAutoPayEnabled] = useState(true);

    const banks = [
        {
            name: 'HDFC Bank',
            accountNo: 'XXXX XXXX 4521',
            type: 'Savings',
            isPrimary: true,
            color: 'from-primary to-primary-dark',
            letterBg: 'bg-primary',
            ifsc: 'HDFC0001234'
        },
        {
            name: 'ICICI Bank',
            accountNo: 'XXXX XXXX 7892',
            type: 'Current',
            isPrimary: false,
            color: 'from-purple-600 to-primary',
            letterBg: 'bg-purple-600',
            ifsc: 'ICIC0005678'
        },
    ];

    const BankCard: React.FC<{ bank: typeof banks[0] }> = ({ bank }) => (
        <div className={`bg-white rounded-xl overflow-hidden shadow-sm border ${bank.isPrimary ? 'border-primary' : 'border-gray-100'} relative`}>
            {/* Bank Header Strip */}
            <div className={`bg-gradient-to-r ${bank.color} px-4 py-2 flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                        <span className="text-xs font-black text-primary">
                            {bank.name.includes('HDFC') ? 'HDFC' : 'ICICI'}
                        </span>
                    </div>
                    <span className="text-white font-bold text-sm">{bank.name}</span>
                </div>
                {bank.isPrimary && (
                    <span className="bg-white/20 text-white text-[9px] font-bold px-2 py-0.5 rounded-full border border-white/30">
                        Primary
                    </span>
                )}
            </div>
            {/* Account Details */}
            <div className="p-3">
                <div className="flex justify-between items-center mb-2">
                    <div>
                        <p className="text-xs text-gray-500">{bank.type} Account</p>
                        <p className="font-mono font-bold text-gray-800 text-sm tracking-wider">{bank.accountNo}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] text-gray-400">IFSC</p>
                        <p className="text-xs font-medium text-gray-600">{bank.ifsc}</p>
                    </div>
                </div>
                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                    <button className="flex-1 py-1.5 text-xs font-medium text-primary border border-primary rounded-lg hover:bg-secondary transition-colors">
                        Edit
                    </button>
                    {!bank.isPrimary && (
                        <button className="flex-1 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            Set Primary
                        </button>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-full bg-gray-50 pb-20">
            <ScreenHeader
                title="Bank & Auto-Pay"
                showBack={true}
                onBack={() => navigate(SCREENS.PROFILE)}
            />

            <div className="p-4 space-y-4">
                {/* Account Aggregator Section */}
                <div className="bg-gradient-to-r from-primary to-primary-dark rounded-xl p-4 text-white">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                                <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-sm">Account Aggregator Linked</h3>
                            <p className="text-xs text-white/70 mt-0.5">
                                Your bank accounts are securely linked via RBI-licensed Account Aggregator for seamless fund transfers.
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white/20 rounded-full text-[10px] font-medium">
                                    <svg className="w-3 h-3 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    RBI Licensed
                                </span>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white/20 rounded-full text-[10px] font-medium">
                                    <svg className="w-3 h-3 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                    Encrypted
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Auto-Pay Section */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-gray-800 text-sm">Auto-Pay (SIP)</h3>
                            <p className="text-xs text-gray-500">Automatically fund your investments</p>
                        </div>
                        <button
                            onClick={() => setAutoPayEnabled(!autoPayEnabled)}
                            className={`w-11 h-6 rounded-full transition-all relative ${autoPayEnabled ? 'bg-primary' : 'bg-gray-300'}`}
                        >
                            <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 shadow-md transition-all ${autoPayEnabled ? 'right-0.5' : 'left-0.5'}`} />
                        </button>
                    </div>
                    {autoPayEnabled && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                            <div className="flex justify-between items-center text-xs mb-1.5">
                                <span className="text-gray-500">Monthly Amount</span>
                                <span className="font-bold text-gray-800">₹10,000</span>
                            </div>
                            <div className="flex justify-between items-center text-xs mb-1.5">
                                <span className="text-gray-500">Debit From</span>
                                <span className="font-medium text-gray-700">HDFC Bank •• 4521</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-gray-500">Next Debit</span>
                                <span className="font-medium text-primary">1st Feb, 2026</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Linked Banks */}
                <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-1">Linked Bank Accounts</h3>
                    <div className="space-y-3">
                        {banks.map((bank, i) => <BankCard key={i} bank={bank} />)}
                    </div>
                </div>

                {/* Add Bank via AA */}
                <button className="w-full py-3 bg-white text-primary font-bold rounded-xl border-2 border-dashed border-primary/30 hover:bg-secondary transition-all flex items-center justify-center gap-2 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Link Bank via Account Aggregator
                </button>

                {/* LRS Info */}
                <div className="bg-secondary rounded-xl p-3 border border-primary/10">
                    <div className="flex gap-2">
                        <svg className="w-5 h-5 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <div>
                            <h4 className="font-bold text-primary-dark text-xs">LRS Remittance</h4>
                            <p className="text-[10px] text-gray-600 mt-0.5 leading-relaxed">
                                Under RBI's Liberalised Remittance Scheme, you can invest up to $250,000 per financial year in global markets.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BankAutoPayScreen;
