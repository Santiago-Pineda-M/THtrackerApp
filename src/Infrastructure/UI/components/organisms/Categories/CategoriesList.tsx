/**
 * CategoriesList - Componente principal para listar categorías
 */
import { useState, useEffect } from 'react';
import { useDependencies } from '../../../../Context/DependenciesProvider';
import { usePlocState } from '../../../../Hooks/usePlocState';
import type { ICategoriesListState } from '../../../../../Domain/IStates';
import Card from '../../atoms/Card/Card';
import Button from '../../atoms/Button/Button';
import Text from '../../atoms/Text/Text';
import Icon from '../../atoms/Icon/Icon';
import { Table } from '../../molecules/Table/Table';
import { CategoryCreate } from './CategoryCreate';
import { CategoryFormEdit } from './CategoryFormEdit';
import { CategoryDeleteConfirm } from './CategoryDeleteConfirm';
import styles from './CategoriesList.module.css';

interface Category {
    id: string;
    name: string | null;
    userId: string;
}

export const CategoriesList: React.FC = () => {
    const { providerCategoriesListPloc } = useDependencies();
    const listState = usePlocState<ICategoriesListState>(providerCategoriesListPloc);
    
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    
    useEffect(() => {
        providerCategoriesListPloc.loadCategories();
    }, [providerCategoriesListPloc]);

    const handleEditClick = (category: Category) => {
        setSelectedCategory(category);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (category: Category) => {
        setSelectedCategory(category);
        setIsDeleteConfirmOpen(true);
    };

    const handleCreateSuccess = () => {
        providerCategoriesListPloc.loadCategories();
    };

    const handleEditSuccess = () => {
        setIsEditModalOpen(false);
        setSelectedCategory(null);
        providerCategoriesListPloc.loadCategories();
    };

    const handleDeleteSuccess = () => {
        setIsDeleteConfirmOpen(false);
        setSelectedCategory(null);
        providerCategoriesListPloc.loadCategories();
    };

    const columns = [
        { key: 'name', label: 'Nombre', width: '70%' },
        { key: 'actions', label: 'Acciones', width: '30%' },
    ];

    const rows = listState.categories.map((category: Category) => ({
        name: category.name || 'Sin nombre',
        actions: (
            <div className={styles.actions}>
                <Button variant="ghost" size="sm" onClick={() => handleEditClick(category)} title="Editar">
                    <Icon name="Edit" size={20} />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(category)} title="Eliminar">
                    <Icon name="Trash2" size={20} />
                </Button>
            </div>
        ),
    }));

    return (
        <>
            <Card h={3} w={4} title="Categorías" className={styles.card}>
                <div className={styles.header}>
                    <CategoryCreate onSuccess={handleCreateSuccess} />
                </div>

                {listState.error && (
                    <Text size="sm" className={styles.error}>
                        {listState.error.detail || 'Error al cargar categorías'}
                    </Text>
                )}

                <Table
                    columns={columns}
                    rows={rows}
                    loading={listState.isLoading}
                    emptyMessage="No hay categorías. Crea una nueva."
                />
            </Card>

            <CategoryFormEdit
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedCategory(null);
                }}
                category={selectedCategory}
                onSuccess={handleEditSuccess}
            />

            <CategoryDeleteConfirm
                isOpen={isDeleteConfirmOpen}
                onClose={() => {
                    setIsDeleteConfirmOpen(false);
                    setSelectedCategory(null);
                }}
                category={selectedCategory}
                onSuccess={handleDeleteSuccess}
            />
        </>
    );
};
