import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { usePlocState } from '../../../Hooks/usePlocState';
import { dependenciesLocator } from '../../../DI/DependenciesLocator';
import { AuthStatus } from '../../../../Domain';
import { Button, Input, Alert } from '../../components/shared';
import { AuthLayout } from '../../components/layout';

// Utilidad para obtener información del dispositivo
const getDeviceInfo = (): string => {
    const platform = navigator.platform;
    return `THtracker-Web-${platform || 'Unknown'}-${new Date().getFullYear()}`;
};

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const authPloc = dependenciesLocator.provideAuthPloc();
    const state = usePlocState(authPloc);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const deviceInfo = useMemo(() => getDeviceInfo(), []);

    useEffect(() => {
        if (state.status === AuthStatus.AUTHENTICATED) {
            navigate('/dashboard', { replace: true });
        }
    }, [state.status, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await authPloc.login({ email, password, deviceInfo });
    };

    return (
        <AuthLayout 
            title="Bienvenido de nuevo" 
            subtitle="Ingresa a tu cuenta para continuar con el seguimiento"
        >
            {state.error && (
                <div className="mb-6">
                    <Alert message={state.error} type="error" />
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                    label="Correo electrónico"
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="usuario@ejemplo.com"
                />

                <Input
                    label="Contraseña"
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                />

                <Button
                    type="submit"
                    isLoading={state.status === AuthStatus.AUTHENTICATING}
                    className="w-full bg-neon-blue shadow-neon border-none h-12 mt-4"
                >
                    Iniciar Sesión
                </Button>

                <p className="text-center text-sm text-text-muted font-medium mt-6">
                    ¿No tienes una cuenta?{' '}
                    <Link to="/register" className="text-neon-cyan hover:underline">
                        Créala ahora
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
};
