/**
 * ActivityDeleteConfirm - Modal de confirmación para eliminar una actividad
 */
import { useDependencies } from '../../../../Context/DependenciesProvider';
import { usePlocState } from '../../../../Hooks/usePlocState';
import type { IActivityDeleteState } from '../../../../../Domain/IStates';
import Button from '../../atoms/Button/Button';
import Text from '../../atoms/Text/Text';
import Icon from '../../atoms/Icon/Icon';
import { Modal } from '../../molecules/Modal/Modal';
import styles from './ActivitiesList.module.css';

interface Activity {
    id: string;
    name: string | null;
}

interface ActivityDeleteConfirmProps {
    isOpen: boolean;
    onClose: () => void;
    activity: Activity | null;
    onSuccess: () => void;
}

export const ActivityDeleteConfirm: React.FC<ActivityDeleteConfirmProps> = ({ 
    isOpen, 
    onClose, 
    activity,
    onSuccess 
}) => {
    const { providerActivityDeletePloc } = useDependencies();
    const state = usePlocState<IActivityDeleteState>(providerActivityDeletePloc);

    const handleConfirm = async () => {
        if (activity) {
            await providerActivityDeletePloc.deleteActivity(activity.id);
            if (!state.error) {
                onSuccess();
            }
        }
    };

    const handleClose = () => {
        onClose();
        providerActivityDeletePloc.reset();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Eliminar Actividad">
            <div style={{ padding: '24px', textAlign: 'center' }}>
                <div style={{ color: 'var(--status-error)', fontSize: '48px', marginBottom: '16px' }}>
                    <Icon name="AlertCircle" size={48} />
                </div>
                
                <Text size="lg" weight="bold" style={{ display: 'block', marginBottom: '8px' }}>
                    ¿Estás seguro de que deseas eliminar esta actividad?
                </Text>
                
                <Text size="sm" color="secondary" style={{ display: 'block', marginBottom: '24px' }}>
                    Esta acción es irreversible y eliminará todos los registros asociados a <b>"{activity?.name || 'esta actividad'}"</b>.
                </Text>

                {state.error && (
                    <div className={styles.error} style={{ marginBottom: '16px', textAlign: 'left' }}>
                        <Text size="sm">{state.error.detail || 'No se pudo eliminar la actividad.'}</Text>
                    </div>
                )}

                <div style={{ display: 'flex', gap: '12px' }}>
                    <Button
                        variant="secondary"
                        onClick={handleClose}
                        disabled={state.isLoading}
                        style={{ flex: 1 }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="danger"
                        onClick={handleConfirm}
                        loading={state.isLoading}
                        style={{ flex: 1 }}
                    >
                        Eliminar definitivamente
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
