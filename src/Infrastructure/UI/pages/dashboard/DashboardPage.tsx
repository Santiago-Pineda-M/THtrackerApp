import React from 'react';
import { usePlocState } from '../../../Hooks/usePlocState';
import { dependenciesLocator } from '../../../DI/DependenciesLocator';
import { Button, Card } from '../../components/shared';
import { AppShell } from '../../components/layout';

export const DashboardPage: React.FC = () => {
    const authPloc = dependenciesLocator.provideAuthPloc();
    const authState = usePlocState(authPloc);
    const user = authState.user;

    const handleLogout = () => {
        authPloc.logout();
    };

    return (
        <AppShell>
            {/* Header Card */}
            <Card className="wide flex justify-between items-center p-8 bg-surface-primary/20">
                <div>
                    <h1 className="text-4xl font-extrabold bg-gradient-to-r from-text-primary to-text-secondary bg-clip-text text-transparent">
                        Bienvenido, {user?.name.split(' ')[0]}
                    </h1>
                    <p className="text-text-secondary mt-2 font-medium">Panel de control y estadísticas</p>
                </div>
                <Button onClick={handleLogout} variant="outline" className="border-white/10 hover:bg-white/5">
                    Cerrar Sesión
                </Button>
            </Card>

            {/* Hero / Main Stats */}
            <Card className="large flex flex-col justify-between p-8 bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
                <div>
                    <h3 className="text-neon-blue text-sm font-bold uppercase tracking-widest mb-4">Estado General</h3>
                    <p className="text-5xl font-black mt-2">Activa</p>
                </div>
                <div className="mt-8">
                    <p className="text-text-secondary italic">"Tu cuenta está configurada y lista para operar con el motor de IA."</p>
                </div>
            </Card>

            {/* Profile Completion */}
            <Card className="flex flex-col justify-center items-center text-center p-8">
                <div className="relative w-32 h-32 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                        <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={2 * Math.PI * 58} strokeDashoffset={2 * Math.PI * 58 * 0} className="text-neon-pink shadow-neon" />
                    </svg>
                    <span className="absolute text-2xl font-black">100%</span>
                </div>
                <h3 className="text-text-primary font-bold mt-6">Perfil Completo</h3>
            </Card>

            {/* Last Connection */}
            <Card className="flex flex-col justify-between p-8 border-white/5">
                <h3 className="text-text-secondary text-sm font-bold uppercase tracking-widest">Última Conexión</h3>
                <div>
                    <p className="text-3xl font-black text-neon-purple">Hoy</p>
                    <p className="text-text-secondary text-sm mt-1">Hace 2 horas</p>
                </div>
            </Card>

            {/* Activity Placeholder */}
            <Card className="wide p-8 border-white/5 flex items-center justify-center">
                <p className="text-text-secondary italic font-medium">
                    Próximamente: Visualización de transacciones y análisis de datos en tiempo real.
                </p>
            </Card>
        </AppShell>
    );
};
