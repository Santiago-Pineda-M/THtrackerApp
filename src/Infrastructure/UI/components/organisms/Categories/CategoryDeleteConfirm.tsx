/**
 * CategoryDeleteConfirm - Componente de confirmación para eliminar una categoría
 */
import React from 'react';
import { useDependencies } from '../../../../Context/DependenciesProvider';
import { usePlocState } from '../../../../Hooks/usePlocState';
import type { ICategoryDeleteState } from '../../../../../Controllers/Category/CategoryDeletePloc';
import Button from '../../atoms/Button/Button';
import Text from '../../atoms/Text/Text';
import { Modal } from '../../molecules/Modal/Modal';
import styles from './CategoriesList.module.css';

interface Category {
    id: string;
    name: string | null;
    userId: string;
}

interface CategoryDeleteConfirmProps {
    isOpen: boolean;
    onClose: () => void;
    category: Category | null;
    onSuccess: () => void;
}

export const CategoryDeleteConfirm: React.FC<CategoryDeleteConfirmProps> = ({ isOpen, onClose, category, onSuccess }) => {
    const { providerCategoryDeletePloc } = useDependencies();
    const state = usePlocState<ICategoryDeleteState>(providerCategoryDeletePloc);

    const handleConfirm = async () => {
        if (category) {
            await providerCategoryDeletePloc.deleteCategory(category.id);
        }
    };

    const handleClose = () => {
        // Si hay éxito, recargar la lista al cerrar
        if (state.success) {
            onSuccess();
        }
        providerCategoryDeletePloc.reset();
        onClose();
    };

    if (!category) return null;

    // Si hay éxito, mostrar mensaje y botón de cerrar
    if (state.success) {
        return (
            <Modal isOpen={isOpen} onClose={handleClose} title="Eliminar Categoría">
                <div className={styles.successForm}>
                    <Text size="lg" className={styles.success}>
                        ✓ Categoría eliminada exitosamente
                    </Text>
                    <Button variant="primary" onClick={handleClose}>
                        Cerrar
                    </Button>
                </div>
            </Modal>
        );
    }

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Eliminar Categoría">
            <div className={styles.deleteForm}>
                {state.message && (
                    <Text size="sm" className={state.success ? styles.success : styles.error}>
                        {state.message}
                    </Text>
                )}
                <Text size="md">
                    ¿Estás seguro de que deseas eliminar la categoría "{category.name}"?
                </Text>
                <Text size="sm" className={styles.error}>Esta acción no se puede deshacer.</Text>
                <div className={styles.actions}>
                    <Button variant="secondary" onClick={handleClose} disabled={state.isLoading}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={handleConfirm} loading={state.isLoading}>
                        Eliminar
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default CategoryDeleteConfirm;
