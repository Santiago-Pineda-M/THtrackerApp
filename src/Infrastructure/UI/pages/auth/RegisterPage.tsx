import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { usePlocState } from '../../../Hooks/usePlocState';
import { dependenciesLocator } from '../../../DI/DependenciesLocator';
import { AuthStatus } from '../../../../Domain';
import { Button, Input, Card, Alert } from '../../components/shared';

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
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="max-w-md w-full">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold mb-2">
                        Crea tu cuenta
                    </h2>
                    <p className="text-sm text-muted">
                        O{' '}
                        <Link to="/login" className="link">
                            inicia sesión si ya tienes cuenta
                        </Link>
                    </p>
                </div>

                {(state.error || localError) && (
                    <Alert message={state.error || localError || ''} type="error" />
                )}

                <form className="mt-6" onSubmit={handleSubmit}>
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

                    <div className="mt-8">
                        <Button
                            type="submit"
                            isLoading={state.status === AuthStatus.AUTHENTICATING}
                            className="w-full"
                        >
                            Registrarse
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};
