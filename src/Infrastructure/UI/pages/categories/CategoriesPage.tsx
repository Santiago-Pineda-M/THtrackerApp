import React from 'react';
import { MainLayout } from '../../components/layouts/MainLayout';
import { CategoriesList } from '../../components';

export const CategoriesPage: React.FC = () => {
    return (
        <MainLayout>
            <CategoriesList />
        </MainLayout>
    );
};
