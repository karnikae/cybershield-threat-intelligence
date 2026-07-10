import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ShieldCheck, AlertTriangle, TrendingUp, Globe, Plus, Clock, Target } from 'lucide-react';
import { getThreats, addThreat } from '../api';

const UserDashboard = () => {
    const [stats, setStats] = useState({ total: 0, high: 0, medium: 0, low: 0 });
    const [chartData, setChartData] = useState([]);
    const [threats, setThreats] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newThreat, setNewThreat] = useState({ type: 'DDoS', severity: 'medium', source_ip: '' });
    const userEmail = localStorage.getItem('email');

    const fetchData = async () => {
        try {
            const res = await getThreats();
            const data = res.data;
            setThreats(data);
            
            const statsMap = data.reduce((acc, curr) => {
                acc[curr.severity] = (acc[curr.severity] || 0) + 1;
                return acc;
            }, {});
            
            setStats({
                total: data.length,
                high: statsMap.high || 0,
                medium: statsMap.medium || 0,
                low: statsMap.low || 0
            });

            const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            setChartData(days.map(day => ({
                name: day,
                threats: Math.floor(Math.random() * 30) + 5,
                blocked: Math.floor(Math.random() * 20) + 10
            })));
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const run = async () => {
            try {
                const res = await getThreats();
                const data = res.data;
                setThreats(data);

                const statsMap = data.reduce((acc, curr) => {
                    acc[curr.severity] = (acc[curr.severity] || 0) + 1;
                    return acc;
                }, {});
                setStats({
                    total: data.length,
                    high: statsMap.high || 0,
                    medium: statsMap.medium || 0,
                    low: statsMap.low || 0
                });
                const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                setChartData(days.map(day => ({
                    name: day,
                    threats: Math.floor(Math.random() * 30) + 5,
                    blocked: Math.floor(Math.random() * 20) + 10
                })));
            } catch {
                console.error('Failed to load threats');
            }
        };
        run();
        const interval = setInterval(run, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addThreat(newThreat);
            setShowModal(false);
            setNewThreat({ type: 'DDoS', severity: 'medium', source_ip: '' });
            fetchData();
        } catch {
            alert('Failed to report threat');
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-white/90 uppercase">User <span className="text-primary font-light">Monitoring Panel</span></h1>
                    <p className="text-white/40 text-xs mt-1 uppercase tracking-[0.2em] font-bold italic">Standard Monitoring Access • {userEmail}</p>
                </div>
                <button 
                    onClick={() => setShowModal(true)}
                    className="px-6 py-3 rounded-2xl bg-primary text-white font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:scale-[1.02]"
                >
                    <Plus size={18} />
                    REPORT THREAT
                </button>
            </header>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard icon={<TrendingUp size={24} className="text-primary" />} label="Network Incursions" value={stats.total} color="primary" />
                <StatCard icon={<AlertTriangle size={24} className="text-danger" />} label="Critical Events" value={stats.high} color="danger" />
                <StatCard icon={<ShieldCheck size={24} className="text-emerald-500" />} label="Verified Safe" value={stats.low} color="secondary" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Trends Chart */}
                <div className="lg:col-span-2 p-8 rounded-[2.5rem] card-gradient border border-white/5 flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold uppercase tracking-tight">Network Integrity <span className="text-white/20">/ Local</span></h2>
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Live Flux
                        </div>
                    </div>
                    <div className="h-[300px] w-full mt-auto">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorUserThreats" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={10} axisLine={false} tickLine={false} />
                                <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: '#0a0a0b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }} />
                                <Area type="monotone" dataKey="threats" stroke="#3b82f6" fill="url(#colorUserThreats)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Side: My Threats */}
                <div className="p-8 rounded-[2.5rem] card-gradient border border-white/5">
                    <div className="flex items-center gap-3 mb-6">
                        <Clock className="text-primary" />
                        <h2 className="text-lg font-bold uppercase tracking-tight">My Recent Reports</h2>
                    </div>
                    <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                        {threats.slice(0, 5).map((t, i) => (
                            <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/[0.1] transition-all">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-[10px] font-black text-primary uppercase italic">{t.type}</span>
                                    <span className={`w-2 h-2 rounded-full ${t.severity === 'high' ? 'bg-danger' : 'bg-primary'}`} />
                                </div>
                                <p className="text-xs font-mono text-white/60 mb-2">{t.source_ip}</p>
                                <div className="flex justify-between items-center text-[9px] font-bold text-white/30 uppercase">
                                    <span>{new Date(t.timestamp).toLocaleDateString()}</span>
                                    <span className={t.status === 'resolved' ? 'text-emerald-500' : ''}>{t.status || 'Active'}</span>
                                </div>
                            </div>
                        ))}
                        {threats.length === 0 && (
                            <div className="py-20 text-center space-y-4">
                                <Target className="mx-auto text-white/10" size={40} />
                                <p className="text-xs text-white/20 italic font-medium uppercase tracking-widest">No threats detected yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-background/80 backdrop-blur-xl animate-in fade-in duration-300">
                    <div className="w-full max-w-lg p-10 rounded-[3rem] card-gradient border border-white/10 shadow-2xl space-y-8">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-black tracking-tight uppercase">Initiate Threat Report</h2>
                            <p className="text-xs text-white/40 font-bold uppercase tracking-widest">Global Protocol Breach Log</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4">Incursion Vector Type</label>
                                <select 
                                    value={newThreat.type}
                                    onChange={(e) => setNewThreat({...newThreat, type: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                                >
                                    <option value="DDoS" className="bg-[#0a0a0b]">Distributed Denial of Service (DDoS)</option>
                                    <option value="SQL Injection" className="bg-[#0a0a0b]">SQL Injection (SQLi)</option>
                                    <option value="Phishing" className="bg-[#0a0a0b]">Phishing Attack</option>
                                    <option value="Malware" className="bg-[#0a0a0b]">Malware Infiltration</option>
                                    <option value="Brute Force" className="bg-[#0a0a0b]">Brute Force Auth</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4">Source Origin IP</label>
                                <input 
                                    type="text" 
                                    required
                                    placeholder="192.168.1.1"
                                    value={newThreat.source_ip}
                                    onChange={(e) => setNewThreat({...newThreat, source_ip: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4">Estimated Criticality</label>
                                <div className="grid grid-cols-3 gap-4">
                                    {['low', 'medium', 'high'].map((sev) => (
                                        <button
                                            key={sev}
                                            type="button"
                                            onClick={() => setNewThreat({...newThreat, severity: sev})}
                                            className={`py-3 rounded-xl border font-black text-[10px] uppercase tracking-widest transition-all ${newThreat.severity === sev ? 'bg-primary/20 border-primary text-primary shadow-lg shadow-primary/10' : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10'}`}
                                        >
                                            {sev}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button 
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-4 font-bold text-white/40 hover:text-white transition-colors"
                                >
                                    ABORT
                                </button>
                                <button 
                                    type="submit"
                                    className="flex-1 py-4 rounded-2xl bg-primary text-white font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                                >
                                    TRANSMIT LOG
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const StatCard = ({ icon, label, value, color }) => (
  <div className="p-6 rounded-[2rem] card-gradient flex items-center justify-between border border-white/5">
    <div>
      <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-1">{label}</p>
      <p className="text-3xl font-black">{value}</p>
    </div>
    <div className={`p-3 rounded-2xl bg-${color}/10 border border-${color}/20 text-${color}`}>
      {icon}
    </div>
  </div>
);

export default UserDashboard;
