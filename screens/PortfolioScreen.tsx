
import React, { useState, useMemo } from 'react';
import TrustSafetyModal from '../components/TrustSafetyModal';
import type { NavigationProps, PortfolioHolding, Order } from '../types';
import { SCREENS } from '../constants';
import { mockHoldings, mockOrders } from '../services/mockData';
import ArrowUpIcon from '../components/icons/ArrowUpIcon';
import ArrowDownIcon from '../components/icons/ArrowDownIcon';
import ChevronRightIcon from '../components/icons/ChevronRightIcon';
import EyeIcon from '../components/icons/EyeIcon';
import EyeOffIcon from '../components/icons/EyeOffIcon';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import ScreenHeader from '../components/ScreenHeader';

const USD_TO_INR = 83.56;

const PortfolioScreen: React.FC<NavigationProps> = ({ navigate }) => {
    const [showINR, setShowINR] = useState(false);
    const [showTrustModal, setShowTrustModal] = useState(false);
    const [activeTab, setActiveTab] = useState<'holdings' | 'orders'>('holdings');
    const [chartTimeframe, setChartTimeframe] = useState('1M');
    const [isBalanceHidden, setIsBalanceHidden] = useState(false);
    const totalValue = mockHoldings.reduce((sum, h) => sum + h.totalValue, 0);
    const totalValueINR = totalValue * USD_TO_INR;

    // Calculate total P&L
    const totalPnl = mockHoldings.reduce((sum, h) => {
        return sum + ((h.stock.price * h.shares) - (h.avgCost * h.shares));
    }, 0);
    const totalPnlINR = totalPnl * USD_TO_INR;
    const totalPnlPercent = (totalPnl / (totalValue - totalPnl)) * 100;

    // Generate mock chart data
    const chartData = useMemo(() => {
        const points = chartTimeframe === '1W' ? 7 : chartTimeframe === '1M' ? 30 : chartTimeframe === '3M' ? 90 : 365;
        const data = [];
        let value = totalValue * 0.85;
        for (let i = 0; i < points; i++) {
            value += (Math.random() - 0.4) * (totalValue * 0.02);
            const date = new Date();
            date.setDate(date.getDate() - (points - i));
            data.push({
                name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                value: Math.max(value, totalValue * 0.7)
            });
        }
        data.push({ name: 'Today', value: totalValue });
        return data;
    }, [chartTimeframe, totalValue]);

    const HoldingItem: React.FC<{ holding: PortfolioHolding }> = ({ holding }) => {
        const pnl = (holding.stock.price * holding.shares) - (holding.avgCost * holding.shares);
        const pnlPercent = (pnl / (holding.avgCost * holding.shares)) * 100;

        return (
            <button
                onClick={() => navigate(SCREENS.STOCK_DETAIL, holding.stock)}
                className="w-full flex justify-between items-center bg-white p-2.5 rounded-xl mb-2 border border-gray-100 hover:shadow-md transition-all"
            >
                <div className="flex items-center">
                    <img src={holding.stock.logo} alt={holding.stock.name} className="w-8 h-8 rounded-full mr-3 shadow-sm" />
                    <div className="text-left">
                        <p className="font-bold text-gray-800 text-sm">{holding.stock.ticker}</p>
                        <p className="text-[10px] text-gray-500">{holding.shares} Shares</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="font-semibold text-gray-900 text-sm">${holding.totalValue.toFixed(2)}</p>
                    <p className={`text-[10px] font-medium flex items-center justify-end ${pnl >= 0 ? 'text-positive' : 'text-negative'}`}>
                        {pnl >= 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
                        <span className="ml-1">{pnl >= 0 ? '+' : ''}{pnlPercent.toFixed(2)}%</span>
                    </p>
                </div>
                <ChevronRightIcon />
            </button>
        );
    };

    const OrderItem: React.FC<{ order: Order }> = ({ order }) => {
        const statusColors = {
            Executed: 'bg-green-100 text-green-800',
            Pending: 'bg-yellow-100 text-yellow-800',
            Cancelled: 'bg-red-100 text-red-800'
        };

        return (
            <div className="bg-white p-3 rounded-xl mb-2 border border-gray-100">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="font-bold text-sm text-gray-800">{order.stock.ticker} <span className={`text-[10px] font-bold uppercase ${order.type === 'Buy' ? 'text-positive' : 'text-negative'}`}>{order.type}</span></p>
                        <p className="text-[10px] text-gray-500">{order.date}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-semibold text-sm">${(order.shares * order.price).toFixed(2)}</p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColors[order.status]}`}>{order.status}</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-full pb-20">
            <ScreenHeader
                title="My Portfolio"
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
                            {totalPnl >= 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
                            <span className="ml-1">
                                {isBalanceHidden
                                    ? '****'
                                    : `${showINR ? `₹${totalPnlINR.toFixed(0)}` : `$${Math.abs(totalPnl).toFixed(2)}`} (${totalPnlPercent >= 0 ? '+' : ''}${totalPnlPercent.toFixed(2)}%)`
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

            {/* Performance Chart */}
            <div className="px-4 py-2 -mt-4 relative z-20">
                <div className="bg-white rounded-2xl p-3 shadow-lg border border-gray-100">
                    <div className="flex justify-between items-center mb-1">
                        <h3 className="font-semibold text-gray-800 text-sm">Performance</h3>
                        <div className="flex bg-gray-100 p-0.5 rounded-lg">
                            {['1W', '1M', '3M', '1Y'].map(tf => (
                                <button
                                    key={tf}
                                    onClick={() => setChartTimeframe(tf)}
                                    className={`px-2.5 py-0.5 text-[10px] font-semibold rounded-md transition-all ${chartTimeframe === tf
                                        ? 'bg-primary text-white shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    {tf}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="h-24">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                                <defs>
                                    <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" hide />
                                <Tooltip
                                    contentStyle={{
                                        background: '#1a002b',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: 'white',
                                        fontSize: '12px'
                                    }}
                                    formatter={(value: number) => [`$${value.toFixed(2)}`, 'Value']}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#10B981"
                                    strokeWidth={2}
                                    fill="url(#portfolioGradient)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="flex mx-4 bg-gray-100 p-1 rounded-xl mb-2">
                <button
                    onClick={() => setActiveTab('holdings')}
                    className={`flex-1 py-2.5 text-center font-semibold text-sm rounded-lg transition-all ${activeTab === 'holdings'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500'
                        }`}
                >
                    Holdings ({mockHoldings.length})
                </button>
                <button
                    onClick={() => setActiveTab('orders')}
                    className={`flex-1 py-2.5 text-center font-semibold text-sm rounded-lg transition-all ${activeTab === 'orders'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500'
                        }`}
                >
                    History ({mockOrders.length})
                </button>
            </div>

            <div className="px-4 animate-fadeIn">
                {activeTab === 'holdings' ? (
                    <div>
                        {mockHoldings.map(h => <HoldingItem key={h.stock.ticker} holding={h} />)}
                    </div>
                ) : (
                    <div>
                        {mockOrders.map(o => <OrderItem key={o.id} order={o} />)}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PortfolioScreen;
