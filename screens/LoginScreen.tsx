
import React from 'react';
import SparklesIcon from '../components/icons/SparklesIcon';

interface LoginScreenProps {
    onLogin: () => void;
    onSignUp: () => void;
    onInstall: () => void;
    canInstall: boolean;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onSignUp, onInstall, canInstall }) => {
    return (
        <div className="relative flex flex-col items-center justify-center h-full p-8 text-white overflow-hidden">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-purple-900 to-primary-dark">
                <div className="absolute inset-0 opacity-30">
                    {/* Floating orbs */}
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                </div>
            </div>

            {/* Content */}
            <div className="relative z-10 text-center animate-fadeIn">
                <div className="inline-block p-5 bg-white/10 backdrop-blur-md rounded-3xl mb-6 shadow-2xl">
                    <div className="w-16 h-16 text-white">
                        <SparklesIcon />
                    </div>
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight">Global Invest AI</h1>
                <p className="mt-3 text-lg text-white/80 max-w-xs mx-auto">Your AI-powered gateway to global markets.</p>

                {/* Trust indicators */}
                <div className="flex justify-center gap-3 mt-4">
                    <span className="inline-flex items-center text-xs font-medium text-white/70 bg-white/10 px-2.5 py-1 rounded-full">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        SIPC Protected
                    </span>
                    <span className="inline-flex items-center text-xs font-medium text-white/70 bg-white/10 px-2.5 py-1 rounded-full">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 7.5a1 1 0 112 0v3.879l2.06 1.06a1 1 0 01-.89 1.79l-2.5-1.285A1 1 0 018 12V7.5z" />
                        </svg>
                        24/7 Trading
                    </span>
                </div>
            </div>

            <div className="relative z-10 w-full mt-12 space-y-4 animate-slideUp" style={{ animationDelay: '0.2s' }}>
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-4 py-4 rounded-xl bg-white/10 backdrop-blur-sm placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 border border-white/20 transition-all focus:bg-white/20"
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full px-4 py-4 rounded-xl bg-white/10 backdrop-blur-sm placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 border border-white/20 transition-all focus:bg-white/20"
                />
            </div>

            <div className="relative z-10 w-full mt-6 space-y-3">
                <button
                    onClick={onLogin}
                    className="w-full py-4 text-lg font-bold text-primary bg-white rounded-xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all active:scale-[0.98]"
                >
                    Sign In
                </button>
                <button
                    onClick={onSignUp}
                    className="w-full py-4 text-lg font-semibold text-white bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl hover:bg-white/20 transition-all active:scale-[0.98]"
                >
                    Create Account
                </button>
                {canInstall && (
                    <button
                        onClick={onInstall}
                        className="w-full py-3 mt-2 text-sm font-medium text-white/80 hover:text-white border border-transparent hover:border-white/20 rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        Install App
                    </button>
                )}
            </div>

            {/* Footer text */}
            <p className="relative z-10 mt-8 text-xs text-white/50 text-center">
                Invest in 50+ global markets • FX rates updated in real-time
            </p>
        </div>
    );
};

export default LoginScreen;