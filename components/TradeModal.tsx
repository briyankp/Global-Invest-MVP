import React, { useState, useEffect } from 'react';
import type { Stock } from '../types';

interface TradeModalProps {
    stock: Stock;
    mode: 'buy' | 'sell';
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (shares: number, mode: 'buy' | 'sell') => void;
}

// Mock FX rate - in production this would come from an API
const USD_TO_INR = 83.56;

const TradeModal: React.FC<TradeModalProps> = ({ stock, mode, isOpen, onClose, onConfirm }) => {
    const [shares, setShares] = useState<number>(1);
    const [tradeMode, setTradeMode] = useState<'buy' | 'sell'>(mode);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        setTradeMode(mode);
        setShares(1);
        setShowSuccess(false);
        setIsProcessing(false);
    }, [mode, isOpen]);

    if (!isOpen) return null;

    const totalUSD = shares * stock.price;
    const totalINR = totalUSD * USD_TO_INR;
    const feeUSD = totalUSD * 0.001; // 0.1% fee
    const feeINR = feeUSD * USD_TO_INR;
    const grandTotalUSD = tradeMode === 'buy' ? totalUSD + feeUSD : totalUSD - feeUSD;
    const grandTotalINR = grandTotalUSD * USD_TO_INR;

    const handleConfirm = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setShowSuccess(true);
            setTimeout(() => {
                onConfirm(shares, tradeMode);
                onClose();
            }, 2000);
        }, 1500);
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget && !isProcessing && !showSuccess) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm animate-fadeIn"
            onClick={handleBackdropClick}
        >
            <div className="w-full max-w-md bg-white rounded-t-3xl shadow-2xl animate-slideUp">
                {showSuccess ? (
                    <div className="p-8 text-center">
                        <div className="w-20 h-20 mx-auto mb-4 bg-positive/10 rounded-full flex items-center justify-center animate-scaleIn">
                            <svg className="w-10 h-10 text-positive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Order Placed!</h3>
                        <p className="text-gray-600">
                            {tradeMode === 'buy' ? 'Bought' : 'Sold'} {shares} share{shares > 1 ? 's' : ''} of {stock.ticker}
                        </p>
                        <p className="text-lg font-semibold text-primary mt-2">
                            ${grandTotalUSD.toFixed(2)} USD
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b">
                            <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-800">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <div className="flex items-center">
                                <img src={stock.logo} alt={stock.name} className="w-8 h-8 rounded-full mr-2" />
                                <span className="font-bold text-gray-900">{stock.ticker}</span>
                            </div>
                            <div className="w-10"></div>
                        </div>

                        {/* Buy/Sell Toggle */}
                        <div className="flex bg-gray-100 m-4 p-1 rounded-xl">
                            <button
                                onClick={() => setTradeMode('buy')}
                                className={`flex-1 py-3 text-center font-bold rounded-lg transition-all ${tradeMode === 'buy'
                                        ? 'bg-positive text-white shadow-md'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                Buy
                            </button>
                            <button
                                onClick={() => setTradeMode('sell')}
                                className={`flex-1 py-3 text-center font-bold rounded-lg transition-all ${tradeMode === 'sell'
                                        ? 'bg-negative text-white shadow-md'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                Sell
                            </button>
                        </div>

                        {/* Shares Input */}
                        <div className="px-4 pb-4">
                            <label className="text-sm font-medium text-gray-500 mb-2 block">Number of Shares</label>
                            <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden focus-within:border-primary">
                                <button
                                    onClick={() => setShares(Math.max(1, shares - 1))}
                                    className="px-4 py-3 text-2xl font-bold text-gray-500 hover:bg-gray-100"
                                >
                                    −
                                </button>
                                <input
                                    type="number"
                                    min="1"
                                    value={shares}
                                    onChange={(e) => setShares(Math.max(1, parseInt(e.target.value) || 1))}
                                    className="flex-1 text-center text-2xl font-bold py-3 focus:outline-none"
                                />
                                <button
                                    onClick={() => setShares(shares + 1)}
                                    className="px-4 py-3 text-2xl font-bold text-gray-500 hover:bg-gray-100"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Price Breakdown */}
                        <div className="mx-4 mb-4 p-4 bg-gray-50 rounded-xl space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Market Price</span>
                                <span className="font-semibold">${stock.price.toFixed(2)} USD</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">{shares} × ${stock.price.toFixed(2)}</span>
                                <span className="font-semibold">${totalUSD.toFixed(2)} USD</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Transaction Fee (0.1%)</span>
                                <span className="text-gray-500">${feeUSD.toFixed(2)} USD</span>
                            </div>
                            <div className="border-t border-gray-200 pt-3">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-gray-800">Total {tradeMode === 'buy' ? 'Cost' : 'Proceeds'}</span>
                                    <div className="text-right">
                                        <p className="text-xl font-bold text-gray-900">${grandTotalUSD.toFixed(2)}</p>
                                        <p className="text-sm text-gray-500">≈ ₹{grandTotalINR.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* FX Rate Info */}
                        <div className="mx-4 mb-4 p-3 bg-secondary/50 rounded-lg flex items-center">
                            <svg className="w-5 h-5 text-primary mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-xs text-primary-dark">
                                <span className="font-semibold">Live FX Rate:</span> 1 USD = ₹{USD_TO_INR.toFixed(2)} INR
                            </p>
                        </div>

                        {/* Confirm Button */}
                        <div className="p-4 pt-0">
                            <button
                                onClick={handleConfirm}
                                disabled={isProcessing}
                                className={`w-full py-4 font-bold text-lg rounded-xl transition-all shadow-lg ${tradeMode === 'buy'
                                        ? 'bg-positive hover:bg-green-600 text-white'
                                        : 'bg-negative hover:bg-red-600 text-white'
                                    } ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isProcessing ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </span>
                                ) : (
                                    `Confirm ${tradeMode === 'buy' ? 'Buy' : 'Sell'} Order`
                                )}
                            </button>
                        </div>

                        {/* Trust Badge */}
                        <div className="p-4 pt-0 flex justify-center gap-4 text-xs text-gray-400">
                            <span className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                SIPC Protected
                            </span>
                            <span className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                                256-bit Encryption
                            </span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default TradeModal;
