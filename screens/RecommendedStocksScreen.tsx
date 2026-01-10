import React, { useState, useEffect } from 'react';
import type { NavigationProps, Stock, AiInsight } from '../types';
import { SCREENS } from '../constants';
import ChevronLeftIcon from '../components/icons/ChevronLeftIcon';
import LightbulbIcon from '../components/icons/LightbulbIcon';
import ClockIcon from '../components/icons/ClockIcon';
import CalendarIcon from '../components/icons/CalendarIcon';
import SparklesIcon from '../components/icons/SparklesIcon';

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
    const [investAmount, setInvestAmount] = useState('1000');

    // Typewriter for rationale
    const { displayedText: rationaleText, isComplete: rationaleComplete } = useTypewriter(rationale, 15);

    // Calculate confidence score based on analyst ratings
    const confidenceScore = stocks && stocks.length > 0
        ? Math.min(95, Math.round(stocks.reduce((acc, s) => acc + (s.analystRating === 'Buy' ? 85 : s.analystRating === 'Hold' ? 60 : 40), 0) / stocks.length + Math.random() * 10))
        : 75;

    const USD_TO_INR = 83.56;

    const InfoCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode; isTyping?: boolean }> = ({ icon, title, children, isTyping }) => (
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-start gap-3">
                <div className="w-8 h-8 text-primary flex-shrink-0 mt-1">
                    {icon}
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-gray-800">{title}</h3>
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                        {children}
                        {isTyping && <span className="inline-block w-0.5 h-4 bg-primary ml-0.5 animate-pulse" />}
                    </p>
                </div>
            </div>
        </div>
    );

    const StockListItem: React.FC<{ stock: Stock; allocation: number }> = ({ stock, allocation }) => (
        <button onClick={() => navigate(SCREENS.STOCK_DETAIL, stock)} className="flex items-center justify-between w-full p-4 bg-white rounded-xl mb-3 transition-all hover:shadow-md border border-gray-100 group">
            <div className="flex items-center flex-1">
                <div className="relative">
                    <img src={stock.logo} alt={stock.name} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" />
                    <div className="absolute -bottom-1 -right-1 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        {allocation}%
                    </div>
                </div>
                <div className="ml-4">
                    <p className="font-bold text-gray-800">{stock.ticker}</p>
                    <p className="text-sm text-gray-500 truncate max-w-[150px]">{stock.name}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="font-semibold text-gray-900">${stock.price.toFixed(2)}</p>
                <p className={`text-sm font-medium ${stock.changePercent >= 0 ? 'text-positive' : 'text-negative'}`}>
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
        <div className="min-h-full bg-gradient-to-b from-gray-50 to-white">
            {/* Header */}
            <header className="p-4 flex items-center bg-white/90 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10">
                <button onClick={() => navigate(SCREENS.AI_INSIGHTS)} className="mr-2 p-1">
                    <ChevronLeftIcon />
                </button>
                <div className="flex-1">
                    <h1 className="text-lg font-bold text-gray-900 truncate">{title}</h1>
                    <div className="flex items-center gap-1 text-sm text-primary">
                        <SparklesIcon />
                        <span>AI Investment Thesis</span>
                    </div>
                </div>
            </header>

            <div className="p-4 space-y-5 pb-32">
                {/* Confidence Score */}
                <ConfidenceScore score={confidenceScore} />

                {/* AI Explanation Cards with Typewriter */}
                <div className="space-y-4">
                    <InfoCard icon={<LightbulbIcon />} title="The Big Idea (Why)" isTyping={!rationaleComplete}>
                        {rationaleText}
                    </InfoCard>
                    <InfoCard icon={<ClockIcon />} title="The Timing (Why Now)">
                        {timing}
                    </InfoCard>
                    <InfoCard icon={<CalendarIcon />} title="Investment Horizon">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                            {horizon}
                        </span>
                    </InfoCard>
                </div>

                {/* Recommended Stocks */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-gray-800">Suggested Allocation</h2>
                        <span className="text-xs text-gray-500">Tap to view details</span>
                    </div>
                    {stocks && stocks.length > 0 ? (
                        stocks.map((stock, i) => <StockListItem key={stock.ticker} stock={stock} allocation={allocations[i]} />)
                    ) : (
                        <p className="text-center text-gray-500 py-8">No recommended stocks for this insight.</p>
                    )}
                </section>
            </div>

            {/* Invest in This Idea CTA - Fixed at bottom */}
            <div className="fixed bottom-16 left-0 right-0 w-full max-w-md mx-auto p-4 bg-gradient-to-t from-white via-white to-transparent">
                <button
                    onClick={() => setShowInvestModal(true)}
                    className="w-full py-4 bg-gradient-to-r from-primary to-primary-dark text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                    <SparklesIcon />
                    <span>Invest in This Idea</span>
                </button>
            </div>

            {/* Investment Modal */}
            {showInvestModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md rounded-t-3xl p-6 animate-slideUp">
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
                                setShowInvestModal(false);
                                navigate(SCREENS.HOME);
                            }}
                            className="w-full py-4 bg-positive text-white font-bold rounded-xl text-lg"
                        >
                            Confirm Investment
                        </button>
                        <p className="text-xs text-gray-400 text-center mt-3">Orders execute at market open</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecommendedStocksScreen;