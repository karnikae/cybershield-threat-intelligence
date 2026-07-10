import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShieldAlert, FileSearch, Activity, BrainCircuit, LogOut, ShieldCheck, MessageSquare, Crown, BarChart3, Bell } from 'lucide-react';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const role = localStorage.getItem('role') || 'user';
    const email = localStorage.getItem('email') || '';
    const isAdmin = role === 'admin';

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('email');
        navigate('/login');
    };

    return (
        <nav className="fixed left-0 top-0 h-full w-20 md:w-64 bg-[#0d0d0f] border-r border-white/[0.06] flex flex-col items-center flex-shrink-0 z-50">
            {/* Logo */}
            <div className="py-8 flex items-center justify-between px-6 w-full border-b border-white/[0.06]">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                        <ShieldAlert className="text-primary w-5 h-5" />
                    </div>
                    <span className="hidden md:inline font-black text-lg tracking-tighter">Cyber<span className="text-primary">Shield</span></span>
                </div>
                <div className="relative group cursor-pointer hidden md:block">
                    <Bell size={18} className="text-white/40 hover:text-white transition-colors" />
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-danger rounded-full border-2 border-[#0d0d0f]" />
                </div>
            </div>

            {/* Nav Items */}
            <div className="flex-1 w-full flex flex-col gap-1 px-3 py-6">
                <p className="hidden md:block text-[9px] font-black uppercase tracking-[0.2em] text-white/20 px-3 mb-3">Navigation</p>

                <NavItem 
                    icon={<LayoutDashboard size={18} />} 
                    label="Command Center" 
                    to={isAdmin ? '/admin' : '/user'} 
                    active={location.pathname === '/' || location.pathname === '/admin' || location.pathname === '/user'} 
                />
                <NavItem icon={<Activity size={18} />} label="Threats" to="/threats" active={location.pathname === '/threats'} />
                <NavItem icon={<BarChart3 size={18} />} label="Insights" to="/insights" active={location.pathname === '/insights'} />
                {isAdmin && <NavItem icon={<FileSearch size={18} />} label="Vulnerabilities" to="/vulnerabilities" active={location.pathname === '/vulnerabilities'} />}
                {isAdmin && <NavItem icon={<BrainCircuit size={18} />} label="Predictions" to="/predictions" active={location.pathname === '/predictions'} />}
                <NavItem icon={<MessageSquare size={18} />} label="AI Analyst" to="/chatbot" active={location.pathname === '/chatbot'} />

                {/* Admin-only section */}
                {isAdmin && (
                    <>
                        <p className="hidden md:block text-[9px] font-black uppercase tracking-[0.2em] text-danger/50 px-3 mt-6 mb-3">Admin Only</p>
                        <NavItem icon={<ShieldCheck size={18} />} label="Recommendations" to="/recommendations" active={location.pathname === '/recommendations'} adminOnly />
                    </>
                )}
            </div>

            {/* Bottom: User Profile + Logout */}
            <div className="w-full px-3 py-6 mt-auto space-y-3 border-t border-white/[0.06]">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-danger/70 hover:text-danger hover:bg-danger/10 border border-transparent hover:border-danger/20 group"
                >
                    <LogOut size={18} className="group-hover:translate-x-1 transition-transform flex-shrink-0" />
                    <span className="hidden md:inline font-bold text-xs tracking-tight">TERMINATE SESSION</span>
                </button>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                    <div className="relative flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-xs font-black">
                            {isAdmin ? <Crown size={14} /> : email.charAt(0).toUpperCase() || 'A'}
                        </div>
                        <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#0d0d0f] ${isAdmin ? 'bg-primary' : 'bg-emerald-500'}`} />
                    </div>
                    <div className="hidden md:block overflow-hidden">
                        <p className="text-xs font-bold truncate">{isAdmin ? 'Administrator' : 'Standard User'}</p>
                        <p className={`text-[9px] font-black uppercase tracking-wider leading-none mt-0.5 ${isAdmin ? 'text-primary' : 'text-emerald-500'}`}>
                            {isAdmin ? '⚡ Full Access' : '🔍 Limited Access'}
                        </p>
                    </div>
                </div>
            </div>
        </nav>
    );
};

const NavItem = ({ icon, label, to, active, adminOnly }) => (
    <Link
        to={to}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 
            ${active
                ? adminOnly
                    ? 'bg-danger/15 text-danger border border-danger/20 shadow-lg shadow-danger/5'
                    : 'bg-primary/15 text-primary border border-primary/20 shadow-lg shadow-primary/5'
                : adminOnly
                    ? 'hover:bg-danger/10 text-danger/50 hover:text-danger border border-transparent'
                    : 'hover:bg-white/[0.05] text-white/50 hover:text-white border border-transparent'
            }`}
    >
        <span className="flex-shrink-0">{icon}</span>
        <span className="hidden md:inline font-semibold text-xs tracking-tight">{label}</span>
    </Link>
);

export default Navbar;
