import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Activity, ShieldCheck, AlertTriangle, Cpu, TrendingUp, Globe, AlertCircle, Volume2 } from 'lucide-react';
import { getThreats, getRiskScore, deleteThreat } from '../api';
import ThreatMap from '../components/ThreatMap';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ total: 0, high: 0, medium: 0, low: 0 });
    const [chartData, setChartData] = useState([]);
    const [threats, setThreats] = useState([]);
    const [risk, setRisk] = useState({ score: 0, level: 'Low', message: 'Analyzing' });
    const [alert, setAlert] = useState(null);

    const fetchData = async () => {
        try {
            const res = await getThreats();
            const data = res.data;
            setThreats(data);

            const riskRes = await getRiskScore();
            setRisk(riskRes.data);

            // Check for high risk alert
            const latestHigh = data.find(t => t.severity === 'high' && t.status === 'active');
            if (latestHigh && (new Date() - new Date(latestHigh.timestamp)) < 10000) {
                setAlert(`🚨 High Risk Threat Detected: ${latestHigh.type} from ${latestHigh.source_ip}`);
                const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-security-facility-breach-alarm-994.mp3');
                audio.play().catch(() => console.log("Audio interact blocked"));
            }

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
                threats: Math.floor(Math.random() * 50) + 10,
                blocked: Math.floor(Math.random() * 40) + 20
            })));

        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 10000); // Pulse every 10s
        return () => clearInterval(interval);
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Erase this threat signature permanently?')) return;
        try {
            await deleteThreat(id);
            fetchData();
        } catch (err) { alert('Terminal command failed: ' + err.message); }
    };

    const handleResolve = async (id) => {
        try {
            const api = (await import('../api')).default;
            await api.put(`/threats/${id}/resolve`);
            fetchData();
        } catch (err) { alert('Resolution failed: ' + err.message); }
    };

    const handleBlockIP = async (ip) => {
        try {
            const api = (await import('../api')).default;
            await api.post('/threats/block-ip', { ip });
            window.alert(`FIREWALL: ${ip} has been blacklisted.`);
            fetchData();
        } catch { alert('Block command failed'); }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700 relative">
            {/* Global Alert Popup */}
            {alert && (
                <div className="fixed top-8 right-8 z-[2000] p-6 rounded-3xl bg-danger text-white shadow-2xl shadow-danger/40 flex items-center gap-4 animate-in slide-in-from-right-10">
                    <div className="p-3 rounded-2xl bg-white/20">
                        <AlertTriangle size={24} className="animate-pulse" />
                    </div>
                    <div>
                        <p className="font-black text-sm uppercase tracking-tight">CRITICAL_ALERT</p>
                        <p className="text-xs font-bold text-white/80">{alert}</p>
                    </div>
                    <button onClick={() => setAlert(null)} className="ml-4 p-2 hover:bg-white/10 rounded-xl transition-colors">✕</button>
                </div>
            )}

            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter text-white/90">ADMIN <span className="text-primary font-light uppercase">Control Panel</span></h1>
                    <p className="text-white/40 text-sm mt-1 uppercase tracking-[0.3em] font-bold italic">Priority Authorization Zone</p>
                </div>
                
                {/* Risk Meter */}
                <div className="flex flex-col gap-2 min-w-[300px] p-5 rounded-3xl card-gradient border border-white/5 shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    <div className="flex justify-between items-end mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">AI Risk Factor</span>
                        <span className={`text-xs font-black uppercase ${risk.level === 'High' ? 'text-danger' : risk.level === 'Medium' ? 'text-accent' : 'text-emerald-500'}`}>
                            {risk.level} CRITICALITY
                        </span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden mb-2">
                        <div 
                            className={`h-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(255,255,255,0.1)] ${risk.level === 'High' ? 'bg-danger shadow-danger/50' : risk.level === 'Medium' ? 'bg-accent shadow-accent/50' : 'bg-emerald-500 shadow-emerald-500/50'}`} 
                            style={{ width: `${risk.score}%` }} 
                        />
                    </div>
                    <p className="text-[11px] text-white/60 font-medium italic">"{risk.message}"</p>
                </div>

                <div className="px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black tracking-widest flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
                    SYSTEM LIVE • GEN-4 ALPHA
                </div>
            </header>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={<TrendingUp size={24} className="text-primary" />} label="Total Threats" value={stats.total} color="primary" />
                <StatCard icon={<AlertTriangle size={24} className="text-danger" />} label="High Risk" value={stats.high} color="danger" />
                <StatCard icon={<Cpu size={24} className="text-accent" />} label="Med Risk" value={stats.medium} color="accent" />
                <StatCard icon={<ShieldCheck size={24} className="text-emerald-500" />} label="Low Risk" value={stats.low} color="secondary" />
            </div>

            {/* Maps and Content */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                {/* Left Panel: Map */}
                <div className="xl:col-span-3 p-1 rounded-[2.5rem] card-gradient overflow-hidden min-h-[500px] border border-white/5 group relative">
                    <div className="absolute top-8 left-8 z-[1000] p-4 rounded-2xl bg-[#0a0a0b]/80 backdrop-blur-xl border border-white/10 shadow-2xl">
                        <div className="flex items-center gap-3">
                            <Globe className="text-primary animate-spin-slow" />
                            <div>
                                <h2 className="text-lg font-black tracking-tight">GeoIncursion Map</h2>
                                <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest leading-none">Global Attack Visualizer</p>
                            </div>
                        </div>
                    </div>
                    <ThreatMap threats={threats} />
                </div>

                {/* Right Panel: Alerts & Distribution */}
                <div className="flex flex-col gap-8">
                    {/* Critical Alerts Panel */}
                    <div className="p-8 rounded-[2.5rem] card-gradient border-l-4 border-l-danger flex-1 flex flex-col bg-danger/5">
                        <div className="flex items-center gap-3 mb-6">
                            <AlertCircle className="text-danger animate-pulse" />
                            <h2 className="text-lg font-bold uppercase tracking-tight">Priority Incursions</h2>
                        </div>
                        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {threats.filter(t => t.severity === 'high' && t.status !== 'resolved').slice(0, 5).map((t, i) => (
                                <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/[0.08] transition-colors group">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-bold text-danger group-hover:translate-x-1 transition-transform inline-block underline underline-offset-4 decoration-danger/30">{t.type}</span>
                                        <span className="text-[9px] font-mono opacity-40">{new Date(t.timestamp).toLocaleTimeString()}</span>
                                    </div>
                                    <code className="text-[10px] text-white/60 font-mono block truncate">{t.source_ip}</code>
                                </div>
                            ))}
                            {threats.filter(t => t.severity === 'high' && t.status !== 'resolved').length === 0 && (
                                <p className="text-xs text-white/30 italic text-center py-10">No critical incursions active.</p>
                            )}
                        </div>
                    </div>

                    <div className="p-8 rounded-[2.5rem] card-gradient">
                        <h2 className="text-lg font-bold mb-6 uppercase tracking-tight">Severity Matrix</h2>
                        <div className="space-y-6">
                            <SeverityItem label="High" value={stats.high} color="bg-danger" total={stats.total} />
                            <SeverityItem label="Medium" value={stats.medium} color="bg-accent" total={stats.total} />
                            <SeverityItem label="Low" value={stats.low} color="bg-emerald-500" total={stats.total} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Admin Controls Section */}
            <div className="p-10 rounded-[3rem] card-gradient border border-white/5">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-black tracking-tight uppercase">Threat Management</h2>
                        <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">Active Protocol Mitigation</p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] uppercase font-black tracking-widest text-white/30 border-b border-white/5">
                                <th className="pb-4 px-4 font-black">Timestamp</th>
                                <th className="pb-4 px-4 font-black">Threat Vector</th>
                                <th className="pb-4 px-4 font-black">Source IP</th>
                                <th className="pb-4 px-4 font-black">Criticality</th>
                                <th className="pb-4 px-4 font-black">Status</th>
                                <th className="pb-4 px-4 text-right font-black">Mitigation Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {threats.slice(0, 8).map((t) => (
                                <tr key={t._id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="py-4 px-4 text-xs font-mono text-white/40">{new Date(t.timestamp).toLocaleString()}</td>
                                    <td className="py-4 px-4 font-black text-sm">{t.type}</td>
                                    <td className="py-4 px-4 text-xs font-mono">{t.source_ip}</td>
                                    <td className="py-4 px-4 font-black">
                                        <span className={`px-3 py-1 rounded-full text-[9px] uppercase tracking-widest ${t.severity === 'high' ? 'bg-danger/20 text-danger border border-danger/20' : t.severity === 'medium' ? 'bg-accent/20 text-accent border border-accent/20' : 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/20'}`}>
                                            {t.severity}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 font-black">
                                        <span className={`text-[10px] uppercase tracking-widest flex items-center gap-2 ${t.status === 'resolved' ? 'text-emerald-500' : 'text-primary'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${t.status === 'resolved' ? 'bg-emerald-500 shadow-[0_0_8px_theme(colors.emerald.500)]' : 'bg-primary shadow-[0_0_8px_theme(colors.primary)] animate-pulse'}`} />
                                            {t.status || 'active'}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-right flex items-center justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                        {t.status !== 'resolved' && (
                                            <button onClick={() => handleResolve(t._id)} className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest px-3">Resolve</button>
                                        )}
                                        <button onClick={() => handleBlockIP(t.source_ip)} className="p-2 rounded-xl bg-accent/10 text-accent border border-accent/20 hover:bg-accent hover:text-white transition-all text-[10px] font-black uppercase tracking-widest px-3">Block IP</button>
                                        <button onClick={() => handleDelete(t._id)} className="p-2 rounded-xl bg-danger/10 text-danger border border-danger/20 hover:bg-danger hover:text-white transition-all text-[10px] font-black uppercase tracking-widest px-3">Erase</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Trends Chart */}
            <div className="p-10 rounded-[3rem] card-gradient border border-white/5 shadow-inner">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h2 className="text-2xl font-black tracking-tight tracking-tight uppercase">Vector Velocity <span className="text-white/20">/ 7D</span></h2>
                        <p className="text-xs text-white/40 mt-1 uppercase font-bold tracking-widest italic leading-none">Intelligence Predictive Index</p>
                    </div>
                </div>
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                            <XAxis 
                                dataKey="name" 
                                stroke="rgba(255,255,255,0.2)" 
                                fontSize={10} 
                                tickLine={false} 
                                axisLine={false}
                                tick={{ fill: 'rgba(255,255,255,0.4)', fontWeight: 'bold' }}
                            />
                            <YAxis 
                                stroke="rgba(255,255,255,0.2)" 
                                fontSize={10} 
                                tickLine={false} 
                                axisLine={false}
                                tick={{ fill: 'rgba(255,255,255,0.4)', fontWeight: 'bold' }}
                            />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#0a0a0b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '15px' }} 
                                itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                            />
                            <Area type="monotone" dataKey="threats" stroke="#3b82f6" fillOpacity={1} fill="url(#colorThreats)" strokeWidth={4} animationDuration={2000} />
                            <Area type="monotone" dataKey="blocked" stroke="#8b5cf6" fillOpacity={0} strokeWidth={2} strokeDasharray="8 8" animationDuration={2500} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value, color }) => (
  <div className="p-6 rounded-3xl card-gradient flex items-center justify-between hover:scale-[1.02] transition-transform duration-300">
    <div className="space-y-1">
      <p className="text-white/40 text-sm font-medium">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
    <div className={`p-4 rounded-2xl bg-${color}/10 border border-${color}/10`}>
      {icon}
    </div>
  </div>
);

const SeverityItem = ({ label, value, color, total }) => {
    const percentage = total > 0 ? (value / total) * 100 : 0;
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-end">
                <span className="text-sm font-medium text-white/70">{label}</span>
                <span className="text-xs font-bold">{value} DETECTIONS</span>
            </div>
            <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                <div className={`h-full ${color} transition-all duration-1000`} style={{ width: `${percentage}%` }} />
            </div>
        </div>
    );
};

export default AdminDashboard;
