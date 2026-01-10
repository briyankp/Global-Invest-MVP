import React, { useState } from 'react';
import type { Stock } from '../types';

// Rich AI Message Types
export type AIMessageType =
    | 'text'
    | 'stock_card'
    | 'trade_confirm'
    | 'portfolio_summary'
    | 'insight_card'
    | 'typing';

export interface AIMessage {
    id: string;
    type: AIMessageType;
    sender: 'user' | 'ai';
    content: string;
    data?: {
        stock?: Stock;
        stocks?: Stock[];
        tradeAction?: 'buy' | 'sell';
        shares?: number;
        totalValue?: number;
        portfolioData?: { name: string; value: number; allocation: number }[];
        insightTitle?: string;
        confidence?: number;
    };
    timestamp?: Date;
}

// Typing Indicator Component
export const TypingIndicator: React.FC = () => (
    <div className="flex items-center gap-2 p-3 bg-white rounded-2xl rounded-bl-lg border border-gray-200 max-w-[200px]">
        <div className="flex items-center gap-1">
            <span className="text-sm text-gray-500">Analyzing</span>
            <div className="flex gap-0.5">
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
        </div>
    </div>
);

// Stock Card Component (inline in chat)
interface StockCardProps {
    stock: Stock;
    onBuy?: () => void;
    onViewDetails?: () => void;
}

export const AIStockCard: React.FC<StockCardProps> = ({ stock, onBuy, onViewDetails }) => {
    const isPositive = stock.changePercent >= 0;

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-4 max-w-[280px] shadow-sm">
            <div className="flex items-center gap-3 mb-3">
                <img src={stock.logo} alt={stock.name} className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                    <p className="font-bold text-gray-900">{stock.ticker}</p>
                    <p className="text-xs text-gray-500 truncate">{stock.name}</p>
                </div>
                <div className="text-right">
                    <p className="font-semibold">${stock.price.toFixed(2)}</p>
                    <p className={`text-xs font-medium ${isPositive ? 'text-positive' : 'text-negative'}`}>
                        {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
                    </p>
                </div>
            </div>
            <p className="text-xs text-gray-600 mb-3 line-clamp-2">{stock.about}</p>
            <div className="flex gap-2">
                <button
                    onClick={onViewDetails}
                    className="flex-1 py-2 text-sm font-medium text-primary bg-secondary rounded-lg hover:bg-primary/20 transition"
                >
                    View Details
                </button>
                <button
                    onClick={onBuy}
                    className="flex-1 py-2 text-sm font-bold text-white bg-positive rounded-lg hover:bg-green-600 transition"
                >
                    Buy
                </button>
            </div>
        </div>
    );
};

// Trade Confirmation Component
interface TradeConfirmProps {
    stock: Stock;
    action: 'buy' | 'sell';
    shares: number;
    onConfirm: () => void;
    onCancel: () => void;
}

export const AITradeConfirm: React.FC<TradeConfirmProps> = ({ stock, action, shares, onConfirm, onCancel }) => {
    const totalValue = stock.price * shares;
    const USD_TO_INR = 83.56;

    return (
        <div className="bg-white rounded-xl border-2 border-primary/20 p-4 max-w-[300px] shadow-lg">
            <div className="flex items-center gap-2 mb-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${action === 'buy' ? 'bg-positive/10' : 'bg-negative/10'}`}>
                    <span className={`text-lg ${action === 'buy' ? 'text-positive' : 'text-negative'}`}>
                        {action === 'buy' ? '↑' : '↓'}
                    </span>
                </div>
                <div>
                    <p className="font-bold text-gray-900">Confirm {action === 'buy' ? 'Purchase' : 'Sale'}</p>
                    <p className="text-xs text-gray-500">{shares} shares of {stock.ticker}</p>
                </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 mb-3 space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Price per share</span>
                    <span className="font-medium">${stock.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Total {action === 'buy' ? 'cost' : 'proceeds'}</span>
                    <div className="text-right">
                        <span className="font-bold">${totalValue.toFixed(2)}</span>
                        <p className="text-xs text-gray-400">≈ ₹{(totalValue * USD_TO_INR).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                    </div>
                </div>
            </div>

            <div className="flex gap-2">
                <button
                    onClick={onCancel}
                    className="flex-1 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                >
                    Cancel
                </button>
                <button
                    onClick={onConfirm}
                    className={`flex-1 py-2.5 text-sm font-bold text-white rounded-lg transition ${action === 'buy'
                        ? 'bg-positive hover:bg-green-600'
                        : 'bg-negative hover:bg-red-600'
                        }`}
                >
                    {action === 'buy' ? 'Buy Now' : 'Sell Now'}
                </button>
            </div>
        </div>
    );
};

// Portfolio Summary Component
interface PortfolioSummaryProps {
    totalValue: number;
    dayChange: number;
    dayChangePercent: number;
    holdings: { name: string; value: number; allocation: number }[];
}

export const AIPortfolioSummary: React.FC<PortfolioSummaryProps> = ({ totalValue, dayChange, dayChangePercent, holdings }) => {
    const isPositive = dayChange >= 0;
    const USD_TO_INR = 83.56;

    return (
        <div className="bg-gradient-to-br from-primary to-primary-dark text-white rounded-xl p-4 max-w-[300px] shadow-lg">
            <p className="text-xs text-white/70 mb-1">Your Portfolio</p>
            <p className="text-2xl font-bold">${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            <p className="text-xs text-white/60 mb-2">≈ ₹{(totalValue * USD_TO_INR).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>

            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${isPositive ? 'bg-positive/20' : 'bg-negative/20'}`}>
                {isPositive ? '↑' : '↓'} ${Math.abs(dayChange).toFixed(2)} ({dayChangePercent >= 0 ? '+' : ''}{dayChangePercent.toFixed(2)}%) today
            </div>

            <div className="mt-3 space-y-2">
                <p className="text-xs text-white/70">Top Holdings</p>
                {holdings.slice(0, 3).map((h, i) => (
                    <div key={i} className="flex justify-between items-center">
                        <span className="text-sm">{h.name}</span>
                        <span className="text-xs text-white/80">{h.allocation}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Insight Card Component
interface InsightCardProps {
    title: string;
    content: string;
    confidence: number;
    onExplore: () => void;
}

export const AIInsightCard: React.FC<InsightCardProps> = ({ title, content, confidence, onExplore }) => (
    <div className="bg-gradient-to-r from-secondary to-white rounded-xl border border-primary/10 p-4 max-w-[300px]">
        <div className="flex items-start gap-2 mb-2">
            <div className="w-6 h-6 text-primary flex-shrink-0">
                <svg fill="currentColor" viewBox="0 0 20 20">
                    <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" />
                </svg>
            </div>
            <div>
                <p className="font-bold text-primary-dark text-sm">{title}</p>
                <div className="flex items-center gap-1 mt-0.5">
                    <div className="h-1.5 w-16 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-positive rounded-full" style={{ width: `${confidence}%` }}></div>
                    </div>
                    <span className="text-xs text-gray-500">{confidence}% confident</span>
                </div>
            </div>
        </div>
        <p className="text-xs text-gray-600 mb-3">{content}</p>
        <button
            onClick={onExplore}
            className="w-full py-2 text-sm font-semibold text-primary bg-white rounded-lg border border-primary/20 hover:bg-primary hover:text-white transition"
        >
            Explore This Idea →
        </button>
    </div>
);

// Success animation component
export const TradeSuccessMessage: React.FC<{ action: 'buy' | 'sell'; ticker: string; shares: number }> = ({ action, ticker, shares }) => (
    <div className="bg-white rounded-xl border border-positive/20 p-4 max-w-[280px] shadow-sm animate-scaleIn">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-positive/10 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-positive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <div>
                <p className="font-bold text-gray-900">Order Executed!</p>
                <p className="text-sm text-gray-600">
                    {action === 'buy' ? 'Bought' : 'Sold'} {shares} shares of {ticker}
                </p>
            </div>
        </div>
    </div>
);
