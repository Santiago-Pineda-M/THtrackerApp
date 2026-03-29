/**
 * ActivityCreate - Componente que incluye el botón y formulario para crear una actividad
 */
import { useState } from 'react';
import { useDependencies } from '../../../../Context/DependenciesProvider';
import { usePlocState } from '../../../../Hooks/usePlocState';
import type { IActivityCreateFormState, ICategoriesListState } from '../../../../../Domain/IStates';
import Button from '../../atoms/Button/Button';
import Icon from '../../atoms/Icon/Icon';
import Input from '../../atoms/Input/Input';
import Text from '../../atoms/Text/Text';
import ToggleSwitch from '../../atoms/ToggleSwitch/ToggleSwitch';
import { FormField } from '../../molecules/Form/FormField';
import { Modal } from '../../molecules/Modal/Modal';
import styles from './ActivitiesList.module.css';

interface ActivityCreateProps {
    onSuccess: () => void;
}

export const ActivityCreate: React.FC<ActivityCreateProps> = ({ onSuccess }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { providerActivityCreateFormPloc, providerCategoriesListPloc } = useDependencies();
    
    const state = usePlocState<IActivityCreateFormState>(providerActivityCreateFormPloc);
    const categoriesState = usePlocState<ICategoriesListState>(providerCategoriesListPloc);

    const handleOpen = () => {
        providerActivityCreateFormPloc.reset();
        providerCategoriesListPloc.loadCategories(); // Cargar categorías para el select
        setIsOpen(true);
    };

    const handleClose = () => {
        if (state.success) {
            onSuccess();
        }
        setIsOpen(false);
        providerActivityCreateFormPloc.reset();
    };

    const handleSubmit = async () => {
        await providerActivityCreateFormPloc.submit();
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        providerActivityCreateFormPloc.updateName(e.target.value);
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        providerActivityCreateFormPloc.updateCategory(e.target.value);
    };

    const handleOverlapChange = (checked: boolean) => {
        providerActivityCreateFormPloc.updateAllowOverlap(checked);
    };

    // Si hay éxito, mostrar mensaje decorado
    if (state.success) {
        return (
            <>
                <Button variant="primary" onClick={handleOpen} icon={<Icon name="Plus" size={16} />}>
                    Nueva Actividad
                </Button>
                <Modal isOpen={isOpen} onClose={handleClose} title="Crear Actividad">
                    <div style={{ padding: '24px', textAlign: 'center' }}>
                        <div style={{ color: 'var(--status-success)', fontSize: '48px', marginBottom: '16px' }}>
                            <Icon name="Check" size={48} />
                        </div>
                        <Text size="lg" weight="bold" style={{ display: 'block', marginBottom: '8px' }}>
                            ¡Actividad creada!
                        </Text>
                        <Text size="sm" color="secondary" style={{ display: 'block', marginBottom: '24px' }}>
                            La actividad se ha registrado correctamente en la categoría seleccionada.
                        </Text>
                        <Button variant="primary" onClick={handleClose} style={{ width: '100%' }}>
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
                Nueva Actividad
            </Button>

            <Modal isOpen={isOpen} onClose={handleClose} title="Crear Actividad">
                <div className={styles.form} style={{ padding: '24px' }}>
                    {state.message && (
                        <div className={state.success ? styles.success : styles.error} style={{ marginBottom: '16px' }}>
                            <Text size="sm">{state.message}</Text>
                        </div>
                    )}

                    <FormField label="Categoría" required error={state.errors.categoryid?.[0]}>
                        <div>
                            <select
                                value={state.categoryId}
                                onChange={handleCategoryChange}
                                disabled={state.isLoading || categoriesState.isLoading}
                                className={styles.select}
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    borderRadius: '8px',
                                    border: '1px solid var(--border-color)',
                                    backgroundColor: 'var(--surface-color)',
                                    color: 'var(--text-primary)',
                                    outline: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                <option value="">Selecciona una categoría</option>
                                {categoriesState.categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            {categoriesState.isLoading && <Text size="xs" color="secondary">Cargando categorías...</Text>}
                        </div>
                    </FormField>

                    <FormField label="Nombre de la Actividad" required error={state.errors.name?.[0]}>
                        <Input
                            type="text"
                            value={state.name}
                            onChange={handleNameChange}
                            placeholder="Ej: Reporte Mensual, Sprint Review, etc."
                            disabled={state.isLoading}
                        />
                    </FormField>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0' }}>
                        <div>
                            <Text size="sm" weight="medium">Permitir solapamiento</Text>
                            <Text size="xs" color="secondary" style={{ display: 'block' }}>Permite registrar esta actividad al mismo tiempo que otras.</Text>
                        </div>
                        <ToggleSwitch
                            checked={state.allowOverlap}
                            onChange={handleOverlapChange}
                            disabled={state.isLoading}
                        />
                    </div>

                    <div className={styles.actions} style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
                        <Button
                            variant="secondary"
                            onClick={handleClose}
                            disabled={state.isLoading}
                            style={{ flex: 1 }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleSubmit}
                            loading={state.isLoading}
                            style={{ flex: 1 }}
                        >
                            Crear
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};
