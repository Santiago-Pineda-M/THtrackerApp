import React, { useState, useEffect } from 'react';
import { useUserProfile } from '../../../Hooks/useUserProfile';
import { Button, Card, Input, Alert, Spinner } from '../../components/shared';
import { AppShell } from '../../components/layout';

export const ProfilePage: React.FC = () => {
    const { profile, isLoading, error, updateProfile } = useUserProfile();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        if (profile) {
            setName(profile.name || '');
            setEmail(profile.email || '');
        }
    }, [profile]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setSuccessMessage(null);
        try {
            await updateProfile({ name, email });
            setSuccessMessage('Perfil actualizado con éxito');
        } catch {
            // Error handling is managed by PLOC/Hook
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading && !profile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-main">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <AppShell>
            {/* Info Card */}
            <Card className="large p-10 flex flex-col justify-center bg-surface-primary/10">
                <h1 className="text-4xl font-black bg-gradient-to-r from-neon-purple to-neon-blue bg-clip-text text-transparent">
                    Tu Perfil
                </h1>
                <p className="text-text-secondary mt-6 font-medium max-w-sm">
                    Gestiona tu identidad digital y configuración de acceso desde un solo lugar.
                </p>
                <div className="mt-10 flex items-center gap-6">
                    <div className="w-16 h-16 rounded-3xl bg-primary/20 border border-primary/30 flex items-center justify-center text-4xl font-black text-neon-blue shadow-neon">
                        {name.charAt(0)}
                    </div>
                    <div>
                        <p className="text-text-primary text-xl font-black">{name}</p>
                        <p className="text-text-secondary font-medium">{email}</p>
                    </div>
                </div>
            </Card>

            {/* Form Card */}
            <Card className="large p-12 border-white/5">
                {error && <div className="mb-6"><Alert message={error} type="error" /></div>}
                {successMessage && <div className="mb-6"><Alert message={successMessage} type="success" /></div>}
                
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Input
                            label="ID de Identidad"
                            id="userId"
                            value={profile?.id || ''}
                            disabled
                            className="opacity-50 grayscale"
                            readOnly
                        />
                        <Input
                            label="Email Principal"
                            id="userEmail"
                            value={email}
                            disabled
                            className="opacity-50 grayscale"
                        />
                    </div>

                    <Input
                        label="Nombre Público"
                        id="userName"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ingresa tu nombre"
                        required
                    />

                    <div className="flex justify-start pt-6">
                        <Button 
                            type="submit" 
                            className="bg-neon-purple shadow-neon h-14 px-12 text-lg" 
                            disabled={isSaving || isLoading}
                        >
                            {isSaving ? 'Aplicando...' : 'Actualizar Perfil'}
                        </Button>
                    </div>
                </form>
            </Card>
        </AppShell>
    );
};
