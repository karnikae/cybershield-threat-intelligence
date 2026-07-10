import React, { useState, useEffect } from 'react';
import { getPredictions } from '../api';
import { BrainCircuit, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';

const Predictions = () => {
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPredictions = async () => {
            try {
                const res = await getPredictions();
                setPredictions(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPredictions();
    }, []);

    return (
        <div className="space-y-8 animate-in zoom-in duration-500">
            <header>
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-2xl bg-accent/20 border border-accent/20 text-accent">
                        <BrainCircuit size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Predictive Analytics</h1>
                        <p className="text-white/50 text-sm mt-1">Rule-based threat forecasting and behavioral analysis</p>
                    </div>
                </div>
            </header>

            {loading ? (
                <div className="flex items-center justify-center py-20 text-white/50 animate-pulse">
                    <Zap className="animate-bounce" /> Analyzing patterns...
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {predictions.map((p, i) => (
                        <div key={i} className={`p-8 rounded-[2.5rem] card-gradient border-l-4 ${p.level === 'Critical' ? 'border-l-danger bg-danger/5' : 'border-l-primary bg-primary/5 shadow-primary/10 shadow-2xl'} hover:scale-[1.03] transition-all duration-300`}>
                            <div className="flex items-start justify-between mb-6">
                                <div className={`p-4 rounded-3xl ${p.level === 'Critical' ? 'bg-danger/20 text-danger' : 'bg-primary/20 text-primary'}`}>
                                    {p.level === 'Critical' ? <AlertTriangle size={24} /> : <Zap size={24} />}
                                </div>
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${p.level === 'Critical' ? 'bg-danger/20 text-danger' : 'bg-primary/20 text-primary'}`}>
                                    {p.level} RISK
                                </span>
                            </div>
                            <h3 className="text-xl font-bold mb-3">{p.type || 'Behavioral Alert'}</h3>
                            <p className="text-sm text-white/60 leading-relaxed mb-6">
                                {p.reason}
                            </p>
                            {p.target && (
                                <div className="flex flex-col gap-2 p-4 rounded-2xl bg-white/5 border border-white/5 font-mono text-[11px] text-white/40">
                                    <span className="uppercase font-bold text-[10px] tracking-widest">Identified Vector</span>
                                    <span className="text-white/80">{p.target}</span>
                                </div>
                            )}
                        </div>
                    ))}
                    {predictions.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center gap-6 p-20 border-2 border-dashed border-white/5 rounded-[3rem]">
                            <ShieldCheck size={64} className="text-emerald-500/20" />
                            <div className="text-center">
                                <p className="text-xl font-semibold text-white/90">System Perimeter Secure</p>
                                <p className="text-sm text-white/40 mt-2">Historical patterns show no immediate behavioral anomalies.</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Predictions;
