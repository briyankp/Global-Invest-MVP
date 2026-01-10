import React, { useState } from 'react';
import type { NavigationProps } from '../types';
import { SCREENS } from '../constants';
import ScreenHeader from '../components/ScreenHeader';

const NotificationsScreen: React.FC<NavigationProps> = ({ navigate }) => {
    const [settings, setSettings] = useState({
        pushEnabled: true,
        emailEnabled: true,
        priceAlerts: true,
        tradeConfirmations: true,
        portfolioUpdates: true,
        aiInsights: true,
        marketing: false,
        weeklyDigest: true,
    });

    const toggle = (key: keyof typeof settings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const ToggleRow: React.FC<{ title: string; description?: string; settingKey: keyof typeof settings }> = ({ title, description, settingKey }) => (
        <div className="flex justify-between items-center py-4 border-b border-gray-100 last:border-0">
            <div>
                <h3 className="font-medium text-gray-800 text-sm">{title}</h3>
                {description && <p className="text-xs text-gray-500">{description}</p>}
            </div>
            <button
                onClick={() => toggle(settingKey)}
                className={`w-12 h-6 rounded-full transition-all relative ${settings[settingKey] ? 'bg-primary' : 'bg-gray-300'}`}
            >
                <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 shadow-md transition-all ${settings[settingKey] ? 'right-0.5' : 'left-0.5'}`} />
            </button>
        </div>
    );

    return (
        <div className="min-h-full bg-gray-50 pb-20">
            <ScreenHeader
                title="Notifications"
                showBack={true}
                onBack={() => navigate(SCREENS.PROFILE)}
            />

            <div className="p-4 space-y-4">
                {/* Channels */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Notification Channels</h3>
                    <ToggleRow title="Push Notifications" description="Receive alerts on your device" settingKey="pushEnabled" />
                    <ToggleRow title="Email Notifications" description="Get updates in your inbox" settingKey="emailEnabled" />
                </div>

                {/* Alert Types */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Alert Types</h3>
                    <ToggleRow title="Price Alerts" description="When stocks hit your target price" settingKey="priceAlerts" />
                    <ToggleRow title="Trade Confirmations" description="Order executed notifications" settingKey="tradeConfirmations" />
                    <ToggleRow title="Portfolio Updates" description="Daily P&L and holdings changes" settingKey="portfolioUpdates" />
                    <ToggleRow title="AI Insights" description="New investment opportunities" settingKey="aiInsights" />
                </div>

                {/* Other */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Other</h3>
                    <ToggleRow title="Weekly Digest" description="Summary of your portfolio performance" settingKey="weeklyDigest" />
                    <ToggleRow title="Marketing & Promotions" description="New features and offers" settingKey="marketing" />
                </div>

                {/* Quiet Hours */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="font-medium text-gray-800 text-sm">Quiet Hours</h3>
                            <p className="text-xs text-gray-500">No notifications during set times</p>
                        </div>
                        <button className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-secondary transition-colors">
                            Configure
                        </button>
                    </div>
                </div>

                {/* Info */}
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <div className="flex gap-3">
                        <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <p className="text-xs text-blue-700">
                            We'll always notify you about security-related events regardless of your preferences.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationsScreen;
