/**
 * INFRASTRUCTURE LAYER - UI Components
 * Componente para mostrar el perfil del usuario.
 */

import { useEffect } from 'react';
import { Card, Text, Spinner, Avatar } from '../../../components';
import { useDependencies } from '../../../../Context/useDependencies';
import { usePlocState } from '../../../../Hooks/usePlocState';
import type { IUserProfileDisplayState } from '../../../../../Domain/IStates';

/**
 * Obtiene las iniciales de un nombre o email.
 */
function getInitials(name: string): string {
    if (!name) return '?';
    const parts = name.split(/[@\s]+/);
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
}

export const UserProfileDisplay: React.FC = () => {
    const { providerUserProfileDisplayPloc } = useDependencies();
    const state = usePlocState<IUserProfileDisplayState>(providerUserProfileDisplayPloc);

    useEffect(() => {
        providerUserProfileDisplayPloc.loadProfile();
    }, [providerUserProfileDisplayPloc]);

    if (state.isLoading) {
        return (
            <Card h={2} w={2} title="Mi Perfil">
                <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                    <Spinner size="md" />
                </div>
            </Card>
        );
    }

    if (state.error) {
        return (
            <Card title="Mi Perfil">
                <Text size="sm" className="error">
                    {state.error.detail || state.error.title || 'Error al cargar el perfil'}
                </Text>
            </Card>
        );
    }

    if (!state.user) {
        return (
            <Card title="Mi Perfil">
                <Text size="sm">No se encontró información del usuario</Text>
            </Card>
        );
    }

    return (
        <Card h={1} w={2} title="Mi Perfil">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <Avatar 
                    initials={getInitials(state.user.name || state.user.email || 'Usuario')}
                    size="lg" 
                />
                <div>
                    <Text size="lg" weight="bold">
                        {state.user.name || 'Sin nombre'}
                    </Text>
                    <Text size="sm" color="muted">
                        {state.user.email}
                    </Text>
                </div>
            </div>
            <div style={{ marginTop: '1rem' }}>
                <Text size="sm" color="muted">
                    ID: {state.user.id}
                </Text>
            </div>
        </Card>
    );
};

export default UserProfileDisplay;
