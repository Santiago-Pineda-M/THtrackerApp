import React from 'react';
import { Link } from 'react-router-dom';
import { usePlocState } from '../../../Hooks/usePlocState';
import { dependenciesLocator } from '../../../DI/DependenciesLocator';
import { Sidebar } from '../../components/organisms/Sidebar/Sidebar';
import { Card, Text, Button, Badge, StatCard, Avatar, Divider, Icon } from '../../components';

export const DashboardPage: React.FC = () => {
    const authPloc = dependenciesLocator.provideAuthPloc();
    const authState = usePlocState(authPloc);
    const user = authState.user;

    const handleLogout = () => {
        authPloc.logout();
    };

    return (
        <>
            {/* Header / Intro Card */}
            <Card title="Panel de Control" w={2} h={1}>
                <div>
                    <Avatar size="lg" initials={user?.name || 'US'} />
                    <div>
                        <Text variant="title" as="h1" style={{ marginBottom: '4px' }}>
                            ¡Hola, {user?.name}!
                        </Text>
                        <div>
                            <Text variant="body">Estado de tu cuenta:</Text>
                            <Badge variant="success">Activa</Badge>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Quick Stats */}
            <Card title="Resumen" w={2} h={1}>
                <div>
                    <StatCard
                        label="Completitud de Perfil"
                        value="100%"
                        trend={5}
                        trendLabel="vs mes pasado"
                        icon="UserCheck"
                    />
                    <StatCard
                        label="Última Conexión"
                        value="Hoy"
                        icon="Clock"
                    />
                </div>
            </Card>

            {/* Navigation / Links Rápidos */}
            <Card title="Enlaces Rápidos" w={1} h={1}>
                <nav>
                    <Link to="/dashboard">Ir al Dashboard (Actual)</Link>
                    <Link to="/profile">Mi Perfil</Link>
                </nav>
            </Card>

            {/* Acciones Rápidas */}
            <Card title="Acciones" w={1} h={2}>
                <div>
                    <Text variant="body">Próximamente más funciones de tu sistema THtracker.</Text>
                    <Divider />
                    <Button variant="danger" onClick={handleLogout}>
                        <Icon name="LogOut" size={16} /> Cerrar Sesión
                    </Button>
                </div>
            </Card>

            <Sidebar />
        </>
    );
};

export default DashboardPage;
