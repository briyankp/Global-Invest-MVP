import React, { useState, useEffect, useRef } from 'react';
import type { NavigationProps, Stock } from '../types';
import { SCREENS } from '../constants';
import { mockStocks, mockHoldings, mockAiInsights } from '../services/mockData';
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
import ScreenHeader from '../components/ScreenHeader';

// Generate unique ID
const generateId = () => Math.random().toString(36).substring(2, 9);

// Proactive greeting messages from AI
const proactiveGreetings: AIMessage[] = [
    {
        id: generateId(),
        type: 'text',
        sender: 'ai',
        content: "Welcome back! I noticed NVIDIA is up +3.2% today. Would you like to add to your position?",
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

interface AiAssistantScreenProps extends NavigationProps {
    payload?: { autoMessage?: string; timestamp?: number } | null;
}

const AiAssistantScreen: React.FC<AiAssistantScreenProps> = ({ navigate, payload }) => {
    const [messages, setMessages] = useState<AIMessage[]>(getInitialMessages());
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [pendingTrade, setPendingTrade] = useState<{ stock: Stock; action: 'buy' | 'sell'; shares: number } | null>(null);
    const lastPayloadRef = useRef<string | null>(null);
    const chatEndRef = useRef<null | HTMLDivElement>(null);
    const hasProcessedPayload = useRef(false);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    // Handle auto-message from payload (e.g., Health Check from Portfolio)
    useEffect(() => {
        const autoMsg = payload?.autoMessage;
        // Use timestamp if available, otherwise use autoMessage + current time as fallback
        const payloadId = payload?.timestamp ? `${payload.timestamp}` : (autoMsg ? `${autoMsg}-${Date.now()}` : null);

        if (autoMsg && payloadId && !hasProcessedPayload.current) {
            hasProcessedPayload.current = true;
            // Small delay to let the screen render first
            const timer = setTimeout(() => {
                // Add user message
                const userMessage: AIMessage = {
                    id: Math.random().toString(36).substring(2, 9),
                    type: 'text',
                    sender: 'user',
                    content: autoMsg,
                };
                setMessages(prev => [...prev, userMessage]);
                setIsTyping(true);

                // Process AI response
                setTimeout(() => {
                    setIsTyping(false);
                    const aiResponses = processAIResponse(autoMsg);
                    setMessages(prev => [...prev, ...aiResponses]);
                }, 1200);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [payload]);

    const processAIResponse = (userInput: string): AIMessage[] => {
        const lowerInput = userInput.toLowerCase();
        const responses: AIMessage[] = [];

        // Greetings and simple interactions
        if (lowerInput.match(/^(hi|hello|hey|good morning|good afternoon|good evening)/)) {
            const greetings = [
                "Hello, I'm your personal investment banker. How can I help you today?",
                "Good to see you. I can help you discover opportunities, check your portfolio, or execute trades.",
                "Welcome back. What would you like to explore today - your portfolio, new investment ideas, or something else?",
            ];
            responses.push({
                id: generateId(),
                type: 'text',
                sender: 'ai',
                content: greetings[Math.floor(Math.random() * greetings.length)],
            });
            return responses;
        }

        // Thank you responses
        if (lowerInput.match(/(thank|thanks|thx|appreciate)/)) {
            responses.push({
                id: generateId(),
                type: 'text',
                sender: 'ai',
                content: "You're welcome. I'm here whenever you need investment guidance. Is there anything else I can help you with?",
            });
            return responses;
        }

        // Health Checker
        if (lowerInput.match(/(health|check.*health|portfolio health|diversif|risk|analyze)/)) {
            responses.push({
                id: generateId(),
                type: 'text',
                sender: 'ai',
                content: "**Portfolio Health Analysis**\n\n**Overall Score: 78/100**\n\n**Diversification:** Good - You have exposure across 5 sectors\n**Risk Level:** Moderate - 35% in high-growth tech\n**Currency Exposure:** 100% USD (consider hedging)\n**Concentration Risk:** NVDA at 28% - slightly elevated\n\n**Recommendations:**\n• Consider adding defensive stocks for stability\n• Rebalance NVDA position to under 25%\n• Add international exposure for diversification\n\nWould you like me to suggest specific rebalancing actions?",
            });
            return responses;
        }

        // Explore Themes
        if (lowerInput.match(/(theme|themes|explore|sector|sectors|what to invest|where to invest)/)) {
            responses.push({
                id: generateId(),
                type: 'text',
                sender: 'ai',
                content: "Here are the top investment themes I recommend based on your profile:",
            });
            // Show actual insight cards from mockAiInsights for consistent flow
            mockAiInsights.forEach(insight => {
                responses.push({
                    id: generateId(),
                    type: 'insight_card',
                    sender: 'ai',
                    content: '',
                    data: {
                        insightTitle: insight.title,
                        confidence: 85 - (parseInt(insight.id) * 5),
                        insight: insight // Pass full insight for navigation
                    },
                });
            });
            return responses;
        }

        // Market conditions
        if (lowerInput.match(/(market|markets|how.*(market|dow|nasdaq|s&p))/)) {
            responses.push({
                id: generateId(),
                type: 'text',
                sender: 'ai',
                content: "**Today's Market Overview**\n\n**S&P 500:** +0.8% - Positive momentum\n**NASDAQ:** +1.2% - Tech leading gains\n**Dow Jones:** +0.5% - Steady\n\n**Key Drivers:** Strong earnings from tech sector, Fed signals stable rates. AI stocks continue their rally.\n\nWould you like me to show you trending stocks?",
            });
            return responses;
        }

        // Sector/Industry queries
        if (lowerInput.match(/(tech|technology|ai stocks|semiconductor|chip)/)) {
            responses.push({
                id: generateId(),
                type: 'text',
                sender: 'ai',
                content: "**Tech Sector Update**\n\nThe technology sector is showing strong momentum. AI-related stocks are leading:\n\n**NVIDIA (+3.2%)** - AI chip demand surge\n**Microsoft (+1.5%)** - Azure AI growth\n**Google (+1.3%)** - Gemini AI integration\n\nThe AI boom shows no signs of slowing. Would you like to invest in this theme?",
            });
            responses.push({
                id: generateId(),
                type: 'insight_card',
                sender: 'ai',
                content: '',
                data: { insightTitle: 'AI & Semiconductors', confidence: 89 },
            });
            return responses;
        }

        // LRS/Compliance/Regulations
        if (lowerInput.match(/(lrs|liberalised|remittance|rbi|compliance|legal|tax.*rule|regulation)/)) {
            responses.push({
                id: generateId(),
                type: 'text',
                sender: 'ai',
                content: "**LRS Compliance Guide**\n\n**Liberalised Remittance Scheme (LRS)** allows Indian residents to invest up to **$250,000 per financial year** in foreign assets.\n\n**Key Points:**\n• Your investments are fully LRS-compliant\n• PAN-linked reporting to RBI\n• TCS of 5% above Rs 7 lakh (Form 15CA/15CB)\n• Securities held with SIPC-insured broker\n\nYour current utilization: **$12,450 of $250,000** (5%)\n\nAny specific compliance questions?",
            });
            return responses;
        }

        // Compare stocks
        if (lowerInput.match(/(compare|vs|versus|difference between|which.*better)/)) {
            const stock1 = mockStocks.find(s => s.ticker === 'AAPL') || mockStocks[0];
            const stock2 = mockStocks.find(s => s.ticker === 'GOOGL') || mockStocks[1];
            responses.push({
                id: generateId(),
                type: 'text',
                sender: 'ai',
                content: `**Comparison: ${stock1.ticker} vs ${stock2.ticker}**\n\n| Metric | ${stock1.ticker} | ${stock2.ticker} |\n|--------|--------|--------|\n| Price | $${stock1.price.toFixed(2)} | $${stock2.price.toFixed(2)} |\n| P/E Ratio | ${stock1.peRatio} | ${stock2.peRatio} |\n| Change | ${stock1.changePercent > 0 ? '+' : ''}${stock1.changePercent.toFixed(2)}% | ${stock2.changePercent > 0 ? '+' : ''}${stock2.changePercent.toFixed(2)}% |\n| Analyst | ${stock1.analystRating} | ${stock2.analystRating} |\n\n**Analysis:** Both are strong holds. ${stock2.ticker} has better growth potential in AI, while ${stock1.ticker} offers stability with its Services growth.`,
            });
            return responses;
        }

        // Tax queries
        if (lowerInput.match(/(tax|capital gain|dividend tax|tds)/)) {
            responses.push({
                id: generateId(),
                type: 'text',
                sender: 'ai',
                content: "**Tax Implications for US Investments**\n\n**Dividends:** 25% withholding tax (DTAA rate)\n**Short-term gains (under 2 years):** Taxed at your income slab rate (up to 30%)\n**Long-term gains (over 2 years):** 20% with indexation benefit\n\n**Your estimated tax:** Rs 8,525 for FY 2025-26\n\nWould you like me to generate a detailed tax report?",
            });
            return responses;
        }

        // Goal-based investing
        if (lowerInput.match(/(retire|retirement|goal|save for|child|education|wedding|house|car)/)) {
            responses.push({
                id: generateId(),
                type: 'text',
                sender: 'ai',
                content: "**Goal-Based Investing**\n\nI can help you invest towards your goals. Based on your query, here's what I recommend:\n\n**Retirement (20+ years):** Aggressive growth portfolio\n• 70% US Tech/Growth stocks\n• 20% International diversification\n• 10% Dividend payers\n\n**Expected CAGR:** 12-15%\n\nWould you like me to set up a SIP for this goal?",
            });
            return responses;
        }

        // What can you do / help
        if (lowerInput.match(/(what can you do|help me|what.*you.*help|how.*work|feature)/)) {
            responses.push({
                id: generateId(),
                type: 'text',
                sender: 'ai',
                content: "**I'm your AI Investment Banker**\n\nHere's what I can do:\n\n**Trade Instantly** - \"Buy 10 shares of NVIDIA\"\n**Portfolio Check** - \"How is my portfolio doing?\"\n**Health Check** - \"Analyze my portfolio health\"\n**Explore Themes** - \"What themes should I invest in?\"\n**Stock Research** - \"Tell me about Apple\"\n**AI Insights** - \"Any investment ideas?\"\n**Market Updates** - \"How are markets today?\"\n**Goal Planning** - \"Help me save for retirement\"\n**Tax Queries** - \"What are my tax implications?\"\n**Compliance** - \"Explain LRS rules\"\n\nJust ask naturally - I understand.",
            });
            return responses;
        }

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
                    content: `I couldn't find a stock matching "${tickerQuery}". Try searching for popular stocks like AAPL, GOOGL, NVDA, TSLA, or AMZN.`,
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
        if (lowerInput.includes('portfolio') || lowerInput.includes('how am i doing') || lowerInput.includes('holdings') || lowerInput.includes('my stocks')) {
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
        if (lowerInput.includes('recommend') || lowerInput.includes('show me') || lowerInput.includes('suggest') || lowerInput.includes('find') || lowerInput.includes('trending')) {
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
            const firstInsight = mockAiInsights[0];
            responses.push({
                id: generateId(),
                type: 'text',
                sender: 'ai',
                content: "Here's a top investment opportunity for you:",
            });
            responses.push({
                id: generateId(),
                type: 'insight_card',
                sender: 'ai',
                content: '',
                data: {
                    insightTitle: firstInsight.title,
                    confidence: 80,
                    insight: firstInsight,
                },
            });
            return responses;
        }

        // Price check / stock info
        if (lowerInput.includes('price') || lowerInput.includes('worth') || lowerInput.match(/tell me about|what about|how is (\w+)/)) {
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

        // Default response - much more helpful
        const suggestions = [
            "Check my portfolio",
            "Analyze my portfolio health",
            "Explore investment themes",
            "How are markets today?",
        ];
        const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];

        responses.push({
            id: generateId(),
            type: 'text',
            sender: 'ai',
            content: `I'm not quite sure what you're looking for, but I'm here to help.\n\nTry asking something like:\n• "**${randomSuggestion}**"\n• "Buy 5 shares of Apple"\n• "What are tax implications?"\n• "Help me save for retirement"\n\nOr just say **"What can you do?"** to see all my capabilities.`,
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
                <div key={msg.id} className="flex justify-end mb-2">
                    <div className="max-w-[80%] p-2.5 bg-primary text-white rounded-2xl rounded-br-lg">
                        <p className="text-xs leading-relaxed">{msg.content}</p>
                    </div>
                </div>
            );
        }

        // AI messages
        return (
            <div key={msg.id} className="flex items-end gap-2 mb-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white flex-shrink-0 shadow-md">
                    <SparklesIcon />
                </div>
                <div className="max-w-[85%]">
                    {msg.type === 'text' && (
                        <div className="p-2.5 bg-white text-gray-800 border border-gray-200 rounded-2xl rounded-bl-lg shadow-sm">
                            <p className="text-xs leading-relaxed whitespace-pre-line" dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
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
                            content={msg.data?.insight?.content || "AI-driven analysis shows strong momentum. Tap to explore stocks that match this thesis."}
                            confidence={msg.data?.confidence || 75}
                            onExplore={() => navigate(SCREENS.RECOMMENDED_STOCKS, msg.data?.insight || { title: msg.data?.insightTitle })}
                        />
                    )}
                </div>
            </div>
        );
    };

    const suggestionPrompts = [
        "Portfolio Health Check",
        "View my portfolio",
        "Buy 5 shares of NVIDIA",
        "Investment opportunities",
        "Explore themes",
        "LRS Compliance",
    ];

    return (
        <div className="flex flex-col h-full bg-gradient-to-b from-gray-50 to-white">
            {/* Header */}
            <ScreenHeader
                title="AI Banker"
                subtitle="Online"
                className="rounded-b-[1.5rem] shadow-lg sticky top-0 z-20 min-h-[80px]"
                rightElement={
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-md border border-white/30">
                        <SparklesIcon />
                    </div>
                }
            />

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
                {/* Quick Suggestions - 2 row grid */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                    {suggestionPrompts.map((prompt) => (
                        <button
                            key={prompt}
                            onClick={() => handleSuggestionClick(prompt)}
                            className="px-2 py-1.5 text-[10px] font-medium text-primary bg-secondary rounded-lg hover:bg-primary hover:text-white transition-all text-center leading-tight"
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
