import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { usePlocState } from '../../../Hooks/usePlocState';
import { dependenciesLocator } from '../../../DI/DependenciesLocator';
import { AuthStatus } from '../../../../Domain';
import { Card, Input, Button, Text, type InputElement } from '../../components';

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
        await authPloc.register({ name, email, password });
    };

    const displayError = state.error || localError;

    return (
        <Card w={3} h={5} title="Crear Cuenta">
                {displayError && (
                    <Text variant="body" className="text-error" style={{ marginBottom: 'var(--space-md)' }}>
                        {displayError}
                    </Text>
                )}

                <form onSubmit={handleSubmit}>
                    <div>
                        <Input 
                            label="Nombre Completo"
                            name="name"
                            type="text" 
                            value={name} 
                            onChange={(e: React.ChangeEvent<InputElement>) => setName(e.target.value)} 
                            required 
                            placeholder="Juan Pérez"
                        />
                        <Input 
                            label="Correo Electrónico"
                            name="email"
                            type="email" 
                            value={email} 
                            onChange={(e: React.ChangeEvent<InputElement>) => setEmail(e.target.value)} 
                            required 
                            placeholder="juan@ejemplo.com"
                        />
                        <Input 
                            label="Contraseña"
                            name="password"
                            type="password" 
                            value={password} 
                            onChange={(e: React.ChangeEvent<InputElement>) => setPassword(e.target.value)} 
                            required 
                            placeholder="Mínimo 8 caracteres"
                        />
                        <Input 
                            label="Confirmar Contraseña"
                            name="confirmPassword"
                            type="password" 
                            value={confirmPassword} 
                            onChange={(e: React.ChangeEvent<InputElement>) => setConfirmPassword(e.target.value)} 
                            required 
                            placeholder="Repite tu contraseña"
                        />
                    </div>

                    <div>
                        <Button type="submit" variant="primary" disabled={state.status === AuthStatus.LOADING}>
                            {state.status === AuthStatus.LOADING ? 'Registrando...' : 'Registrarse'}
                        </Button>
                        
                        <div>
                            <Text variant="caption">
                                ¿Ya tienes cuenta? <Link to="/login">Inicia Sesión</Link>
                            </Text>
                        </div>
                    </div>
                </form>
            </Card>
    );
};

export default RegisterPage;
