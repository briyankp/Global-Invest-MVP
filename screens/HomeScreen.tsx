import React, { useState } from 'react';
import TrustSafetyModal from '../components/TrustSafetyModal';
import type { NavigationProps, Stock, AiPortfolio } from '../types';
import { SCREENS } from '../constants';
import { mockHoldings, mockWatchlist, mockAiPortfolios, mockAiInsights } from '../services/mockData';
import ArrowUpIcon from '../components/icons/ArrowUpIcon';
import ArrowDownIcon from '../components/icons/ArrowDownIcon';
import SparklesIcon from '../components/icons/SparklesIcon';
import ChevronRightIcon from '../components/icons/ChevronRightIcon';
import EyeIcon from '../components/icons/EyeIcon';
import EyeOffIcon from '../components/icons/EyeOffIcon';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

import ScreenHeader from '../components/ScreenHeader';

const USD_TO_INR = 83.56;

const HomeScreen: React.FC<NavigationProps> = ({ navigate }) => {
    const [showINR, setShowINR] = useState(false);
    const [showTrustModal, setShowTrustModal] = useState(false);
    const [selectedPortfolio, setSelectedPortfolio] = useState<AiPortfolio | null>(null);
    const [showInvestModal, setShowInvestModal] = useState(false);
    const [investAmount, setInvestAmount] = useState('1000');
    const [isBalanceHidden, setIsBalanceHidden] = useState(false);
    const totalValue = mockHoldings.reduce((acc, h) => acc + h.totalValue, 0);
    const totalValueINR = totalValue * USD_TO_INR;
    const totalGain = 1250.75;
    const totalGainINR = totalGain * USD_TO_INR;
    const totalGainPercent = (totalGain / (totalValue - totalGain)) * 100;
    const firstInsight = mockAiInsights[0];

    const handleInvestClick = (portfolio: AiPortfolio) => {
        setSelectedPortfolio(portfolio);
        setShowInvestModal(true);
    };

    // A small, reusable chart for the watchlist
    const MiniChart: React.FC<{ data: { value: number }[], isPositive: boolean }> = ({ data, isPositive }) => {
        const color = isPositive ? '#10B981' : '#EF4444';
        return (
            <div className="w-24 h-10">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
                        <defs>
                            <linearGradient id={`mini-chart-gradient-${isPositive}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={color} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke={color}
                            strokeWidth={2}
                            fill={`url(#mini-chart-gradient-${isPositive})`}
                            fillOpacity={1}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        );
    };

    const StockListItem: React.FC<{ stock: Stock }> = ({ stock }) => {
        // Generate mock data for the mini chart
        const chartData = Array.from({ length: 20 }, () => ({
            value: stock.price * (1 + (Math.random() - 0.5) * 0.1)
        }));

        const isPositive = stock.changePercent >= 0;

        return (
            <button
                onClick={() => navigate(SCREENS.STOCK_DETAIL, stock)}
                className="flex items-center w-full p-2.5 bg-white rounded-xl mb-2 transition-all hover:shadow-lg hover:scale-[1.02] border border-gray-100 shadow-sm"
            >
                <img src={stock.logo} alt={stock.name} className="w-8 h-8 rounded-full mr-3" />
                <div className="flex-1 text-left">
                    <p className="font-bold text-gray-900 text-sm">{stock.ticker}</p>
                    <p className="text-[10px] text-gray-500 truncate">{stock.name}</p>
                </div>
                <div className="mx-2">
                    <MiniChart data={chartData} isPositive={isPositive} />
                </div>
                <div className="text-right w-20">
                    <p className="font-semibold text-gray-900 text-sm">${stock.price.toFixed(2)}</p>
                    <p className={`text-[10px] font-medium ${isPositive ? 'text-positive' : 'text-negative'}`}>
                        {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
                    </p>
                </div>
            </button>
        );
    };

    // Create some gradients for the portfolio cards
    const portfolioGradients = [
        'from-blue-100 to-indigo-100',
        'from-green-100 to-teal-100',
        'from-purple-100 to-pink-100',
        'from-yellow-100 to-orange-100',
    ];

    const AiPortfolioCard: React.FC<{ portfolio: AiPortfolio, gradient: string }> = ({ portfolio, gradient }) => {
        // Mock holdings for preview based on portfolio name
        const mockPortfolioHoldings = {
            'Global Robotics & AI': ['NVDA', 'GOOGL', 'MSFT'],
            'Sustainable Energy Leaders': ['TSLA', 'ENPH', 'NEE'],
            'Emerging Market Innovators': ['BABA', 'TSM', 'SE'],
            'Global Dividend Payers': ['JNJ', 'PG', 'KO'],
        };
        const holdings = mockPortfolioHoldings[portfolio.name as keyof typeof mockPortfolioHoldings] || ['AAPL', 'MSFT', 'GOOGL'];

        // Generate sparkline data
        const sparklineData = Array.from({ length: 15 }, (_, i) => ({
            value: 100 + Math.sin(i / 2) * 10 + Math.random() * 5 + (portfolio.cagr / 10) * i
        }));

        return (
            <div className={`w-64 h-[240px] flex-shrink-0 relative bg-gradient-to-br ${gradient} p-3 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08),0_8px_24px_rgba(0,0,0,0.06)] overflow-hidden group flex flex-col`}>
                {/* AI Watching Indicator */}
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 bg-white/90 rounded-full backdrop-blur-sm">
                    <span className="w-1.5 h-1.5 bg-positive rounded-full animate-pulse"></span>
                    <span className="text-[7px] font-semibold text-gray-600 tracking-tight">AI Active</span>
                </div>

                <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/15 rounded-full opacity-50 group-hover:scale-125 transition-transform duration-300"></div>

                {/* Title & Description */}
                <h3 className="font-bold text-sm text-gray-800 relative z-10 pr-12 leading-tight">{portfolio.name}</h3>
                <p className="text-[10px] text-gray-500 mt-1 relative z-10 line-clamp-2 leading-relaxed min-h-[24px]">{portfolio.description}</p>

                {/* Sparkline Chart */}
                <div className="h-8 mt-2 relative z-10">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={sparklineData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                            <defs>
                                <linearGradient id={`portfolio-gradient-${portfolio.id}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#7C3AED"
                                strokeWidth={1.5}
                                fill={`url(#portfolio-gradient-${portfolio.id})`}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Holdings Preview */}
                <div className="flex items-center gap-1 mt-2 relative z-10">
                    <div className="flex -space-x-1.5">
                        {holdings.map((ticker, i) => (
                            <div key={ticker} className="w-4 h-4 rounded-full bg-white border border-white shadow-sm flex items-center justify-center text-[6px] font-bold text-gray-600">
                                {ticker.slice(0, 2)}
                            </div>
                        ))}
                    </div>
                    <span className="text-[9px] text-gray-500 ml-1.5 font-medium">{holdings.join(', ')}</span>
                </div>

                {/* Spacer to push content down */}
                <div className="flex-1"></div>

                {/* Stats Row */}
                <div className="flex justify-between items-end relative z-10 mb-2">
                    <div>
                        <p className="text-[9px] text-gray-500 font-semibold uppercase tracking-wide">Avg. Return</p>
                        <p className="font-bold text-base text-positive leading-tight">{portfolio.cagr.toFixed(1)}%</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[9px] text-gray-500 font-semibold uppercase tracking-wide">Risk</p>
                        <p className={`font-bold text-xs ${portfolio.risk === 'Low' ? 'text-positive' : portfolio.risk === 'Medium' ? 'text-yellow-600' : 'text-orange-500'}`}>
                            {portfolio.risk}
                        </p>
                    </div>
                </div>

                {/* Invest Now Button */}
                <button
                    onClick={() => handleInvestClick(portfolio)}
                    className="w-full py-1.5 bg-primary text-white font-semibold text-[10px] rounded-lg shadow-sm hover:bg-primary-dark hover:shadow-md transition-all relative z-10 flex items-center justify-center gap-1"
                >
                    <SparklesIcon />
                    Invest Now
                </button>
            </div>
        );
    };

    return (
        <div className="bg-gray-100 min-h-full">
            <ScreenHeader
                title="Portfolio Value"
                rightElement={
                    <div className="w-10 h-10 bg-white/20 rounded-full border border-white/10">
                        <img src="https://picsum.photos/100" alt="User" className="w-10 h-10 rounded-full p-0.5" />
                    </div>
                }
            >
                <div className="flex flex-col w-full">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-2 mb-0.5">
                                <p className="text-[10px] text-white/60 font-medium">Total Balance</p>
                                <button
                                    onClick={() => setIsBalanceHidden(!isBalanceHidden)}
                                    className="text-white/40 hover:text-white/80 transition-colors"
                                >
                                    {isBalanceHidden ? <EyeOffIcon className="w-3 h-3" /> : <EyeIcon className="w-3 h-3" />}
                                </button>
                            </div>
                            {isBalanceHidden ? (
                                <p className="text-4xl font-bold leading-none tracking-tight">****</p>
                            ) : showINR ? (
                                <p className="text-4xl font-bold leading-none tracking-tight">₹{totalValueINR.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                            ) : (
                                <p className="text-4xl font-bold leading-none tracking-tight">${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                            )}
                        </div>
                        <button
                            onClick={() => setShowINR(!showINR)}
                            className="bg-white/10 backdrop-blur-md rounded-full p-0.5 border border-white/20 transition-all hover:bg-white/20 flex"
                        >
                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold transition-all ${!showINR ? 'bg-white text-primary shadow-sm' : 'text-white/70'}`}>USD</span>
                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold transition-all ${showINR ? 'bg-white text-primary shadow-sm' : 'text-white/70'}`}>INR</span>
                        </button>
                    </div>

                    <div className="flex justify-between items-end mt-3">
                        <span className="inline-flex items-center font-bold bg-white/10 backdrop-blur-sm border border-white/20 px-2.5 py-1 rounded-full text-[11px]">
                            {totalGain >= 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
                            <span className="ml-1">
                                {isBalanceHidden
                                    ? '****'
                                    : `${showINR ? `₹${totalGainINR.toFixed(0)}` : `$${totalGain.toFixed(2)}`} (${totalGainPercent.toFixed(2)}%)`
                                }
                            </span>
                        </span>

                        <div className="flex flex-col items-end gap-1">
                            <button
                                onClick={() => setShowTrustModal(true)}
                                className="text-[10px] text-white/60 font-medium hover:text-white/90 transition-colors border-b border-white/20 hover:border-white/50 pb-px mb-0.5"
                            >
                                Know more
                            </button>
                            <button
                                onClick={() => setShowTrustModal(true)}
                                className="inline-flex items-center text-[10px] font-bold text-white bg-green-500/20 border border-green-400/30 px-3 py-1.5 rounded-full hover:bg-green-500/30 transition-all shadow-sm"
                            >
                                <svg className="w-3 h-3 mr-1.5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                LRS Compliant
                            </button>
                        </div>
                    </div>
                </div>
            </ScreenHeader>

            {/* Trust Modal */}
            {showTrustModal && <TrustSafetyModal onClose={() => setShowTrustModal(false)} />}

            <div className="p-3 space-y-4 pb-20">
                <section>
                    <div className="flex justify-between items-center mb-1.5">
                        <h2 className="text-sm font-bold text-gray-800">AI Insights</h2>
                        <button onClick={() => navigate(SCREENS.AI_INSIGHTS)} className="text-[10px] font-semibold text-primary flex items-center">
                            See All <ChevronRightIcon />
                        </button>
                    </div>
                    <div className="p-3 bg-gradient-to-tr from-secondary to-white rounded-xl border border-primary/10 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 text-primary/10">
                            <SparklesIcon />
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-5 h-5 text-primary flex-shrink-0 mt-0.5">
                                <SparklesIcon />
                            </div>
                            <div>
                                <p className="font-semibold text-primary-dark text-xs leading-snug">{firstInsight.content}</p>
                                <button onClick={() => navigate(SCREENS.RECOMMENDED_STOCKS, firstInsight)} className="text-[10px] font-bold text-primary mt-1.5 flex items-center gap-1">Explore Now <ChevronRightIcon /></button>
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-sm font-bold text-gray-800 mb-1.5">AI-Managed Portfolios</h2>
                    <div className="flex overflow-x-auto space-x-2 -mx-3 px-3 pb-1">
                        {mockAiPortfolios.map((p, i) => <AiPortfolioCard key={p.id} portfolio={p} gradient={portfolioGradients[i % portfolioGradients.length]} />)}
                    </div>
                </section>

                <section>
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-lg font-bold text-gray-800">Watchlist</h2>
                        <button onClick={() => navigate(SCREENS.DISCOVER)} className="text-xs font-semibold text-primary flex items-center">
                            Discover More <ChevronRightIcon />
                        </button>
                    </div>
                    <div>
                        {mockWatchlist.map(stock => <StockListItem key={stock.ticker} stock={stock} />)}
                    </div>
                </section>
            </div>

            {/* Investment Modal */}
            {showInvestModal && selectedPortfolio && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md rounded-t-3xl p-6 animate-slideUp">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Invest in "{selectedPortfolio.name}"</h3>
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

                        {/* Portfolio Info */}
                        <div className="bg-gray-50 rounded-xl p-4 mb-6">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-sm font-medium text-gray-600">Expected Return</span>
                                <span className="font-bold text-positive">{selectedPortfolio.cagr.toFixed(1)}% avg/year</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-600">Risk Level</span>
                                <span className={`font-semibold ${selectedPortfolio.risk === 'Low' ? 'text-positive' : selectedPortfolio.risk === 'Medium' ? 'text-yellow-600' : 'text-orange-500'}`}>
                                    {selectedPortfolio.risk}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                setShowInvestModal(false);
                                // Could navigate to success screen or show confirmation
                            }}
                            className="w-full py-4 bg-positive text-white font-bold rounded-xl text-lg"
                        >
                            Confirm Investment
                        </button>
                        <p className="text-xs text-gray-400 text-center mt-3">AI will manage your investment automatically</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomeScreen;