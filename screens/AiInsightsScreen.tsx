import React, { useState } from 'react';
import type { NavigationProps, AiInsight } from '../types';
import { SCREENS } from '../constants';
import { mockAiInsights } from '../services/mockData';
import ChevronLeftIcon from '../components/icons/ChevronLeftIcon';
import SparklesIcon from '../components/icons/SparklesIcon';
import ChevronRightIcon from '../components/icons/ChevronRightIcon';

// Category tabs config
const CATEGORIES = [
    { id: 'for_you', label: 'For You', icon: '✨' },
    { id: 'trending', label: 'Trending', icon: '🔥' },
];

// Personalization tags based on user interests
const PERSONALIZATION_TAGS = [
    'Based on your interest in EV tech',
    'Matches your risk profile',
    'Similar to stocks you own',
    'Aligned with your investment goals',
];

const AiInsightsScreen: React.FC<NavigationProps> = ({ navigate }) => {
    const [activeCategory, setActiveCategory] = useState('for_you');

    // Calculate confidence for each insight (mock)
    const getConfidence = (index: number) => 85 - (index * 8) + Math.floor(Math.random() * 10);

    // Get time-sensitive label
    const getTimeSensitive = (index: number) => {
        if (index === 0) return { label: 'Act within 24 hours', urgent: true };
        if (index === 1) return { label: 'This week', urgent: false };
        return null;
    };

    const InsightCard: React.FC<{ insight: AiInsight; index: number }> = ({ insight, index }) => {
        const confidence = getConfidence(index);
        const timeSensitive = getTimeSensitive(index);
        const personalizationTag = PERSONALIZATION_TAGS[index % PERSONALIZATION_TAGS.length];

        return (
            <button
                onClick={() => navigate(SCREENS.RECOMMENDED_STOCKS, insight)}
                className="w-full bg-white p-3 rounded-xl mb-3 border border-gray-100 shadow-sm hover:shadow-md transition-all text-left group"
            >
                {/* Personalization Badge */}
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-secondary text-primary text-[10px] font-medium rounded-full">
                            <SparklesIcon />
                            {personalizationTag}
                        </span>
                        {timeSensitive && (
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full ${timeSensitive.urgent
                                ? 'bg-red-50 text-red-600 animate-pulse'
                                : 'bg-yellow-50 text-yellow-600'
                                }`}>
                                ⏰ {timeSensitive.label}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center text-white flex-shrink-0 mt-1">
                        <SparklesIcon />
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <h3 className="font-bold text-gray-800 text-sm leading-tight pr-4">{insight.title}</h3>
                            <ChevronRightIcon />
                        </div>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2 leading-relaxed">{insight.content}</p>

                        {/* Confidence Bar */}
                        <div className="mt-2.5 flex items-center gap-3">
                            <div className="flex-1">
                                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-700 ${confidence >= 80 ? 'bg-positive' :
                                            confidence >= 60 ? 'bg-yellow-500' : 'bg-orange-500'
                                            }`}
                                        style={{ width: `${confidence}%` }}
                                    />
                                </div>
                            </div>
                            <span className="text-[10px] font-bold text-gray-700 whitespace-nowrap">{confidence}% Confidence</span>
                        </div>

                        {/* Related Stocks Preview */}
                        <div className="flex items-center gap-1.5 mt-2.5">
                            <div className="flex -space-x-1.5">
                                {insight.relatedStocks.slice(0, 3).map((stock) => (
                                    <img
                                        key={stock.ticker}
                                        src={stock.logo}
                                        alt={stock.ticker}
                                        className="w-5 h-5 rounded-full border border-white shadow-sm"
                                    />
                                ))}
                            </div>
                            <span className="text-[10px] text-gray-500 ml-1 font-medium">
                                {insight.relatedStocks.map(s => s.ticker).join(', ')}
                            </span>
                        </div>
                    </div>
                </div>
            </button>
        );
    };

    return (
        <div className="min-h-full bg-gray-50 pb-20">
            {/* Header */}
            <header className="p-4 flex flex-col justify-end min-h-[140px] bg-gradient-to-br from-primary to-primary-dark text-white shadow-lg sticky top-0 z-20">
                <button
                    onClick={() => navigate(SCREENS.HOME)}
                    className="absolute top-4 left-4 p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all z-30"
                >
                    <ChevronLeftIcon />
                </button>
                <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none">
                    <SparklesIcon />
                </div>

                <div className="relative z-10 mt-auto">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="inline-flex items-center justify-center p-1 bg-white/20 rounded-lg backdrop-blur-sm">
                            <SparklesIcon />
                        </span>
                        <h1 className="text-2xl font-bold leading-none">AI Insights</h1>
                    </div>
                    <p className="text-xs text-white/70 line-clamp-1 max-w-[90%]">Personalized investment opportunities matching your profile</p>
                </div>
            </header>

            {/* Category Tabs */}
            <div className="bg-white border-b border-gray-100 py-2 px-3 sticky top-[140px] z-10 shadow-sm">
                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${activeCategory === cat.id
                                ? 'bg-primary text-white shadow-sm'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            <span className="mr-1">{cat.icon}</span>
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Insights List */}
            <div className="p-3">
                <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-3 ml-1">
                    {mockAiInsights.length} Opportunities Identified
                </p>

                {mockAiInsights.map((insight, index) => (
                    <InsightCard key={insight.id} insight={insight} index={index} />
                ))}
            </div>
        </div>
    );
};

export default AiInsightsScreen;