
import React, { useState, useMemo } from 'react';
import type { NavigationProps, PortfolioHolding, Order } from '../types';
import { SCREENS } from '../constants';
import { mockHoldings, mockOrders } from '../services/mockData';
import ArrowUpIcon from '../components/icons/ArrowUpIcon';
import ArrowDownIcon from '../components/icons/ArrowDownIcon';
import ChevronRightIcon from '../components/icons/ChevronRightIcon';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

const USD_TO_INR = 83.56;

const PortfolioScreen: React.FC<NavigationProps> = ({ navigate }) => {
    const [activeTab, setActiveTab] = useState<'holdings' | 'orders'>('holdings');
    const [chartTimeframe, setChartTimeframe] = useState('1M');
    const totalValue = mockHoldings.reduce((sum, h) => sum + h.totalValue, 0);
    const totalValueINR = totalValue * USD_TO_INR;

    // Calculate total P&L
    const totalPnl = mockHoldings.reduce((sum, h) => {
        return sum + ((h.stock.price * h.shares) - (h.avgCost * h.shares));
    }, 0);
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
                className="w-full flex justify-between items-center bg-white p-4 rounded-xl mb-3 border border-gray-100 hover:shadow-md transition-all"
            >
                <div className="flex items-center">
                    <img src={holding.stock.logo} alt={holding.stock.name} className="w-11 h-11 rounded-full mr-4 shadow-sm" />
                    <div className="text-left">
                        <p className="font-bold text-gray-800">{holding.stock.ticker}</p>
                        <p className="text-sm text-gray-500">{holding.shares} Shares</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="font-semibold text-gray-900">${holding.totalValue.toFixed(2)}</p>
                    <p className={`text-sm font-medium flex items-center justify-end ${pnl >= 0 ? 'text-positive' : 'text-negative'}`}>
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
            <div className="bg-white p-4 rounded-xl mb-3 border border-gray-100">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="font-bold text-lg text-gray-800">{order.stock.ticker} <span className={`text-sm font-medium ${order.type === 'Buy' ? 'text-positive' : 'text-negative'}`}>{order.type}</span></p>
                        <p className="text-sm text-gray-500">{order.date}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-semibold">${(order.shares * order.price).toFixed(2)}</p>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColors[order.status]}`}>{order.status}</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-full pb-24">
            <header className="p-6 bg-gradient-to-br from-primary to-primary-dark text-white rounded-b-3xl">
                <h1 className="text-xl font-semibold text-white/80">My Portfolio</h1>
                <p className="text-4xl font-bold mt-2">${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p className="text-sm text-white/60 mt-0.5">≈ ₹{totalValueINR.toLocaleString('en-IN', { maximumFractionDigits: 0 })} INR</p>

                <div className="flex items-center mt-3">
                    <span className={`inline-flex items-center font-medium px-3 py-1.5 rounded-full text-sm ${totalPnl >= 0 ? 'bg-positive/20 text-white' : 'bg-negative/20 text-white'}`}>
                        {totalPnl >= 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
                        <span className="ml-1">${Math.abs(totalPnl).toFixed(2)} ({totalPnlPercent >= 0 ? '+' : ''}{totalPnlPercent.toFixed(2)}%)</span>
                    </span>
                    <span className="text-xs text-white/60 ml-2">All time</span>
                </div>
            </header>

            {/* Performance Chart */}
            <div className="px-4 py-4 -mt-4">
                <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-gray-800">Performance</h3>
                        <div className="flex bg-gray-100 p-0.5 rounded-lg">
                            {['1W', '1M', '3M', '1Y'].map(tf => (
                                <button
                                    key={tf}
                                    onClick={() => setChartTimeframe(tf)}
                                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${chartTimeframe === tf
                                            ? 'bg-primary text-white shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    {tf}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="h-36">
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

            <div className="flex mx-4 bg-gray-100 p-1 rounded-xl mb-4">
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
