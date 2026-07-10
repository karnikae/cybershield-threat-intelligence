import React, { useState, useEffect } from 'react';
import { getThreats, getRiskScore } from '../api';
import { ShieldAlert, AlertTriangle, Info, ArrowUpRight, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Insights = () => {
    const [stats, setStats] = useState({ total: 0, high: 0 });
    const [risk, setRisk] = useState({ score: 0, level: 'Low', message: 'Analyzing...' });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [threatsRes, riskRes] = await Promise.all([getThreats(), getRiskScore()]);
                const highCount = threatsRes.data.filter(t => t.severity === 'high').length;
                setStats({ total: threatsRes.data.length, high: highCount });
                setRisk(riskRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return (
        <div className="h-full flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700">
            <header>
                <h1 className="text-4xl font-black tracking-tight uppercase">Intelligence <span className="text-primary">Insights</span></h1>
                <p className="text-white/40 text-sm mt-1 uppercase tracking-widest font-bold font-mono">Deep Threat Analysis • V4.0</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Risk Overview */}
                <div className="md:col-span-2 p-8 rounded-[2.5rem] card-gradient border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform duration-700">
                        <ShieldAlert size={120} />
                    </div>
                    <h2 className="text-xl font-bold mb-8 flex items-center gap-3">
                        <Info className="text-primary" />
                        System Integrity Status
                    </h2>
                    
                    <div className="space-y-8">
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-end">
                                <span className="text-sm font-bold text-white/40 uppercase tracking-widest">Global Risk Factor</span>
                                <span className={`text-2xl font-black ${risk.level === 'High' ? 'text-danger' : risk.level === 'Medium' ? 'text-accent' : 'text-emerald-500'}`}>
                                    {risk.score}%
                                </span>
                            </div>
                            <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                <div 
                                    className={`h-full transition-all duration-1000 ease-out ${risk.level === 'High' ? 'bg-danger' : risk.level === 'Medium' ? 'bg-accent' : 'bg-emerald-500'}`}
                                    style={{ width: `${risk.score}%` }}
                                />
                            </div>
                            <p className="text-sm text-white/60 italic mt-2">"{risk.message}"</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
                                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">Total Logs</p>
                                <p className="text-3xl font-black">{stats.total}</p>
                            </div>
                            <div className="p-6 rounded-3xl bg-danger/5 border border-danger/10">
                                <p className="text-[10px] font-black text-danger/50 uppercase tracking-[0.2em] mb-1">High Severity</p>
                                <p className="text-3xl font-black text-danger">{stats.high}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-col gap-6">
                    <div className="p-8 rounded-[2.5rem] card-gradient border border-white/5 flex-1 bg-primary/5">
                        <h3 className="text-lg font-bold mb-4">Analyst Guidance</h3>
                        <p className="text-sm text-white/50 leading-relaxed mb-8">
                            Based on current patterns, the system recommends {risk.level === 'High' ? 'immediate firewall lockdown and IP blacklisting' : 'routine system audits and log verification'}.
                        </p>
                        <button 
                            onClick={() => navigate('/chatbot')}
                            className="w-full py-4 rounded-2xl bg-primary text-white font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                        >
                            <MessageCircle size={18} />
                            CONSULT AI ANALYST
                        </button>
                    </div>

                    <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 flex flex-col items-center justify-center text-center gap-4 group cursor-pointer hover:bg-white/10 transition-all">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:text-primary transition-colors">
                            <ArrowUpRight />
                        </div>
                        <div>
                            <p className="text-sm font-bold">Report Anomaly</p>
                            <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">Direct to Admin</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Insight Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <InsightCard 
                    title="Traffic Anomalies" 
                    desc="Detection of non-standard protocol usage on egress ports."
                    status={risk.score > 50 ? 'Critical' : 'Stable'}
                />
                <InsightCard 
                    title="Credential Spraying" 
                    desc="Monitoring failed login attempts across auth endpoints."
                    status="Active"
                />
                <InsightCard 
                    title="Geographic Shifts" 
                    desc="Analyzing origin IP distribution for botnet signatures."
                    status="Safe"
                />
            </div>
        </div>
    );
};

const InsightCard = ({ title, desc, status }) => (
    <div className="p-8 rounded-[2rem] card-gradient border border-white/5 hover:border-primary/30 transition-all">
        <div className="flex justify-between items-start mb-4">
            <h4 className="font-bold text-white/80">{title}</h4>
            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${status === 'Critical' ? 'bg-danger/10 text-danger border border-danger/20' : 'bg-primary/10 text-primary border border-primary/20'}`}>
                {status}
            </span>
        </div>
        <p className="text-xs text-white/40 leading-relaxed italic">
            {desc}
        </p>
    </div>
);

export default Insights;
