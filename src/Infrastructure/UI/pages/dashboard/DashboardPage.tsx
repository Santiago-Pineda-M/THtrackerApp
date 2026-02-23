/**
 * UI LAYER - Dashboard Pages
 * DashboardPage: Pantalla principal privada tras el login.
 */
import React from 'react';
import { usePlocState } from '../../../Hooks/usePlocState';
import { dependenciesLocator } from '../../../DI/DependenciesLocator';

export const DashboardPage: React.FC = () => {
    const authPloc = dependenciesLocator.provideAuthPloc();
    const authState = usePlocState(authPloc);
    const user = authState.user;

    const handleLogout = () => {
        authPloc.logout();
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header / Navbar */}
            <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">THtracker</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {user?.name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {user?.email}
                                </p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl rounded-2xl border border-gray-100 dark:border-gray-700">
                    <div className="p-8">
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">
                            Bienvenido a tu Dashboard
                        </h1>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Stats Card */}
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800">
                                <h3 className="text-blue-800 dark:text-blue-300 font-semibold mb-2">Estado de la cuenta</h3>
                                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">Activa</p>
                            </div>

                            {/* Info Card */}
                            <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-100 dark:border-green-800">
                                <h3 className="text-green-800 dark:text-green-300 font-semibold mb-2">Perfil completado</h3>
                                <p className="text-2xl font-bold text-green-600 dark:text-green-400">100%</p>
                            </div>

                            {/* Activity Card */}
                            <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl border border-purple-100 dark:border-purple-800">
                                <h3 className="text-purple-800 dark:text-purple-300 font-semibold mb-2">Última conexión</h3>
                                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">Hoy</p>
                            </div>
                        </div>

                        <div className="mt-12 text-center">
                            <p className="text-gray-600 dark:text-gray-400 italic">
                                "Esta es una vista preliminar de tu panel de control."
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
