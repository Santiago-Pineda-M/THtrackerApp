/**
 * CategoriesPage - Página de gestión de categorías
 */

import { CategoriesList } from '../../components/organisms/Categories';
import { MainLayout } from '../../components/layouts/MainLayout';

export const CategoriesPage: React.FC = () => {
    return (
        <MainLayout>
            <CategoriesList />
        </MainLayout>
    );
};
