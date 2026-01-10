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
    { id: 'events', label: 'Global Events', icon: '🌍' },
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
            <div className="bg-white p-5 rounded-2xl mb-4 border border-gray-100 shadow-sm hover:shadow-md transition-all">
                {/* Personalization Badge */}
                <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-secondary text-primary text-xs font-medium rounded-full">
                        <SparklesIcon />
                        {personalizationTag}
                    </span>
                    {timeSensitive && (
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${timeSensitive.urgent
                                ? 'bg-red-50 text-red-600 animate-pulse'
                                : 'bg-yellow-50 text-yellow-600'
                            }`}>
                            ⏰ {timeSensitive.label}
                        </span>
                    )}
                </div>

                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center text-white flex-shrink-0">
                        <SparklesIcon />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-gray-800 text-lg">{insight.title}</h3>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{insight.content}</p>

                        {/* Confidence Bar */}
                        <div className="mt-4">
                            <div className="flex justify-between items-center mb-1.5">
                                <span className="text-xs text-gray-500">AI Confidence</span>
                                <span className="text-xs font-bold text-gray-700">{confidence}%</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-700 ${confidence >= 80 ? 'bg-positive' :
                                            confidence >= 60 ? 'bg-yellow-500' : 'bg-orange-500'
                                        }`}
                                    style={{ width: `${confidence}%` }}
                                />
                            </div>
                        </div>

                        {/* Related Stocks Preview */}
                        <div className="flex items-center gap-2 mt-3">
                            <div className="flex -space-x-2">
                                {insight.relatedStocks.slice(0, 3).map((stock) => (
                                    <img
                                        key={stock.ticker}
                                        src={stock.logo}
                                        alt={stock.ticker}
                                        className="w-7 h-7 rounded-full border-2 border-white shadow-sm"
                                    />
                                ))}
                            </div>
                            <span className="text-xs text-gray-500">
                                {insight.relatedStocks.map(s => s.ticker).join(', ')}
                            </span>
                        </div>

                        {/* CTA Button */}
                        <button
                            onClick={() => navigate(SCREENS.RECOMMENDED_STOCKS, insight)}
                            className="mt-4 w-full py-2.5 bg-gradient-to-r from-primary to-primary-dark text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                        >
                            Explore This Idea
                            <ChevronRightIcon />
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-full bg-gradient-to-b from-gray-50 to-white">
            {/* Header */}
            <header className="p-4 flex items-center bg-white/90 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10">
                <button onClick={() => navigate(SCREENS.HOME)} className="mr-2 p-1">
                    <ChevronLeftIcon />
                </button>
                <div className="flex-1">
                    <h1 className="text-lg font-bold text-gray-900">AI Insights</h1>
                    <p className="text-xs text-gray-500">Personalized for your portfolio</p>
                </div>
                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-primary">
                    <SparklesIcon />
                </div>
            </header>

            {/* Category Tabs */}
            <div className="px-4 pt-4 pb-2 sticky top-[73px] bg-gradient-to-b from-gray-50 to-gray-50/80 z-[5]">
                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat.id
                                    ? 'bg-primary text-white shadow-md'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:border-primary/50'
                                }`}
                        >
                            <span className="mr-1">{cat.icon}</span>
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Insights List */}
            <div className="p-4">
                {/* Active Insights Count */}
                <p className="text-sm text-gray-500 mb-4">
                    {mockAiInsights.length} insights for you today
                </p>

                {mockAiInsights.map((insight, index) => (
                    <InsightCard key={insight.id} insight={insight} index={index} />
                ))}
            </div>
        </div>
    );
};

export default AiInsightsScreen;