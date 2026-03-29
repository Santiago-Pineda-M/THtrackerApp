/**
 * ActivitiesPage - Página de gestión de actividades
 */

import { ActivitiesList } from '../../components/organisms/Activities';
import { MainLayout } from '../../components/layouts/MainLayout';

export const ActivitiesPage: React.FC = () => {
    return (
        <MainLayout>
            <ActivitiesList />
        </MainLayout>
    );
};

export default ActivitiesPage;
