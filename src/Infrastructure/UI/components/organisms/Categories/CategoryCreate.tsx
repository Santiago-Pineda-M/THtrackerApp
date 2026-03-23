/**
 * CategoryCreate - Componente que incluye el botón y formulario para crear una categoría
 */
import { useState } from 'react';
import { useDependencies } from '../../../../Context/DependenciesProvider';
import { usePlocState } from '../../../../Hooks/usePlocState';
import type { ICategoryCreateFormState } from '../../../../../Domain/IStates';
import Button from '../../atoms/Button/Button';
import Icon from '../../atoms/Icon/Icon';
import Input from '../../atoms/Input/Input';
import Text from '../../atoms/Text/Text';
import { FormField } from '../../molecules/Form/FormField';
import { Modal } from '../../molecules/Modal/Modal';
import styles from './CategoriesList.module.css';

interface CategoryCreateProps {
    onSuccess: () => void;
}

export const CategoryCreate: React.FC<CategoryCreateProps> = ({ onSuccess }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { providerCategoryCreateFormPloc } = useDependencies();
    const state = usePlocState<ICategoryCreateFormState>(providerCategoryCreateFormPloc);

    const handleOpen = () => {
        providerCategoryCreateFormPloc.reset();
        setIsOpen(true);
    };

    const handleClose = () => {
        // Si hay éxito, recargar la lista al cerrar
        if (state.success) {
            onSuccess();
        }
        setIsOpen(false);
        providerCategoryCreateFormPloc.reset();
    };

    const handleSubmit = async () => {
        await providerCategoryCreateFormPloc.submit();
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        providerCategoryCreateFormPloc.updateName(e.target.value);
    };

    // Si hay éxito, mostrar mensaje y botón de cerrar
    if (state.success) {
        return (
            <>
                <Button variant="primary" onClick={handleOpen} icon={<Icon name="Plus" size={16} />}>
                    Nueva Categoría
                </Button>
                <Modal isOpen={isOpen} onClose={handleClose} title="Crear Categoría">
                    <div className={styles.successForm}>
                        <Text size="lg" className={styles.success}>
                            ✓ Categoría creada exitosamente
                        </Text>
                        <Button variant="primary" onClick={handleClose}>
                            Cerrar
                        </Button>
                    </div>
                </Modal>
            </>
        );
    }

    return (
        <>
            <Button variant="primary" onClick={handleOpen} icon={<Icon name="Plus" size={16} />}>
                Nueva Categoría
            </Button>

            <Modal isOpen={isOpen} onClose={handleClose} title="Crear Categoría">
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
                            Crear
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default CategoryCreate;
