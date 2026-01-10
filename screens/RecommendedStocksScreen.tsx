import React, { useState, useEffect } from 'react';
import type { NavigationProps, Stock, AiInsight } from '../types';
import { SCREENS } from '../constants';
import ChevronLeftIcon from '../components/icons/ChevronLeftIcon';
import LightbulbIcon from '../components/icons/LightbulbIcon';
import ClockIcon from '../components/icons/ClockIcon';
import CalendarIcon from '../components/icons/CalendarIcon';
import SparklesIcon from '../components/icons/SparklesIcon';
import ScreenHeader from '../components/ScreenHeader';

interface RecommendedStocksScreenProps extends NavigationProps {
    payload: AiInsight;
}

// Typewriter hook for AI explanations
const useTypewriter = (text: string, speed: number = 20) => {
    const [displayedText, setDisplayedText] = useState('');
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        setDisplayedText('');
        setIsComplete(false);
        let index = 0;
        const timer = setInterval(() => {
            if (index < text.length) {
                setDisplayedText(text.slice(0, index + 1));
                index++;
            } else {
                setIsComplete(true);
                clearInterval(timer);
            }
        }, speed);
        return () => clearInterval(timer);
    }, [text, speed]);

    return { displayedText, isComplete };
};

// Confidence Score Component
const ConfidenceScore: React.FC<{ score: number }> = ({ score }) => {
    const getColor = () => {
        if (score >= 80) return 'bg-positive';
        if (score >= 60) return 'bg-yellow-500';
        return 'bg-orange-500';
    };

    const getLabel = () => {
        if (score >= 80) return 'High Confidence';
        if (score >= 60) return 'Moderate Confidence';
        return 'Speculative';
    };

    return (
        <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100">
            <div className="flex-1">
                <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-medium text-gray-600">AI Confidence</span>
                    <span className="text-sm font-bold text-gray-900">{score}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className={`h-full ${getColor()} rounded-full transition-all duration-1000`}
                        style={{ width: `${score}%` }}
                    />
                </div>
                <p className="text-xs text-gray-500 mt-1">{getLabel()}</p>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getColor()}/10`}>
                <span className="text-lg font-bold text-gray-700">{score >= 80 ? '🎯' : score >= 60 ? '📊' : '🔍'}</span>
            </div>
        </div>
    );
};

const RecommendedStocksScreen: React.FC<RecommendedStocksScreenProps> = ({ navigate, payload }) => {
    const { title, relatedStocks: stocks, rationale, timing, horizon } = payload;
    const [showInvestModal, setShowInvestModal] = useState(false);
    const [isInvestSuccess, setIsInvestSuccess] = useState(false);
    const [investAmount, setInvestAmount] = useState('1000');

    // Typewriter for rationale
    const { displayedText: rationaleText, isComplete: rationaleComplete } = useTypewriter(rationale, 15);

    // Calculate confidence score based on analyst ratings
    const confidenceScore = stocks && stocks.length > 0
        ? Math.min(95, Math.round(stocks.reduce((acc, s) => acc + (s.analystRating === 'Buy' ? 85 : s.analystRating === 'Hold' ? 60 : 40), 0) / stocks.length + Math.random() * 10))
        : 75;

    const USD_TO_INR = 83.56;

    const InfoCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode; isTyping?: boolean }> = ({ icon, title, children, isTyping }) => (
        <div className="bg-white p-2.5 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 text-primary flex-shrink-0 mt-0.5">
                    {icon}
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-gray-800 text-xs">{title}</h3>
                    <p className="text-[11px] text-gray-600 mt-0.5 leading-relaxed">
                        {children}
                        {isTyping && <span className="inline-block w-0.5 h-3 bg-primary ml-0.5 animate-pulse" />}
                    </p>
                </div>
            </div>
        </div>
    );

    const StockListItem: React.FC<{ stock: Stock; allocation: number }> = ({ stock, allocation }) => (
        <button onClick={() => navigate(SCREENS.STOCK_DETAIL, stock)} className="flex items-center justify-between w-full p-2.5 bg-white rounded-xl mb-2 transition-all hover:shadow-md border border-gray-100 group">
            <div className="flex items-center flex-1">
                <div className="relative">
                    <img src={stock.logo} alt={stock.name} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
                    <div className="absolute -bottom-1 -right-1 bg-primary text-white text-[9px] font-bold px-1.5 py-0 rounded-full">
                        {allocation}%
                    </div>
                </div>
                <div className="ml-3 text-left">
                    <p className="font-bold text-gray-800 text-sm">{stock.ticker}</p>
                    <p className="text-[10px] text-gray-500 truncate max-w-[150px]">{stock.name}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="font-semibold text-gray-900 text-sm">${stock.price.toFixed(2)}</p>
                <p className={`text-[10px] font-medium ${stock.changePercent >= 0 ? 'text-positive' : 'text-negative'}`}>
                    {stock.changePercent >= 0 ? '↑' : '↓'} {Math.abs(stock.changePercent).toFixed(2)}%
                </p>
            </div>
        </button>
    );

    // Calculate allocation percentages
    const allocations = stocks?.map((_, i) => {
        if (stocks.length === 1) return 100;
        if (stocks.length === 2) return i === 0 ? 60 : 40;
        return i === 0 ? 50 : Math.round(50 / (stocks.length - 1));
    }) || [];

    return (
        <div className="min-h-full bg-gray-50 pb-20">
            {/* Header */}
            <ScreenHeader
                title={title}
                subtitle="AI Investment Thesis"
                showBack={true}
                onBack={() => navigate(SCREENS.AI_INSIGHTS)}
                rightElement={
                    <button
                        onClick={() => setShowInvestModal(true)}
                        className="bg-white/20 hover:bg-white/30 text-white font-bold text-xs px-4 py-1.5 rounded-full backdrop-blur-md transition-all border border-white/20 shadow-sm flex items-center gap-1.5"
                    >
                        <SparklesIcon />
                        Invest
                    </button>
                }
            />

            <div className="p-3 space-y-3 pb-20 -mt-4 relative z-20">
                {/* Confidence Score */}
                <ConfidenceScore score={confidenceScore} />

                {/* AI Explanation Cards with Typewriter */}
                <div className="space-y-2">
                    <InfoCard icon={<LightbulbIcon />} title="The Big Idea (Why)" isTyping={!rationaleComplete}>
                        {rationaleText}
                    </InfoCard>
                    <InfoCard icon={<ClockIcon />} title="The Timing (Why Now)">
                        {timing}
                    </InfoCard>
                    <InfoCard icon={<CalendarIcon />} title="Investment Horizon">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold text-[10px]">
                            {horizon}
                        </span>
                    </InfoCard>
                </div>

                {/* Recommended Stocks */}
                <section>
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-sm font-bold text-gray-800">Suggested Allocation</h2>
                        <span className="text-[10px] text-gray-500">Tap for details</span>
                    </div>
                    {stocks && stocks.length > 0 ? (
                        stocks.map((stock, i) => <StockListItem key={stock.ticker} stock={stock} allocation={allocations[i]} />)
                    ) : (
                        <p className="text-center text-gray-500 py-8 text-xs">No recommended stocks for this insight.</p>
                    )}
                </section>

                {/* Explore Other Themes Button */}
                <button
                    onClick={() => navigate(SCREENS.AI_INSIGHTS)}
                    className="w-full py-3 mt-4 bg-white border border-primary/20 text-primary font-bold rounded-xl text-sm hover:bg-primary/5 transition-all text-center shadowing-sm"
                >
                    Explore More Themes
                </button>
            </div>

            {/* Investment Modal */}
            {showInvestModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md rounded-t-3xl p-6 animate-slideUp">
                        {isInvestSuccess ? (
                            <div className="flex flex-col items-center justify-center py-10 animate-fadeIn">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 animate-bounce-subtle">
                                    <svg className="w-8 h-8 text-positive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Investment Confirmed!</h3>
                                <p className="text-sm text-gray-500">Redirecting you to home...</p>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-gray-900">Invest in "{title}"</h3>
                                    <button onClick={() => setShowInvestModal(false)} className="text-gray-400 text-2xl">×</button>
                                </div>

                                <div className="mb-6">
                                    <label className="text-sm text-gray-600 mb-2 block">Investment Amount</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                                        <input
                                            type="number"
                                            value={investAmount}
                                            onChange={(e) => setInvestAmount(e.target.value)}
                                            className="w-full pl-10 pr-4 py-4 text-2xl font-bold border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
                                        />
                                    </div>
                                    <p className="text-sm text-gray-500 mt-2">
                                        ≈ ₹{(parseFloat(investAmount || '0') * USD_TO_INR).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                    </p>
                                </div>

                                {/* Allocation Preview */}
                                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                                    <p className="text-xs text-gray-500 mb-3">Your investment will be split:</p>
                                    {stocks?.map((stock, i) => (
                                        <div key={stock.ticker} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                                            <div className="flex items-center gap-2">
                                                <img src={stock.logo} alt={stock.name} className="w-6 h-6 rounded-full" />
                                                <span className="font-medium text-gray-800">{stock.ticker}</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="font-bold text-gray-900">
                                                    ${((parseFloat(investAmount || '0') * allocations[i]) / 100).toFixed(2)}
                                                </span>
                                                <span className="text-xs text-gray-500 ml-1">({allocations[i]}%)</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={() => {
                                        setIsInvestSuccess(true);
                                        setTimeout(() => {
                                            setIsInvestSuccess(false);
                                            setShowInvestModal(false);
                                            navigate(SCREENS.HOME);
                                        }, 2000);
                                    }}
                                    className="w-full py-4 bg-positive text-white font-bold rounded-xl text-lg hover:bg-green-600 transition-colors shadow-lg shadow-green-500/20"
                                >
                                    Confirm Investment
                                </button>
                                <p className="text-xs text-gray-400 text-center mt-3">Orders execute at market open</p>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecommendedStocksScreen;