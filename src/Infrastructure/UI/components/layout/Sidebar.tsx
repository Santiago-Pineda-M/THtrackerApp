import { Link, useLocation } from 'react-router-dom';
import { Card } from '../shared';

interface SidebarItemProps {
    to: string;
    label: string;
    icon: React.ReactNode;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, label, icon }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link 
            to={to} 
            className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 group
                ${isActive 
                    ? 'bg-primary-light border-primary/20 shadow-neon' 
                    : 'hover:bg-white/5 border-transparent'
                } border`}
        >
            <div className={`transition-colors duration-300 ${isActive ? 'text-neon-blue' : 'text-text-secondary group-hover:text-text-primary'}`}>
                {icon}
            </div>
            <span className={`font-medium transition-colors duration-300 ${isActive ? 'text-text-primary' : 'text-text-secondary group-hover:text-text-primary'}`}>
                {label}
            </span>
            {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-neon-blue shadow-neon" />}
        </Link>
    );
};

export const Sidebar: React.FC = () => {
    return (
        <Card className="vertical flex flex-col p-6 h-full border-white/5">
            <div className="mb-12 px-4">
                <span className="text-2xl font-black bg-gradient-to-r from-neon-purple to-neon-blue bg-clip-text text-transparent">
                    THtracker
                </span>
            </div>

            <nav className="flex flex-col gap-3">
                <SidebarItem 
                    to="/dashboard" 
                    label="Dashboard" 
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>} 
                />
                <SidebarItem 
                    to="/profile" 
                    label="Mi Perfil" 
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>} 
                />
            </nav>

            <div className="mt-auto pt-8 border-t border-white/5">
                <div className="p-4 rounded-xl bg-primary-light border border-primary/10">
                    <p className="text-xs text-text-secondary mb-1 uppercase tracking-widest font-black">Account</p>
                    <p className="text-sm font-bold text-neon-pink">Premium AI</p>
                </div>
            </div>
        </Card>
    );
};
