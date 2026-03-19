import React from 'react';
import { Card, Text, Button, Divider, Icon } from '../../components';
import { usePlocState } from '../../../Hooks/usePlocState';
import type { IAuthState } from '../../../../Domain';
import {useDependencies} from '../../../Context/DependenciesProvider';

export const DashboardPage: React.FC = () => {
    const { providerLogoutPloc, providerAuthPloc } = useDependencies();
    const authState = usePlocState<IAuthState>(providerAuthPloc);
    const handleLogout = () => {
        providerLogoutPloc.logout();
    };

    return (
        <>
            {/* Bienvenida */}
            <Card title="Bienvenido al Dashboard" w={2} h={1}>
                <div>
                    <Text size="lg" as="h3" weight="bold">
                        ¡Hola, {authState.user?.email || 'Usuario'}!
                    </Text>
                    <Text size="md">
                        Bienvenido al sistema THtracker. Aquí podrás gestionar tus datos.
                    </Text>
                </div>
            </Card>

            {/* Acciones */}
            <Card title="Acciones" w={1} h={2}>
                <div>
                    <Text size="md">Próximamente más funciones de tu sistema THtracker.</Text>
                    <Divider />
                    <Button variant="danger" onClick={handleLogout}>
                        <Icon name="LogOut" size={16} /> Cerrar Sesión
                    </Button>
                </div>
            </Card>
        </>
    );
};

export default DashboardPage;
