import React, { useState, useEffect, useCallback } from 'react';
import { getThreats, addThreat, deleteThreat } from '../api';
import { Search, Filter, ShieldAlert, Cpu, CheckCircle, PlusCircle, X, AlertCircle, Trash2 } from 'lucide-react';

const ThreatList = () => {
    const [threats, setThreats] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ type: 'DDoS', severity: 'low', source_ip: '' });
    const [notification, setNotification] = useState(null);

    const role = localStorage.getItem('role') || 'user';

    const loadThreats = useCallback(async () => {
        try {
            const res = await getThreats();
            setThreats(res.data);
        } catch {
            console.error('Failed to load threats');
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line
        loadThreats();
    }, [loadThreats]);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this threat log?')) return;
        try {
            await deleteThreat(id);
            setNotification({ type: 'success', message: 'Threat deleted successfully' });
            loadThreats();
            setTimeout(() => setNotification(null), 3000);
        } catch {
            setNotification({ type: 'error', message: 'Failed to delete' });
            setTimeout(() => setNotification(null), 3000);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await addThreat(formData);
            if (res.status === 201) {
                setNotification({ type: 'success', message: 'Threat stored successfully!' });
                if (formData.severity === 'high') {
                    setNotification({ type: 'alert', message: '🚨 High Risk Threat Detected!' });
                }
                setIsModalOpen(false);
                setFormData({ type: 'DDoS', severity: 'low', source_ip: '' });
                const updatedRes = await getThreats();
                setThreats(updatedRes.data);
                
                // Clear notification after 3 seconds
                setTimeout(() => setNotification(null), 3000);
            }
        } catch {
            setNotification({ type: 'error', message: 'Failed to add threat.' });
            setTimeout(() => setNotification(null), 3000);
        }
    };

    const filteredThreats = threats
        .filter(t => 
            t.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.source_ip.includes(searchTerm)
        )
        .slice(0, role === 'admin' ? threats.length : 3);

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Active Threats</h1>
                    <p className="text-white/50 text-sm mt-1">Live feed of all network incursions</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-primary transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Search IP or Type..." 
                            className="bg-card/50 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 w-64 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-primary hover:bg-primary/80 text-white px-5 py-2.5 rounded-2xl flex items-center gap-2 font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
                    >
                        <PlusCircle size={18} />
                        Add Threat
                    </button>
                </div>
            </header>

            {/* Notification Toast/Alert */}
            {notification && (
                <div className={`fixed top-6 right-6 z-50 p-4 rounded-2xl flex items-center gap-3 animate-in slide-in-from-right duration-300 shadow-2xl ${
                    notification.type === 'alert' ? 'bg-danger text-white glow-red' : 
                    notification.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                }`}>
                    {notification.type === 'alert' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
                    <span className="font-bold">{notification.message}</span>
                </div>
            )}

            {/* Add Threat Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div 
                        className="absolute inset-0 bg-black/40 backdrop-blur-md animate-in fade-in duration-300"
                        onClick={() => setIsModalOpen(false)}
                    />
                    <div className="card-gradient rounded-[2.5rem] p-8 w-full max-w-md relative z-10 animate-in zoom-in-95 duration-200 border border-white/10">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-bold">Log New Incursion</h2>
                                <p className="text-white/40 text-sm mt-1">Manual threat entry system</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <X size={20} className="text-white/40" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-white/30 ml-1">Threat Type</label>
                                <select 
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus:outline-none focus:border-primary/50 transition-colors"
                                    value={formData.type}
                                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                                >
                                    <option value="DDoS" className="bg-[#141416]">DDoS</option>
                                    <option value="Phishing" className="bg-[#141416]">Phishing</option>
                                    <option value="Malware" className="bg-[#141416]">Malware</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-white/30 ml-1">Severity Status</label>
                                <select 
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus:outline-none focus:border-primary/50 transition-colors"
                                    value={formData.severity}
                                    onChange={(e) => setFormData({...formData, severity: e.target.value})}
                                >
                                    <option value="low" className="bg-[#141416]">Low</option>
                                    <option value="medium" className="bg-[#141416]">Medium</option>
                                    <option value="high" className="bg-[#141416]">High</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-white/30 ml-1">Source identity (IP)</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. 192.168.1.1" 
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus:outline-none focus:border-primary/50 transition-colors"
                                    required
                                    value={formData.source_ip}
                                    onChange={(e) => setFormData({...formData, source_ip: e.target.value})}
                                />
                            </div>

                            <button 
                                type="submit"
                                className="w-full bg-primary hover:bg-primary/80 text-white py-4 rounded-2xl font-bold transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-primary/20 mt-4"
                            >
                                Dispatch Log Entry
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className="card-gradient rounded-[2rem] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/5">
                                <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-white/40">Incursion Type</th>
                                <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-white/40">Source Identity</th>
                                <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-white/40">Severity Status</th>
                                <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-white/40">Temporal Marker</th>
                                {role === 'admin' && <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-white/40">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredThreats.map((threat) => (
                                <tr key={threat._id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-xl scale-90 group-hover:scale-100 transition-transform ${threat.severity === 'high' ? 'bg-danger/10' : 'bg-primary/10'}`}>
                                                {threat.severity === 'high' ? <ShieldAlert size={18} className="text-danger" /> : <Cpu size={18} className="text-primary" />}
                                            </div>
                                            <span className="font-semibold text-sm">{threat.type}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <code className="text-xs font-mono text-white/60 bg-white/5 px-2 py-1 rounded-md">{threat.source_ip}</code>
                                    </td>
                                    <td className="px-8 py-5">
                                        <SeverityBadge severity={threat.severity} />
                                    </td>
                                    <td className="px-8 py-5 text-sm text-white/40 font-medium">
                                        {new Date(threat.timestamp).toLocaleString()}
                                    </td>
                                    {role === 'admin' && (
                                        <td className="px-8 py-5">
                                            <button 
                                                onClick={() => handleDelete(threat._id)}
                                                className="p-2 hover:bg-danger/20 rounded-xl text-danger/40 hover:text-danger transition-all"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                            {filteredThreats.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-8 py-20 text-center text-white/20">
                                        <div className="flex flex-col items-center gap-3">
                                            <CheckCircle size={48} className="text-white/5" />
                                            <p className="text-lg font-medium">No threats detected in perimeter</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const SeverityBadge = ({ severity }) => {
    const config = {
        high: 'bg-danger/10 text-danger border-danger/20',
        medium: 'bg-accent/10 text-accent border-accent/20',
        low: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
    };
    return (
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm ${config[severity]}`}>
            {severity}
        </span>
    );
};

export default ThreatList;
