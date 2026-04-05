import React from 'react';
import { MainLayout } from '../../components/layouts/MainLayout';
import { ActivitiesList } from '../../components';
import { CategoriesList } from '../../components';

export const ActivitiesPage: React.FC = () => {
    const breadcrumbs = [
        { label: 'Actividades' }
    ];

    return (
        <MainLayout breadcrumbs={breadcrumbs}>
            <ActivitiesList />
            <CategoriesList />
        </MainLayout>
    );
};

export default ActivitiesPage;