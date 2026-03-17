import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { usePlocState } from '../../../Hooks/usePlocState';
import { dependenciesLocator } from '../../../DI/DependenciesLocator';
import { AuthStatus } from '../../../../Domain';
import { Card, Input, Button, Text, type InputElement } from '../../components';

const getDeviceInfo = (): string => {
    return `THtracker-Web-${navigator.userAgent}-${new Date().getFullYear()}`;
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
        <Card w={3} h={4} title="Iniciar Sesión">
                {state.error && (
                    <Text variant="body" className="text-error" style={{ marginBottom: 'var(--space-md)' }}>
                        {state.error}
                    </Text>
                )}
                
                <form onSubmit={handleSubmit}>
                    <div>
                        <Input 
                            label="Correo Electrónico"
                            name="email"
                            type="email" 
                            value={email} 
                            onChange={(e: React.ChangeEvent<InputElement>) => setEmail(e.target.value)} 
                            required 
                            placeholder="tu@correo.com"
                        />
                        <Input 
                            label="Contraseña"
                            name="password"
                            type="password" 
                            value={password} 
                            onChange={(e: React.ChangeEvent<InputElement>) => setPassword(e.target.value)} 
                            required 
                            placeholder="••••••••"
                        />
                    </div>
                    
                    <div>
                        <Button type="submit" variant="primary" disabled={state.status === AuthStatus.LOADING}>
                            {state.status === AuthStatus.LOADING ? 'Cargando...' : 'Iniciar Sesión'}
                        </Button>
                        
                        <div>
                            <Text variant="caption">
                                ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
                            </Text>
                        </div>
                    </div>
                </form>
            </Card>
    );
};

export default LoginPage;