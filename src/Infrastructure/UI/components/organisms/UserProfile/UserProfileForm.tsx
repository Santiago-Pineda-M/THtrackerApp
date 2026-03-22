/**
 * INFRASTRUCTURE LAYER - UI Components
 * Componente para el formulario de edición del perfil de usuario.
 */

import { useEffect } from 'react';
import { Card, Input, Button, Text } from '../../../components';
import FormField from '../../molecules/Form/FormField';
import { useDependencies } from '../../../../Context/DependenciesProvider';
import { usePlocState } from '../../../../Hooks/usePlocState';
import type { IUserProfileFormState } from '../../../../../Domain/IStates';

export const UserProfileForm: React.FC = () => {
    const { providerUserProfileFormPloc } = useDependencies();
    const state = usePlocState<IUserProfileFormState>(providerUserProfileFormPloc);

    useEffect(() => {
        providerUserProfileFormPloc.initializeForm();
    }, [providerUserProfileFormPloc]);

    const handleSubmit = async () => {
        await providerUserProfileFormPloc.submit();
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        providerUserProfileFormPloc.updateName(e.target.value);
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        providerUserProfileFormPloc.updateEmail(e.target.value);
    };

    if (state.isLoading && !state.name && !state.email) {
        return (
            <Card title="Editar Perfil">
                <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                    <Text>Cargando...</Text>
                </div>
            </Card>
        );
    }

    return (
        <Card h={2} w={2} title="Editar Perfil">
            {state.message && (
                <Text 
                    size="sm" 
                    className={state.success ? 'success' : 'error'}
                    style={{ 
                        marginBottom: '1rem',
                        color: state.success ? 'green' : 'red' 
                    }}
                >
                    {state.message}
                </Text>
            )}

            <FormField 
                label="Nombre" 
                required 
                error={state.errors.name?.[0]}
            >
                <Input
                    name="name"
                    type="text"
                    value={state.name}
                    onChange={handleNameChange}
                    placeholder="Tu nombre"
                    disabled={state.isLoading}
                />
            </FormField>

            <FormField 
                label="Correo Electrónico" 
                required 
                error={state.errors.email?.[0]}
            >
                <Input
                    name="email"
                    type="email"
                    value={state.email}
                    onChange={handleEmailChange}
                    placeholder="tu@correo.com"
                    disabled={state.isLoading}
                />
            </FormField>

            <Button
                type="button"
                variant="primary"
                onClick={handleSubmit}
                disabled={state.isLoading || state.success}
                loading={state.isLoading}
                size="md"
            >
                {state.success ? 'Guardado' : 'Guardar Cambios'}
            </Button>
        </Card>
    );
};

export default UserProfileForm;
