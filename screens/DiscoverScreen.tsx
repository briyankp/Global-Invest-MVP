
import React, { useState } from 'react';
import type { NavigationProps, Stock } from '../types';
import { SCREENS } from '../constants';
import { mockStocks, mockInternationalStocks } from '../services/mockData';
import { searchStocks } from '../services/geminiService';
import SearchIcon from '../components/icons/SearchIcon';
import ScreenHeader from '../components/ScreenHeader';

const DiscoverScreen: React.FC<NavigationProps> = ({ navigate }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('Top Gainers');
    const [searchResults, setSearchResults] = useState<Stock[] | null>(null);
    const [watchlist, setWatchlist] = useState<Set<string>>(new Set(['ADYEN.AS', 'ASML.AS', '1211.HK']));
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const handleSearch = () => {
        if (searchTerm.trim() === '') {
            setSearchResults(null);
            return;
        }
        const results = searchStocks(searchTerm);
        setSearchResults(results);
    };

    const toggleWatchlist = (ticker: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const newWatchlist = new Set(watchlist);
        if (newWatchlist.has(ticker)) {
            newWatchlist.delete(ticker);
            showToast(`${ticker} removed from watchlist`);
        } else {
            newWatchlist.add(ticker);
            showToast(`${ticker} added to watchlist`);
        }
        setWatchlist(newWatchlist);
    };

    const showToast = (message: string) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(null), 2500);
    };

    const tabs = ['Top Gainers', 'Top Losers', 'International'];

    const getStockList = () => {
        switch (activeTab) {
            case 'Top Gainers':
                return [...mockStocks].sort((a, b) => b.changePercent - a.changePercent).slice(0, 5);
            case 'Top Losers':
                return [...mockStocks].sort((a, b) => a.changePercent - b.changePercent).slice(0, 5);
            case 'International':
                return mockInternationalStocks;
            default:
                return mockStocks.slice(0, 5);
        }
    };

    const StockListItem: React.FC<{ stock: Stock }> = ({ stock }) => {
        const isInWatchlist = watchlist.has(stock.ticker);

        return (
            <button
                onClick={() => navigate(SCREENS.STOCK_DETAIL, stock)}
                className="flex items-center justify-between w-full p-2.5 bg-white rounded-xl mb-2 transition-all hover:shadow-md hover:scale-[1.01] border border-gray-100 group"
            >
                <div className="flex items-center flex-1">
                    <img src={stock.logo} alt={stock.name} className="w-8 h-8 rounded-full mr-3 shadow-sm" />
                    <div className="text-left">
                        <p className="font-bold text-gray-800 text-sm">{stock.ticker}</p>
                        <p className="text-[10px] text-gray-500 truncate max-w-[120px]">{stock.name}</p>
                    </div>
                </div>
                <div className="text-right mr-3">
                    <p className="font-semibold text-gray-900 text-sm">${stock.price.toFixed(2)}</p>
                    <p className={`text-[10px] font-medium ${stock.changePercent >= 0 ? 'text-positive' : 'text-negative'}`}>
                        {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                    </p>
                </div>
                <button
                    onClick={(e) => toggleWatchlist(stock.ticker, e)}
                    className={`p-1.5 rounded-full transition-all ${isInWatchlist
                        ? 'bg-primary/10 text-primary'
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                        }`}
                >
                    <svg className="w-4 h-4" fill={isInWatchlist ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>
            </button>
        );
    };

    return (
        <div className="pb-24 min-h-full bg-gray-50">
            <ScreenHeader
                title="Discover"
                subtitle="Explore global investment opportunities"
            >
                <div className="relative mt-1">
                    <input
                        type="text"
                        placeholder='"AI chip stocks" or "European dividend payers"'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        className="w-full pl-10 pr-4 py-3 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 bg-white text-gray-900 shadow-lg shadow-black/5 placeholder-gray-400 transition-all text-sm"
                    />
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                        <SearchIcon />
                    </div>
                </div>
            </ScreenHeader>

            <div className="p-4">

                {searchResults ? (
                    <div className="animate-fadeIn">
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="text-lg font-bold text-gray-800">Search Results</h2>
                            <button
                                onClick={() => setSearchResults(null)}
                                className="text-sm text-primary font-medium"
                            >
                                Clear
                            </button>
                        </div>
                        {searchResults.length > 0 ? (
                            searchResults.map(stock => <StockListItem key={stock.ticker} stock={stock} />)
                        ) : (
                            <p className="text-center text-gray-500 py-8">No results found.</p>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl mb-4">
                            {tabs.map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`flex-1 px-3 py-2.5 text-sm font-semibold rounded-lg transition-all ${activeTab === tab
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div className="animate-fadeIn">
                            {getStockList().map(stock => <StockListItem key={stock.ticker} stock={stock} />)}
                        </div>
                    </>
                )}

                {/* Toast notification */}
                {toastMessage && (
                    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-lg animate-slideUp flex items-center">
                        <svg className="w-5 h-5 mr-2 text-positive" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {toastMessage}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DiscoverScreen;
