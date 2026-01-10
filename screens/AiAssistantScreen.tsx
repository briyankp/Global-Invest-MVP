
import React, { useState, useEffect, useRef } from 'react';
import type { NavigationProps, Stock } from '../types';
import { SCREENS } from '../constants';
import { mockStocks, mockHoldings } from '../services/mockData';
import SparklesIcon from '../components/icons/SparklesIcon';
import SendIcon from '../components/icons/SendIcon';
import {
    AIMessage,
    AIMessageType,
    TypingIndicator,
    AIStockCard,
    AITradeConfirm,
    AIPortfolioSummary,
    AIInsightCard,
    TradeSuccessMessage,
} from '../components/AIMessageComponents';

// Generate unique ID
const generateId = () => Math.random().toString(36).substring(2, 9);

// Proactive greeting messages from AI
const proactiveGreetings: AIMessage[] = [
    {
        id: generateId(),
        type: 'text',
        sender: 'ai',
        content: "👋 Welcome back! I noticed NVIDIA is up +3.2% today. Would you like to add to your position?",
    },
    {
        id: generateId(),
        type: 'insight_card',
        sender: 'ai',
        content: '',
        data: {
            insightTitle: 'AI Chip Demand Surge',
            confidence: 87,
        },
    },
];

// Initial welcome message
const getInitialMessages = (): AIMessage[] => [
    {
        id: generateId(),
        type: 'text',
        sender: 'ai',
        content: "Hello! I'm your personal investment banker. I can help you discover opportunities, analyze stocks, and execute trades instantly. What would you like to do?",
    },
];

const AiAssistantScreen: React.FC<NavigationProps> = ({ navigate }) => {
    const [messages, setMessages] = useState<AIMessage[]>(getInitialMessages());
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [pendingTrade, setPendingTrade] = useState<{ stock: Stock; action: 'buy' | 'sell'; shares: number } | null>(null);
    const chatEndRef = useRef<null | HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    // Add proactive suggestion after initial load
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsTyping(true);
            setTimeout(() => {
                setIsTyping(false);
                setMessages(prev => [...prev, proactiveGreetings[0]]);
            }, 1500);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    const processAIResponse = (userInput: string): AIMessage[] => {
        const lowerInput = userInput.toLowerCase();
        const responses: AIMessage[] = [];

        // Buy command detection
        const buyMatch = lowerInput.match(/buy\s+(\d+)?\s*(shares?\s+of\s+)?(\w+)/i);
        if (buyMatch) {
            const shares = parseInt(buyMatch[1]) || 5;
            const tickerQuery = buyMatch[3].toUpperCase();
            const stock = mockStocks.find(s =>
                s.ticker.toUpperCase().includes(tickerQuery) ||
                s.name.toLowerCase().includes(tickerQuery.toLowerCase())
            );

            if (stock) {
                setPendingTrade({ stock, action: 'buy', shares });
                responses.push({
                    id: generateId(),
                    type: 'text',
                    sender: 'ai',
                    content: `I found ${stock.name} for you. Here's the trade confirmation:`,
                });
                responses.push({
                    id: generateId(),
                    type: 'trade_confirm',
                    sender: 'ai',
                    content: '',
                    data: { stock, tradeAction: 'buy', shares },
                });
            } else {
                responses.push({
                    id: generateId(),
                    type: 'text',
                    sender: 'ai',
                    content: `I couldn't find a stock matching "${tickerQuery}". Would you like me to search for it?`,
                });
            }
            return responses;
        }

        // Sell command detection
        if (lowerInput.includes('sell')) {
            const holding = mockHoldings[0];
            setPendingTrade({ stock: holding.stock, action: 'sell', shares: 10 });
            responses.push({
                id: generateId(),
                type: 'text',
                sender: 'ai',
                content: `Ready to sell some of your ${holding.stock.name} position. Confirm below:`,
            });
            responses.push({
                id: generateId(),
                type: 'trade_confirm',
                sender: 'ai',
                content: '',
                data: { stock: holding.stock, tradeAction: 'sell', shares: 10 },
            });
            return responses;
        }

        // Portfolio check
        if (lowerInput.includes('portfolio') || lowerInput.includes('how am i doing') || lowerInput.includes('holdings')) {
            const totalValue = mockHoldings.reduce((acc, h) => acc + h.totalValue, 0);
            responses.push({
                id: generateId(),
                type: 'text',
                sender: 'ai',
                content: "Here's your current portfolio snapshot:",
            });
            responses.push({
                id: generateId(),
                type: 'portfolio_summary',
                sender: 'ai',
                content: '',
                data: {
                    totalValue,
                    portfolioData: mockHoldings.map(h => ({
                        name: h.stock.ticker,
                        value: h.totalValue,
                        allocation: Math.round((h.totalValue / totalValue) * 100),
                    })),
                },
            });
            return responses;
        }

        // Stock recommendation / show me stocks
        if (lowerInput.includes('recommend') || lowerInput.includes('show me') || lowerInput.includes('suggest') || lowerInput.includes('find')) {
            const recommendedStock = mockStocks.find(s => s.ticker === 'NVDA') || mockStocks[0];
            responses.push({
                id: generateId(),
                type: 'text',
                sender: 'ai',
                content: "Based on your profile and current market conditions, I recommend:",
            });
            responses.push({
                id: generateId(),
                type: 'stock_card',
                sender: 'ai',
                content: '',
                data: { stock: recommendedStock },
            });
            responses.push({
                id: generateId(),
                type: 'text',
                sender: 'ai',
                content: "NVIDIA is leading the AI chip revolution with 80%+ market share in data center GPUs. Earnings beat estimates by 18% last quarter.",
            });
            return responses;
        }

        // Insight/opportunity detection
        if (lowerInput.includes('opportunit') || lowerInput.includes('idea') || lowerInput.includes('insight')) {
            responses.push({
                id: generateId(),
                type: 'insight_card',
                sender: 'ai',
                content: '',
                data: {
                    insightTitle: 'European Fintech Rally',
                    confidence: 78,
                },
            });
            return responses;
        }

        // Price check
        if (lowerInput.includes('price') || lowerInput.includes('worth')) {
            const stock = mockStocks.find(s =>
                lowerInput.includes(s.ticker.toLowerCase()) ||
                lowerInput.includes(s.name.toLowerCase().split(' ')[0])
            ) || mockStocks[0];

            responses.push({
                id: generateId(),
                type: 'stock_card',
                sender: 'ai',
                content: '',
                data: { stock },
            });
            return responses;
        }

        // Default response
        responses.push({
            id: generateId(),
            type: 'text',
            sender: 'ai',
            content: "I can help you with:\n• **Buy/Sell stocks** – \"Buy 5 shares of NVIDIA\"\n• **Check portfolio** – \"How is my portfolio doing?\"\n• **Find opportunities** – \"Show me trending stocks\"\n• **Get insights** – \"Any investment ideas?\"\n\nWhat would you like to do?",
        });
        return responses;
    };

    const handleSend = (text: string = input) => {
        if (!text.trim()) return;

        const userMessage: AIMessage = {
            id: generateId(),
            type: 'text',
            sender: 'user',
            content: text,
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        // Simulate AI thinking
        setTimeout(() => {
            setIsTyping(false);
            const aiResponses = processAIResponse(text);
            setMessages(prev => [...prev, ...aiResponses]);
        }, 1200 + Math.random() * 800);
    };

    const handleSuggestionClick = (prompt: string) => {
        handleSend(prompt);
    };

    const handleTradeConfirm = () => {
        if (!pendingTrade) return;

        setMessages(prev => [
            ...prev,
            {
                id: generateId(),
                type: 'text',
                sender: 'ai',
                content: '',
                data: {
                    tradeAction: pendingTrade.action,
                    stock: pendingTrade.stock,
                    shares: pendingTrade.shares,
                },
            } as AIMessage,
        ]);

        // Show success
        setTimeout(() => {
            setMessages(prev => [
                ...prev,
                {
                    id: generateId(),
                    type: 'text',
                    sender: 'ai',
                    content: `✅ **Order executed!** ${pendingTrade.action === 'buy' ? 'Bought' : 'Sold'} ${pendingTrade.shares} shares of ${pendingTrade.stock.ticker} at $${pendingTrade.stock.price.toFixed(2)}`,
                },
            ]);
            setPendingTrade(null);
        }, 500);
    };

    const handleTradeCancel = () => {
        setMessages(prev => [
            ...prev,
            {
                id: generateId(),
                type: 'text',
                sender: 'ai',
                content: "No problem! Let me know if you'd like to explore other options.",
            },
        ]);
        setPendingTrade(null);
    };

    const handleBuyFromCard = (stock: Stock) => {
        setPendingTrade({ stock, action: 'buy', shares: 5 });
        setMessages(prev => [
            ...prev,
            {
                id: generateId(),
                type: 'trade_confirm',
                sender: 'ai',
                content: '',
                data: { stock, tradeAction: 'buy', shares: 5 },
            },
        ]);
    };

    const handleViewDetails = (stock: Stock) => {
        navigate(SCREENS.STOCK_DETAIL, stock);
    };

    const handleExploreInsight = () => {
        navigate(SCREENS.RECOMMENDED_STOCKS, { title: 'AI Investment Idea' });
    };

    const renderMessage = (msg: AIMessage) => {
        if (msg.sender === 'user') {
            return (
                <div key={msg.id} className="flex justify-end mb-3">
                    <div className="max-w-[80%] p-3 bg-primary text-white rounded-2xl rounded-br-lg">
                        <p className="text-sm">{msg.content}</p>
                    </div>
                </div>
            );
        }

        // AI messages
        return (
            <div key={msg.id} className="flex items-end gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white flex-shrink-0 shadow-md">
                    <SparklesIcon />
                </div>
                <div className="max-w-[85%]">
                    {msg.type === 'text' && (
                        <div className="p-3 bg-white text-gray-800 border border-gray-200 rounded-2xl rounded-bl-lg shadow-sm">
                            <p className="text-sm whitespace-pre-line" dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                        </div>
                    )}
                    {msg.type === 'stock_card' && msg.data?.stock && (
                        <AIStockCard
                            stock={msg.data.stock}
                            onBuy={() => handleBuyFromCard(msg.data!.stock!)}
                            onViewDetails={() => handleViewDetails(msg.data!.stock!)}
                        />
                    )}
                    {msg.type === 'trade_confirm' && msg.data?.stock && (
                        <AITradeConfirm
                            stock={msg.data.stock}
                            action={msg.data.tradeAction || 'buy'}
                            shares={msg.data.shares || 5}
                            onConfirm={handleTradeConfirm}
                            onCancel={handleTradeCancel}
                        />
                    )}
                    {msg.type === 'portfolio_summary' && msg.data?.portfolioData && (
                        <AIPortfolioSummary
                            totalValue={mockHoldings.reduce((acc, h) => acc + h.totalValue, 0)}
                            dayChange={1250.75}
                            dayChangePercent={1.52}
                            holdings={msg.data.portfolioData.map(p => ({ name: p.name, value: p.value, allocation: p.allocation || 0 }))}
                        />
                    )}
                    {msg.type === 'insight_card' && (
                        <AIInsightCard
                            title={msg.data?.insightTitle || 'Investment Opportunity'}
                            content="AI-driven analysis shows strong momentum in this sector. Tap to explore stocks that match this thesis."
                            confidence={msg.data?.confidence || 75}
                            onExplore={handleExploreInsight}
                        />
                    )}
                </div>
            </div>
        );
    };

    const suggestionPrompts = [
        "Buy 5 shares of NVIDIA",
        "How's my portfolio?",
        "Show me opportunities",
        "Find trending stocks",
    ];

    return (
        <div className="flex flex-col h-full bg-gradient-to-b from-gray-50 to-white">
            {/* Header */}
            <header className="p-4 border-b bg-white/80 backdrop-blur-sm text-center sticky top-0 z-10">
                <div className="flex items-center justify-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white">
                        <SparklesIcon />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-gray-800">AI Investment Banker</h1>
                        <p className="text-xs text-positive flex items-center justify-center gap-1">
                            <span className="w-1.5 h-1.5 bg-positive rounded-full animate-pulse"></span>
                            Online • Ready to assist
                        </p>
                    </div>
                </div>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
                {messages.map(renderMessage)}
                {isTyping && (
                    <div className="flex items-end gap-2 mb-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white flex-shrink-0">
                            <SparklesIcon />
                        </div>
                        <TypingIndicator />
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t shadow-lg">
                {/* Quick Suggestions */}
                <div className="flex gap-2 mb-3 overflow-x-auto pb-2 scrollbar-hide">
                    {suggestionPrompts.map((prompt) => (
                        <button
                            key={prompt}
                            onClick={() => handleSuggestionClick(prompt)}
                            className="flex-shrink-0 px-3 py-1.5 text-xs font-medium text-primary bg-secondary rounded-full hover:bg-primary hover:text-white transition-all"
                        >
                            {prompt}
                        </button>
                    ))}
                </div>

                {/* Input Field */}
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask me anything about investing..."
                        className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                    />
                    <button
                        onClick={() => handleSend()}
                        disabled={!input.trim()}
                        className="p-3 bg-gradient-to-br from-primary to-primary-dark text-white rounded-full shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <SendIcon />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AiAssistantScreen;
