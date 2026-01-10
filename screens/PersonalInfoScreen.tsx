import React from 'react';
import type { NavigationProps } from '../types';
import { SCREENS } from '../constants';
import ScreenHeader from '../components/ScreenHeader';

const PersonalInfoScreen: React.FC<NavigationProps> = ({ navigate }) => {
    const InfoRow: React.FC<{ label: string; value: string; verified?: boolean }> = ({ label, value, verified }) => (
        <div className="flex justify-between items-center py-4 border-b border-gray-100">
            <span className="text-sm text-gray-500">{label}</span>
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-800">{value}</span>
                {verified && (
                    <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Verified
                    </span>
                )}
            </div>
        </div>
    );

    return (
        <div className="min-h-full bg-gray-50 pb-20">
            <ScreenHeader
                title="Personal Information"
                showBack={true}
                onBack={() => navigate(SCREENS.PROFILE)}
            />

            <div className="p-4 space-y-4">
                {/* Profile Photo */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <img
                                src="https://picsum.photos/100"
                                alt="Profile"
                                className="w-20 h-20 rounded-full border-4 border-primary/20"
                            />
                            <button className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full shadow-md">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                            </button>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Anusha Sharma</h2>
                            <p className="text-sm text-gray-500">Premium Investor</p>
                        </div>
                    </div>
                </div>

                {/* Personal Details */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Personal Details</h3>
                    <InfoRow label="Full Name" value="Anusha Sharma" verified />
                    <InfoRow label="Email" value="anusha.sharma@example.com" verified />
                    <InfoRow label="Phone" value="+91 98765 43210" verified />
                    <InfoRow label="Date of Birth" value="15 March 1990" />
                    <InfoRow label="Gender" value="Female" />
                </div>

                {/* Address */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Address</h3>
                    <InfoRow label="Address Line 1" value="42, Creative Lane" />
                    <InfoRow label="City" value="Mumbai" />
                    <InfoRow label="State" value="Maharashtra" />
                    <InfoRow label="PIN Code" value="400001" />
                    <InfoRow label="Country" value="India" />
                </div>

                {/* KYC Status */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">KYC Status</h3>
                    <InfoRow label="PAN" value="ABCDE1234F" verified />
                    <InfoRow label="Aadhaar" value="XXXX XXXX 5678" verified />
                    <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm font-medium text-green-800">KYC Fully Verified</span>
                        </div>
                    </div>
                </div>

                {/* Edit Button */}
                <button className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primary-dark transition-all">
                    Edit Profile
                </button>
            </div>
        </div>
    );
};

export default PersonalInfoScreen;
