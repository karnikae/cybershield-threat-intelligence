import React, { useState, useEffect } from 'react';
import { getRecommendations } from '../api';
import { ShieldCheck, Ban, Activity, Users, RefreshCw, AlertTriangle, Crown } from 'lucide-react';

const iconMap = {
    ban: Ban,
    shield: ShieldCheck,
    activity: Activity,
    users: Users,
    refresh: RefreshCw,
};

const priorityConfig = {
    critical: {
        border: 'border-l-danger',
        bg: 'bg-danger/5',
        badge: 'bg-danger/20 text-danger',
        icon: 'bg-danger/20 text-danger',
        dot: 'bg-danger',
    },
    high: {
        border: 'border-l-orange-500',
        bg: 'bg-orange-500/5',
        badge: 'bg-orange-500/20 text-orange-400',
        icon: 'bg-orange-500/20 text-orange-400',
        dot: 'bg-orange-500',
    },
    medium: {
        border: 'border-l-accent',
        bg: 'bg-accent/5',
        badge: 'bg-accent/20 text-accent',
        icon: 'bg-accent/20 text-accent',
        dot: 'bg-accent',
    },
    low: {
        border: 'border-l-emerald-500',
        bg: 'bg-emerald-500/5',
        badge: 'bg-emerald-500/20 text-emerald-400',
        icon: 'bg-emerald-500/20 text-emerald-400',
        dot: 'bg-emerald-500',
    },
};

const Recommendations = () => {
    const [recs, setRecs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dismissed, setDismissed] = useState([]);
    const role = localStorage.getItem('role') || 'analyst';

    useEffect(() => {
        const load = async () => {
            try {
                const res = await getRecommendations();
                setRecs(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const visible = recs.filter(r => !dismissed.includes(r.id));

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2.5 rounded-2xl bg-primary/10 border border-primary/20">
                            <ShieldCheck size={24} className="text-primary" />
                        </div>
                        <h1 className="text-3xl font-black tracking-tight">AI Recommendations</h1>
                    </div>
                    <p className="text-white/40 text-sm uppercase tracking-widest font-bold ml-1">
                        Rule-Based Security Intelligence
                    </p>
                </div>

                {/* Role Badge */}
                <div className={`flex items-center gap-2 px-4 py-2.5 rounded-full border text-xs font-black uppercase tracking-wider ${
                    role === 'admin' 
                        ? 'bg-primary/10 border-primary/20 text-primary' 
                        : 'bg-white/5 border-white/10 text-white/40'
                }`}>
                    {role === 'admin' ? <Crown size={14} /> : <ShieldCheck size={14} />}
                    {role === 'admin' ? 'Admin View — Full Access' : 'Analyst View — Read Only'}
                </div>
            </header>

            {/* Admin vs Analyst Notice */}
            {role !== 'admin' && (
                <div className="p-5 rounded-2xl bg-accent/10 border border-accent/20 flex items-center gap-4">
                    <AlertTriangle size={20} className="text-accent flex-shrink-0" />
                    <p className="text-sm text-white/70">
                        You are viewing as <span className="font-bold text-accent">Analyst</span>. 
                        Action buttons are visible but require Admin approval to execute.
                    </p>
                </div>
            )}

            {/* Stats summary */}
            {!loading && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['critical', 'high', 'medium', 'low'].map(p => {
                        const count = recs.filter(r => r.priority === p).length;
                        const cfg = priorityConfig[p];
                        return (
                            <div key={p} className={`p-5 rounded-2xl card-gradient border-l-4 ${cfg.border} ${cfg.bg}`}>
                                <p className="text-xs font-black uppercase tracking-widest text-white/40">{p} Priority</p>
                                <p className="text-4xl font-black mt-1">{count}</p>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Recommendations Cards */}
            {loading ? (
                <div className="flex items-center justify-center py-20 text-white/30 animate-pulse gap-3">
                    <RefreshCw className="animate-spin" />
                    Analyzing threat patterns...
                </div>
            ) : (
                <div className="space-y-4">
                    {visible.length === 0 ? (
                        <div className="flex flex-col items-center gap-4 p-20 border-2 border-dashed border-white/5 rounded-[2.5rem]">
                            <ShieldCheck size={56} className="text-emerald-500/30" />
                            <div className="text-center">
                                <p className="text-xl font-bold">All Clear</p>
                                <p className="text-sm text-white/30 mt-1">No active recommendations. System is well-secured.</p>
                            </div>
                        </div>
                    ) : (
                        visible.map((rec, i) => {
                            const cfg = priorityConfig[rec.priority];
                            const IconComp = iconMap[rec.icon] || ShieldCheck;
                            return (
                                <div
                                    key={rec.id}
                                    className={`p-6 rounded-[1.5rem] card-gradient border-l-4 ${cfg.border} ${cfg.bg} hover:scale-[1.01] transition-all duration-300 animate-in slide-in-from-left`}
                                    style={{ animationDelay: `${i * 80}ms` }}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-4 flex-1">
                                            <div className={`p-3 rounded-2xl flex-shrink-0 ${cfg.icon}`}>
                                                <IconComp size={20} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                    <h3 className="font-bold text-base">{rec.title}</h3>
                                                    <span className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${cfg.badge}`}>
                                                        {rec.priority}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-white/50 leading-relaxed">{rec.description}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <button
                                                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all hover:scale-105 active:scale-95 ${cfg.badge} ${cfg.border.replace('border-l', 'border')}`}
                                                onClick={() => {
                                                    if (role === 'admin') {
                                                        alert(`✅ Action "${rec.action}" dispatched by Admin.`);
                                                        setDismissed(prev => [...prev, rec.id]);
                                                    } else {
                                                        alert(`🔒 Admin approval required to execute: "${rec.action}"`);
                                                    }
                                                }}
                                            >
                                                {rec.action}
                                            </button>
                                            <button
                                                onClick={() => setDismissed(prev => [...prev, rec.id])}
                                                className="p-2 rounded-xl hover:bg-white/10 text-white/20 hover:text-white/50 transition-all"
                                                title="Dismiss"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
};

export default Recommendations;
