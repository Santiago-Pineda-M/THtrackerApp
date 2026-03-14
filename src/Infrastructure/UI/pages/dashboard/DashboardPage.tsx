import React from 'react';
import { usePlocState } from '../../../Hooks/usePlocState';
import { dependenciesLocator } from '../../../DI/DependenciesLocator';
import { Button, Card } from '../../components/shared';

export const DashboardPage: React.FC = () => {
    const authPloc = dependenciesLocator.provideAuthPloc();
    const authState = usePlocState(authPloc);
    const user = authState.user;

    const handleLogout = () => {
        authPloc.logout();
    };

    return (
        <div className="min-h-screen bg-main">
            {/* Header / Navbar */}
            <nav className="navbar">
                <div className="container flex justify-between">
                    <div className="flex items-center">
                        <span className="text-2xl font-bold text-primary">THtracker</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-right flex-col flex hide-mobile">
                            <span className="text-sm font-medium">
                                {user?.name}
                            </span>
                            <span className="text-xs text-muted">
                                {user?.email}
                            </span>
                        </div>
                        <Button
                            onClick={handleLogout}
                            className="btn-outline"
                        >
                            Cerrar Sesión
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="container py-12">
                <Card className="mb-6">
                    <h1 className="text-3xl font-extrabold mb-6">
                        Bienvenido a tu Dashboard
                    </h1>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Stats Card */}
                        <div className="stats-card bg-blue-light">
                            <h3 className="text-primary text-sm font-bold mb-2">Estado de la cuenta</h3>
                            <p className="text-2xl font-bold">Activa</p>
                        </div>

                        {/* Info Card */}
                        <div className="stats-card bg-green-light">
                            <h3 className="text-success text-sm font-bold mb-2">Perfil completado</h3>
                            <p className="text-2xl font-bold">100%</p>
                        </div>

                        {/* Activity Card */}
                        <div className="stats-card glass">
                            <h3 className="text-muted text-sm font-bold mb-2">Última conexión</h3>
                            <p className="text-2xl font-bold">Hoy</p>
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-muted italic">
                            "Esta es una vista preliminar de tu panel de control."
                        </p>
                    </div>
                </Card>
            </main>
        </div>
    );
};
