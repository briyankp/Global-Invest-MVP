import React, { useState } from 'react';
import type { NavigationProps } from '../types';
import { SCREENS } from '../constants';
import ScreenHeader from '../components/ScreenHeader';

const SecurityScreen: React.FC<NavigationProps> = ({ navigate }) => {
    const [biometricsEnabled, setBiometricsEnabled] = useState(true);
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

    const ToggleRow: React.FC<{ title: string; description: string; enabled: boolean; onToggle: () => void }> = ({ title, description, enabled, onToggle }) => (
        <div className="flex justify-between items-center py-4 border-b border-gray-100">
            <div>
                <h3 className="font-medium text-gray-800 text-sm">{title}</h3>
                <p className="text-xs text-gray-500">{description}</p>
            </div>
            <button
                onClick={onToggle}
                className={`w-12 h-6 rounded-full transition-all relative ${enabled ? 'bg-primary' : 'bg-gray-300'}`}
            >
                <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 shadow-md transition-all ${enabled ? 'right-0.5' : 'left-0.5'}`} />
            </button>
        </div>
    );

    const ActionRow: React.FC<{ title: string; description: string; icon: React.ReactNode }> = ({ title, description, icon }) => (
        <button className="w-full flex items-center gap-4 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                {icon}
            </div>
            <div className="flex-1 text-left">
                <h3 className="font-medium text-gray-800 text-sm">{title}</h3>
                <p className="text-xs text-gray-500">{description}</p>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
        </button>
    );

    return (
        <div className="min-h-full bg-gray-50 pb-20">
            <ScreenHeader
                title="Security"
                showBack={true}
                onBack={() => navigate(SCREENS.PROFILE)}
            />

            <div className="p-4 space-y-4">
                {/* Security Status */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 text-white">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Account Secure</h3>
                            <p className="text-sm text-white/80">All security features enabled</p>
                        </div>
                    </div>
                </div>

                {/* Authentication */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Authentication</h3>
                    <ToggleRow
                        title="Face ID / Touch ID"
                        description="Use biometrics to log in"
                        enabled={biometricsEnabled}
                        onToggle={() => setBiometricsEnabled(!biometricsEnabled)}
                    />
                    <ToggleRow
                        title="Two-Factor Authentication"
                        description="Extra security for your account"
                        enabled={twoFactorEnabled}
                        onToggle={() => setTwoFactorEnabled(!twoFactorEnabled)}
                    />
                </div>

                {/* Password & PIN */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Password & PIN</h3>
                    <ActionRow
                        title="Change Password"
                        description="Last changed 30 days ago"
                        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>}
                    />
                    <ActionRow
                        title="Change Trading PIN"
                        description="4-digit PIN for trades"
                        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>}
                    />
                </div>

                {/* Activity */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Activity</h3>
                    <ActionRow
                        title="Active Sessions"
                        description="1 device currently logged in"
                        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                    />
                    <ActionRow
                        title="Login History"
                        description="View recent login activity"
                        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    />
                </div>
            </div>
        </div>
    );
};

export default SecurityScreen;
