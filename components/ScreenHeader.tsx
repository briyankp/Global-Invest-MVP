import React from 'react';
import ChevronLeftIcon from './icons/ChevronLeftIcon';

interface ScreenHeaderProps {
    title: string;
    subtitle?: string;
    rightElement?: React.ReactNode;
    showBack?: boolean;
    onBack?: () => void;
    children?: React.ReactNode;
    className?: string;
}

const ScreenHeader: React.FC<ScreenHeaderProps> = ({
    title,
    subtitle,
    rightElement,
    showBack,
    onBack,
    children,
    className = ''
}) => {
    return (
        <header className={`bg-gradient-to-br from-primary to-primary-dark text-white p-3 min-h-[140px] rounded-b-[2rem] shadow-xl shadow-primary/20 relative z-10 flex flex-col ${className}`}>
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                    {showBack && (
                        <button
                            onClick={onBack}
                            className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors"
                        >
                            <ChevronLeftIcon />
                        </button>
                    )}
                    <div>
                        <h1 className="text-2xl font-bold leading-tight">{title}</h1>
                        {subtitle && <p className="text-white/80 text-sm mt-0.5">{subtitle}</p>}
                    </div>
                </div>
                {rightElement && (
                    <div className="ml-4">
                        {rightElement}
                    </div>
                )}
            </div>
            {children && (
                <div className="mt-4">
                    {children}
                </div>
            )}
        </header>
    );
};

export default ScreenHeader;
