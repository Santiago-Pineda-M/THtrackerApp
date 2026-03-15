import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { usePlocState } from '../../../Hooks/usePlocState';
import { dependenciesLocator } from '../../../DI/DependenciesLocator';
import { AuthStatus } from '../../../../Domain';
import { Button, Input, Alert } from '../../components/shared';
import { AuthLayout } from '../../components/layout';

export const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const authPloc = dependenciesLocator.provideAuthPloc();
    const state = usePlocState(authPloc);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [localError, setLocalError] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (state.status === AuthStatus.AUTHENTICATED) {
            navigate('/dashboard', { replace: true });
        }
    }, [state.status, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError(undefined);

        if (password !== confirmPassword) {
            setLocalError('Las contraseñas no coinciden');
            return;
        }

        await authPloc.register({
            name,
            email,
            password
        });
    };

    return (
        <AuthLayout 
            title="Crea tu cuenta" 
            subtitle="Únete a la nueva generación de seguimiento inteligente"
        >
            {(state.error || localError) && (
                <div className="mb-6">
                    <Alert message={state.error || localError || ''} type="error" />
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                    label="Nombre Completo"
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tu Nombre Completo"
                />

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
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                />

                <Input
                    label="Confirmar Contraseña"
                    id="confirm-password"
                    name="confirmPassword"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                />

                <Button
                    type="submit"
                    isLoading={state.status === AuthStatus.AUTHENTICATING}
                    className="w-full bg-neon-blue shadow-neon border-none h-12 mt-4"
                >
                    Registrarse
                </Button>

                <p className="text-center text-sm text-text-muted font-medium mt-6">
                    ¿Ya tienes una cuenta?{' '}
                    <Link to="/login" className="text-neon-cyan hover:underline">
                        Inicia sesión
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
};
