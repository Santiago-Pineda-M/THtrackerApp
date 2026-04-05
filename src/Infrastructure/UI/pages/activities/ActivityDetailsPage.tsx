import React from 'react';
import { useParams } from 'react-router-dom';
import { MainLayout } from '../../components';
import {
    ActivityGeneralInfo,
    ActivityProperties,
    ActivityLogs
} from '../../components/organisms/Activities';

export const ActivityDetailsPage: React.FC = () => {
    const { id = '' } = useParams<{ id: string }>();

    const breadcrumbs = [
        { label: 'Actividades', path: '/activities' },
        { label: 'Detalle de Actividad' }
    ];

    return (
        <MainLayout breadcrumbs={breadcrumbs}>
            <ActivityGeneralInfo activityId={id} />
            <ActivityProperties activityId={id} />
            <ActivityLogs activityId={id} />
        </MainLayout>
    );
};

export default ActivityDetailsPage;
