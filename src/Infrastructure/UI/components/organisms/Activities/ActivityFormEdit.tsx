/**
 * ActivityFormEdit - Componente para editar una actividad existente
 */
import { useEffect } from 'react';
import { useDependencies } from '../../../../Context/DependenciesProvider';
import { usePlocState } from '../../../../Hooks/usePlocState';
import type { IActivityEditFormState } from '../../../../../Domain/IStates';
import Button from '../../atoms/Button/Button';
import Input from '../../atoms/Input/Input';
import Text from '../../atoms/Text/Text';
import ToggleSwitch from '../../atoms/ToggleSwitch/ToggleSwitch';
import { FormField } from '../../molecules/Form/FormField';
import { Modal } from '../../molecules/Modal/Modal';
import styles from './ActivitiesList.module.css';

interface Activity {
    id: string;
    categoryId: string;
    name: string | null;
    allowOverlap: boolean;
}

interface ActivityFormEditProps {
    isOpen: boolean;
    onClose: () => void;
    activity: Activity | null;
    onSuccess: () => void;
}

export const ActivityFormEdit: React.FC<ActivityFormEditProps> = ({ 
    isOpen, 
    onClose, 
    activity,
    onSuccess 
}) => {
    const { providerActivityEditFormPloc } = useDependencies();
    const state = usePlocState<IActivityEditFormState>(providerActivityEditFormPloc);

    useEffect(() => {
        if (isOpen && activity) {
            providerActivityEditFormPloc.loadActivity(activity.id);
        }
    }, [isOpen, activity, providerActivityEditFormPloc]);

    const handleClose = () => {
        if (state.success) {
            onSuccess();
        }
        onClose();
        providerActivityEditFormPloc.reset();
    };

    const handleSubmit = async () => {
        await providerActivityEditFormPloc.submit();
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        providerActivityEditFormPloc.updateName(e.target.value);
    };

    const handleOverlapChange = (checked: boolean) => {
        providerActivityEditFormPloc.updateAllowOverlap(checked);
    };

    // Si hay éxito, mostrar mensaje decorado
    if (state.success) {
        return (
            <Modal isOpen={isOpen} onClose={handleClose} title="Editar Actividad">
                <div style={{ padding: '24px', textAlign: 'center' }}>
                    <div style={{ color: 'var(--status-success)', fontSize: '48px', marginBottom: '16px' }}>
                        <Icon name="Check" size={48} />
                    </div>
                    <Text size="lg" weight="bold" style={{ display: 'block', marginBottom: '8px' }}>
                        ¡Actualización exitosa!
                    </Text>
                    <Text size="sm" color="secondary" style={{ display: 'block', marginBottom: '24px' }}>
                        Los cambios en la actividad se han guardado correctamente.
                    </Text>
                    <Button variant="primary" onClick={handleClose} style={{ width: '100%' }}>
                        Cerrar
                    </Button>
                </div>
            </Modal>
        );
    }

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Editar Actividad">
            <div className={styles.form} style={{ padding: '24px' }}>
                {state.message && (
                    <div className={state.success ? styles.success : styles.error} style={{ marginBottom: '16px' }}>
                        <Text size="sm">{state.message}</Text>
                    </div>
                )}

                <FormField label="Categoría (Solo lectura)">
                    <Input
                        type="text"
                        value={state.categoryId}
                        readOnly
                        disabled
                    />
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
                        Guardar cambios
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

// Importación manual de Icon para el mensaje de éxito
import Icon from '../../atoms/Icon/Icon';
