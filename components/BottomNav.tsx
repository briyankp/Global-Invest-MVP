
import React from 'react';
import type { Screen } from '../types';
import { SCREENS } from '../constants';
import HomeIcon from './icons/HomeIcon';
import SearchIcon from './icons/SearchIcon';
import PortfolioIcon from './icons/PortfolioIcon';
import SparklesIcon from './icons/SparklesIcon';
import UserIcon from './icons/UserIcon';

interface BottomNavProps {
    currentScreen: Screen;
    navigate: (screen: Screen) => void;
}

const NavItem: React.FC<{
    label: string;
    icon: React.ReactNode;
    isActive: boolean;
    onClick: () => void;
    isHighlighted?: boolean;
}> = ({ label, icon, isActive, onClick, isHighlighted }) => {
    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center justify-center w-1/5 pt-2 pb-1 transition-all duration-200 ${isActive ? 'scale-105' : 'hover:scale-105'
                }`}
        >
            <div className={`w-7 h-7 p-1 rounded-xl transition-all duration-200 ${isActive
                    ? isHighlighted
                        ? 'bg-primary text-white shadow-lg shadow-primary/30'
                        : 'text-primary'
                    : 'text-gray-400'
                }`}>
                {icon}
            </div>
            <span className={`text-[10px] mt-1 font-medium transition-colors duration-200 ${isActive ? 'text-primary' : 'text-gray-400'
                }`}>
                {label}
            </span>
            {isActive && !isHighlighted && (
                <div className="w-1 h-1 bg-primary rounded-full mt-0.5 animate-scaleIn"></div>
            )}
        </button>
    );
};

const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, navigate }) => {
    return (
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-white/90 backdrop-blur-lg border-t border-gray-100 flex justify-around items-center shadow-lg">
            <NavItem
                label="Home"
                icon={<HomeIcon />}
                isActive={currentScreen === SCREENS.HOME}
                onClick={() => navigate(SCREENS.HOME)}
            />
            <NavItem
                label="Discover"
                icon={<SearchIcon />}
                isActive={currentScreen === SCREENS.DISCOVER}
                onClick={() => navigate(SCREENS.DISCOVER)}
            />
            <NavItem
                label="AI"
                icon={<SparklesIcon />}
                isActive={currentScreen === SCREENS.AI_ASSISTANT}
                onClick={() => navigate(SCREENS.AI_ASSISTANT)}
                isHighlighted={true}
            />
            <NavItem
                label="Portfolio"
                icon={<PortfolioIcon />}
                isActive={currentScreen === SCREENS.PORTFOLIO}
                onClick={() => navigate(SCREENS.PORTFOLIO)}
            />
            <NavItem
                label="Profile"
                icon={<UserIcon />}
                isActive={currentScreen === SCREENS.PROFILE}
                onClick={() => navigate(SCREENS.PROFILE)}
            />
        </div>
    );
};

export default BottomNav;
