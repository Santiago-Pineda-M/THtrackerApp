/**
 * CategoryFormEdit - Formulario para editar una categoría existente
 */
import React, { useEffect } from 'react';
import { useDependencies } from '../../../../Context/DependenciesProvider';
import { usePlocState } from '../../../../Hooks/usePlocState';
import type { ICategoryEditFormState } from '../../../../../Domain/IStates';
import Button from '../../atoms/Button/Button';
import Input from '../../atoms/Input/Input';
import Text from '../../atoms/Text/Text';
import { FormField } from '../../molecules/Form/FormField';
import { Modal } from '../../molecules/Modal/Modal';
import styles from './CategoriesList.module.css';

interface Category {
    id: string;
    name: string | null;
    userId: string;
}

interface CategoryFormEditProps {
    isOpen: boolean;
    onClose: () => void;
    category: Category | null;
    onSuccess: () => void;
}

export const CategoryFormEdit: React.FC<CategoryFormEditProps> = ({ isOpen, onClose, category, onSuccess }) => {
    const { providerCategoryEditFormPloc } = useDependencies();
    const state = usePlocState<ICategoryEditFormState>(providerCategoryEditFormPloc);

    useEffect(() => {
        if (category && isOpen) {
            providerCategoryEditFormPloc.initializeForm(category.id);
        }
    }, [category, isOpen, providerCategoryEditFormPloc]);

    const handleSubmit = async () => {
        await providerCategoryEditFormPloc.submit();
    };

    const handleClose = () => {
        // Si hay éxito, recargar la lista al cerrar
        if (state.success) {
            onSuccess();
        }
        onClose();
        providerCategoryEditFormPloc.reset();
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        providerCategoryEditFormPloc.updateName(e.target.value);
    };

    if (!category) return null;

    // Si hay éxito, mostrar mensaje y botón de cerrar
    if (state.success) {
        return (
            <Modal isOpen={isOpen} onClose={handleClose} title="Editar Categoría">
                <div className={styles.successForm}>
                    <Text size="lg" className={styles.success}>
                        ✓ Categoría actualizada exitosamente
                    </Text>
                    <Button variant="primary" onClick={handleClose}>
                        Cerrar
                    </Button>
                </div>
            </Modal>
        );
    }

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Editar Categoría">
            <div className={styles.form}>
                {state.message && (
                    <Text size="sm" className={state.success ? styles.success : styles.error}>
                        {state.message}
                    </Text>
                )}

                <FormField label="Nombre" required error={state.errors.name?.[0]}>
                    <Input
                        type="text"
                        value={state.name}
                        onChange={handleNameChange}
                        placeholder="Ej: Trabajo, Estudio, Ejercicio"
                        disabled={state.isLoading}
                    />
                </FormField>

                <div className={styles.actions}>
                    <Button
                        variant="secondary"
                        onClick={handleClose}
                        disabled={state.isLoading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSubmit}
                        loading={state.isLoading}
                    >
                        Guardar
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default CategoryFormEdit;
