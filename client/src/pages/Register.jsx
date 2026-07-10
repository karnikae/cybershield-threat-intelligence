import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api';
import { ShieldAlert, Mail, Lock, UserPlus } from 'lucide-react';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('[AUTH] Registering user with:', { email });
        try {
            const res = await register({ email, password, role });
            console.log('[AUTH] Registration success:', res.data);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.role);
            setSuccess(`Success! ${res.data.role} account created. Redirecting...`);
            setTimeout(() => {
                if (res.data.role === 'admin') navigate('/admin');
                else navigate('/user');
            }, 1500);
        } catch (err) {
            console.error('[AUTH ERROR] Registration failed:', err.response?.data);
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 animate-in fade-in duration-500">
            <div className="w-full max-w-md p-8 rounded-[2rem] card-gradient border border-white/5 shadow-2xl">
                <div className="flex flex-col items-center gap-4 mb-8">
                    <div className="p-4 rounded-3xl bg-primary/10 border border-primary/20 text-primary">
                        <UserPlus size={40} />
                    </div>
                    <div className="text-center">
                        <h1 className="text-3xl font-bold tracking-tight">Security Onboarding</h1>
                        <p className="text-white/40 text-sm mt-1 uppercase tracking-widest font-semibold">Generate Analyst Identity</p>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-2xl bg-danger/10 border border-danger/20 text-danger text-sm text-center">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm text-center">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-white/40 uppercase ml-4">Credential Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                            <input 
                                type="email" 
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
                                placeholder="analyst@cybershield.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-white/40 uppercase ml-4">Access Secret</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                            <input 
                                type="password" 
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {/* Role Selector */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-white/40 uppercase ml-4">Access Level</label>
                        <div className="grid grid-cols-2 gap-3">
    {['user', 'admin'].map(r => (
        <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={`py-3 px-4 rounded-2xl border text-sm font-bold uppercase tracking-wider transition-all ${
                role === r
                    ? r === 'admin'
                        ? 'bg-primary/20 border-primary/40 text-primary'
                        : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                    : 'bg-white/5 border-white/10 text-white/30 hover:text-white hover:bg-white/10'
            }`}
        >
            {r === 'admin' ? '⚡ Admin' : '🔍 User'}
        </button>
    ))}
                        </div>
                        <p className="text-[10px] text-white/20 ml-4">
                            {role === 'admin' ? 'Full access: threats, map, recommendations, chatbot' : 'Read-only access to threat monitoring'}
                        </p>
                    </div>

                    <button 
                        type="submit" 
                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                    >
                        <ShieldAlert size={20} />
                        AUTHORIZE ACCOUNT
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-white/40 text-sm">
                        Existing Identity? <Link to="/login" className="text-primary font-bold hover:underline">Authenticate Session</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
