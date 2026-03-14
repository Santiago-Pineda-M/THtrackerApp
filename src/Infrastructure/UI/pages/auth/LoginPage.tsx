import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { usePlocState } from '../../../Hooks/usePlocState';
import { dependenciesLocator } from '../../../DI/DependenciesLocator';
import { AuthStatus } from '../../../../Domain';
import { Button, Input, Card, Alert } from '../../components/shared';

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
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="max-w-md w-full">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold mb-2">
                        Bienvenido de nuevo
                    </h2>
                    <p className="text-sm text-muted">
                        O{' '}
                        <Link to="/register" className="link">
                            crea una cuenta nueva
                        </Link>
                    </p>
                </div>

                {state.error && (
                    <Alert message={state.error} type="error" />
                )}

                <form className="mt-6" onSubmit={handleSubmit}>
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

                    <div className="mt-8">
                        <Button
                            type="submit"
                            isLoading={state.status === AuthStatus.AUTHENTICATING}
                            className="w-full"
                        >
                            Iniciar Sesión
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};
