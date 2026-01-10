import React from 'react';

interface TrustSafetyModalProps {
    onClose: () => void;
}

const TrustSafetyModal: React.FC<TrustSafetyModalProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center backdrop-blur-sm animate-fadeIn">
            <div className="bg-white w-full max-w-md rounded-t-3xl p-6 animate-slideUp">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Trust & Safety
                    </h3>
                    <button onClick={onClose} className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="space-y-6">
                    {/* LRS Compliance */}
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="font-bold text-blue-900">RBI LRS Compliant</h4>
                            <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded">Active</span>
                        </div>
                        <p className="text-sm text-blue-800 mb-3">Your investments are fully compliant with RBI's Liberalised Remittance Scheme.</p>

                        <div className="space-y-1">
                            <div className="flex justify-between text-xs font-medium text-blue-700">
                                <span>Used: $1,250</span>
                                <span>Limit: $250,000 / year</span>
                            </div>
                            <div className="h-2 bg-blue-200 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-600 rounded-full" style={{ width: '0.5%' }}></div>
                            </div>
                        </div>
                    </div>

                    {/* SIPC Insurance */}
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-green-600 font-bold">$</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900">SIPC Insured</h4>
                            <p className="text-sm text-gray-600">Your securities are protected up to $500,000 (including $250k for cash) by SIPC.</p>
                        </div>
                    </div>

                    {/* Encryption */}
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900">Bank-Grade Security</h4>
                            <p className="text-sm text-gray-600">256-bit encryption and regulated US broker-dealer partnerships.</p>
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <button
                        onClick={onClose}
                        className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30"
                    >
                        Got it
                    </button>
                    <p className="text-xs text-center text-gray-400 mt-3">Regulated by SEC & FINRA</p>
                </div>
            </div>
        </div>
    );
};

export default TrustSafetyModal;
