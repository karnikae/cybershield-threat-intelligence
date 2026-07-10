import React, { useState, useRef, useEffect } from 'react';
import { chatbot } from '../api';
import { Bot, Send, User, ShieldAlert, Loader2, Trash2 } from 'lucide-react';

const SUGGESTIONS = [
    "Is my system safe?",
    "What should I do?",
    "Show threat count",
    "Any suspicious IPs?",
    "What are DDoS threats?",
];

const ChatMessage = ({ msg }) => {
    const isBot = msg.role === 'bot';
    return (
        <div className={`flex items-end gap-3 ${isBot ? '' : 'flex-row-reverse'} animate-in slide-in-from-bottom duration-300`}>
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-black border
                ${isBot ? 'bg-primary/20 border-primary/30 text-primary' : 'bg-accent/20 border-accent/30 text-accent'}`}>
                {isBot ? <Bot size={16} /> : <User size={16} />}
            </div>

            {/* Bubble */}
            <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line
                ${isBot
                    ? 'bg-white/[0.06] border border-white/[0.08] text-white/80 rounded-bl-sm'
                    : 'bg-primary/20 border border-primary/30 text-white rounded-br-sm'
                }`}>
                {msg.text}
            </div>
        </div>
    );
};

const Chatbot = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            role: 'bot',
            text: "👋 CyberShield AI Analyst online.\n\nI have real-time access to your threat database. Ask me anything about your system's security status, active threats, or what actions to take."
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    const sendMessage = async (text) => {
        const q = (text || input).trim();
        if (!q) return;

        setMessages(prev => [...prev, { id: Date.now(), role: 'user', text: q }]);
        setInput('');
        setLoading(true);

        try {
            const res = await chatbot(q);
            setMessages(prev => [...prev, { id: Date.now() + 1, role: 'bot', text: res.data.reply }]);
        } catch {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                role: 'bot',
                text: '⚠️ Unable to reach backend. Ensure the server is running on port 5000.'
            }]);
        } finally {
            setLoading(false);
            inputRef.current?.focus();
        }
    };

    const handleKey = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] max-h-[900px] animate-in fade-in duration-500">
            {/* Header */}
            <header className="flex items-center justify-between mb-6 flex-shrink-0">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 relative">
                        <Bot size={26} className="text-primary" />
                        <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#0a0a0b] animate-pulse" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">AI Analyst</h1>
                        <p className="text-white/40 text-xs uppercase tracking-widest font-bold mt-0.5">Real-time Threat Intelligence Bot</p>
                    </div>
                </div>
                <button
                    onClick={() => setMessages([{
                        id: 1, role: 'bot',
                        text: "Chat cleared. How can I help you secure your system?"
                    }])}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-white/30 hover:text-white/60 hover:bg-white/5 transition-all text-xs font-bold"
                >
                    <Trash2 size={14} />
                    <span className="hidden md:inline">Clear Chat</span>
                </button>
            </header>

            {/* Chat Window */}
            <div className="flex-1 card-gradient rounded-[2rem] overflow-hidden flex flex-col border border-white/[0.06]">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-5">
                    {messages.map(msg => (
                        <ChatMessage key={msg.id} msg={msg} />
                    ))}
                    {loading && (
                        <div className="flex items-end gap-3 animate-in slide-in-from-bottom duration-300">
                            <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-primary/20 border border-primary/30 text-primary">
                                <Bot size={16} />
                            </div>
                            <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-white/[0.06] border border-white/[0.08] flex items-center gap-2">
                                <Loader2 size={14} className="animate-spin text-primary" />
                                <span className="text-xs text-white/40 font-medium">Analyzing threat data...</span>
                            </div>
                        </div>
                    )}
                    <div ref={bottomRef} />
                </div>

                {/* Suggestions */}
                <div className="px-6 pb-3 flex gap-2 overflow-x-auto scrollbar-hide flex-shrink-0">
                    {SUGGESTIONS.map(s => (
                        <button
                            key={s}
                            onClick={() => sendMessage(s)}
                            disabled={loading}
                            className="px-3 py-1.5 rounded-full border border-white/10 text-white/40 hover:text-white hover:border-primary/40 hover:bg-primary/10 text-xs font-medium whitespace-nowrap transition-all disabled:opacity-40"
                        >
                            {s}
                        </button>
                    ))}
                </div>

                {/* Input */}
                <div className="px-6 py-4 border-t border-white/[0.06] flex-shrink-0">
                    <div className="flex items-center gap-3 bg-white/[0.04] border border-white/[0.08] rounded-2xl px-4 py-2 focus-within:border-primary/40 focus-within:bg-primary/[0.03] transition-all">
                        <ShieldAlert size={16} className="text-white/20 flex-shrink-0" />
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKey}
                            placeholder="Ask about system safety, threats, IPs..."
                            disabled={loading}
                            className="flex-1 bg-transparent outline-none text-sm text-white/80 placeholder:text-white/20 disabled:opacity-50"
                        />
                        <button
                            onClick={() => sendMessage()}
                            disabled={loading || !input.trim()}
                            className="p-2 rounded-xl bg-primary text-white hover:bg-primary/80 transition-all hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:scale-100 flex-shrink-0"
                        >
                            <Send size={14} />
                        </button>
                    </div>
                    <p className="text-[10px] text-white/15 text-center mt-2">Rule-based AI • Powered by live threat data</p>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;
