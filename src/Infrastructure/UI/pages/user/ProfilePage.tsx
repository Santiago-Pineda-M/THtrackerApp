import React, { useState, useEffect } from 'react';
import { useUserProfile } from '../../../Hooks/useUserProfile';
import { Card, Text, Input, Button, Avatar, Divider, Spinner, type InputElement } from '../../components';

export const ProfilePage: React.FC = () => {
    const { profile, isLoading, updateProfile } = useUserProfile();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (profile) {
            setName(profile.name || '');
            setEmail(profile.email || '');
        }
    }, [profile]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await updateProfile({ name, email });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading && !profile) {
        return (
            <Card w={1} h={1}>
                <div>
                    <Spinner />
                    <Text variant="caption">Cargando perfil...</Text>
                </div>
            </Card>
        );
    }

    return (
        <>
            <Card title="Información Pública" w={1} h={2}>
                <div>
                    <Avatar size="lg" initials={name || 'U'} />
                    <div>
                        <Text variant="title" as="h2" style={{ marginBottom: '4px' }}>{name}</Text>
                        <Text variant="caption">{email}</Text>
                    </div>
                </div>
                <Divider />
                <Text variant="body">
                    Administrador del sistema THtracker.
                </Text>
            </Card>

            <Card title="Ajustes de la Cuenta" w={2} h={3}>
                <form onSubmit={handleSubmit}>
                    <div>
                        <Input
                            label="Nombre Completo"
                            name="name"
                            value={name}
                            onChange={(e: React.ChangeEvent<InputElement>) => setName(e.target.value)}
                            required
                        />

                        <Input
                            label="Correo Electrónico (Solo Lectura)"
                            name="email"
                            value={email}
                            onChange={() => {}}
                            disabled
                        />
                    </div>

                    <div>
                        <Button type="submit" variant="primary" disabled={isSaving}>
                            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                        </Button>
                    </div>
                </form>
            </Card>
        </>
    );
};

export default ProfilePage;
