import React from 'react';
import ChevronRightIcon from '../components/icons/ChevronRightIcon';
import ScreenHeader from '../components/ScreenHeader';

interface ProfileScreenProps {
    onLogout: () => void;
    onInstall: () => void;
    canInstall: boolean;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ onLogout, onInstall, canInstall }) => {

    // Inline Icons for Profile
    const MobileIcon = () => (
        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
    );

    // ... existing icons ...

    const UserIcon = () => (
        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
    );

    const BankIcon = () => (
        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
        </svg>
    );

    const DocumentIcon = () => (
        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    );

    const MenuItem: React.FC<{ label: string; icon?: React.ReactNode; badge?: string; isDestructive?: boolean; onClick?: () => void }> = ({ label, icon, badge, isDestructive, onClick }) => (
        <button onClick={onClick} className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors group">
            <div className="flex items-center gap-3">
                {icon}
                <span className={`font-medium text-sm ${isDestructive ? 'text-red-500' : 'text-gray-700'}`}>{label}</span>
            </div>
            <div className="flex items-center gap-2">
                {badge && <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full font-bold">{badge}</span>}
                <ChevronRightIcon />
            </div>
        </button>
    );

    return (
        <div className="min-h-full bg-gray-50 pb-20">
            <ScreenHeader title="My Profile">
                <div className="flex items-center gap-4 mt-2 mb-1">
                    <div className="relative">
                        <img
                            src="https://picsum.photos/100"
                            alt="Profile"
                            className="w-16 h-16 rounded-full border-2 border-white/20"
                        />
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-primary rounded-full"></div>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white leading-tight">Anusha Sharma</h2>
                        <p className="text-white/70 text-sm">anusha.sharma@example.com</p>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="px-2 py-0.5 bg-white/20 rounded-md text-[10px] font-semibold text-white/90">
                                Premium Investor
                            </span>
                        </div>
                    </div>
                </div>
            </ScreenHeader>

            <div className="p-4 space-y-4 relative z-20">
                {/* Install App Section - Only shows if installable */}
                {canInstall && (
                    <section>
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">App Experience</h3>
                        <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                            <MenuItem icon={<MobileIcon />} label="Install App" badge="Free" onClick={onInstall} />
                        </div>
                    </section>
                )}

                <section>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Account</h3>
                    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                        <MenuItem icon={<UserIcon />} label="Personal Information" />
                        <div className="h-[1px] bg-gray-50 mx-12"></div>
                        <MenuItem icon={<BankIcon />} label="Bank & Auto-Pay" />
                        <div className="h-[1px] bg-gray-50 mx-12"></div>
                        <MenuItem icon={<DocumentIcon />} label="Reports & Statements" />
                    </div>
                </section>

                <div className="space-y-2 mt-6">
                    <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider px-2 mb-1">Settings & Support</h2>
                    <MenuItem label="Security (Password & Biometrics)" />
                    <MenuItem label="Notifications" />
                    <MenuItem label="Help Center / FAQs" />
                    <MenuItem label="Contact Support" />
                    <MenuItem label="Generate Tax Report" />
                </div>

                <div className="mt-8">
                    <MenuItem label="Log Out" isDestructive onClick={onLogout} />
                </div>
            </div>
        </div>
    );
};

export default ProfileScreen;