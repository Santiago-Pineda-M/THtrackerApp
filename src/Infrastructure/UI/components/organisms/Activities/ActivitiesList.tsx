/**
 * ActivitiesList - Componente principal para listar actividades
 */
import { useState, useEffect } from 'react';
import { useDependencies } from '../../../../Context/DependenciesProvider';
import { usePlocState } from '../../../../Hooks/usePlocState';
import type { IActivitiesListState } from '../../../../../Domain/IStates';
import Card from '../../atoms/Card/Card';
import Button from '../../atoms/Button/Button';
import Text from '../../atoms/Text/Text';
import Icon from '../../atoms/Icon/Icon';
import { Table } from '../../molecules/Table/Table';
import { ActivityCreate } from './ActivityCreate';
import { ActivityFormEdit } from './ActivityFormEdit';
import { ActivityDeleteConfirm } from './ActivityDeleteConfirm';
import { ActivityValueDefinitions } from './ActivityValueDefinitions';
import { ActivityLogsList } from './ActivityLogsList';
import styles from './ActivitiesList.module.css';

interface Activity {
    id: string;
    categoryId: string;
    name: string | null;
    allowOverlap: boolean;
    userId: string;
}

export const ActivitiesList: React.FC = () => {
    const { providerActivitiesListPloc } = useDependencies();
    const listState = usePlocState<IActivitiesListState>(providerActivitiesListPloc);
    
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
    const [selectedActivityDetails, setSelectedActivityDetails] = useState<Activity | null>(null);
    const [activeTab, setActiveTab] = useState<'properties' | 'history'>('history');
    
    useEffect(() => {
        providerActivitiesListPloc.loadActivities();
    }, [providerActivitiesListPloc]);

    const handleEditClick = (activity: Activity) => {
        setSelectedActivity(activity);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (activity: Activity) => {
        setSelectedActivity(activity);
        setIsDeleteConfirmOpen(true);
    };

    const handleSelectForDetails = (activity: Activity) => {
        if (selectedActivityDetails?.id === activity.id) {
            setSelectedActivityDetails(null); // Toggle off
        } else {
            setSelectedActivityDetails(activity);
            setActiveTab('history');
        }
    };

    const handleCreateSuccess = () => {
        providerActivitiesListPloc.loadActivities();
    };

    const handleEditSuccess = () => {
        setIsEditModalOpen(false);
        setSelectedActivity(null);
        providerActivitiesListPloc.loadActivities();
    };

    const handleDeleteSuccess = () => {
        setIsDeleteConfirmOpen(false);
        setSelectedActivity(null);
        if (selectedActivityDetails?.id === selectedActivity?.id) {
            setSelectedActivityDetails(null);
        }
        providerActivitiesListPloc.loadActivities();
    };

    const columns = [
        { key: 'name', label: 'Nombre', width: '40%' },
        { key: 'categoryId', label: 'Categoría ID', width: '30%' },
        { key: 'overlap', label: 'Solapamiento', width: '15%' },
        { key: 'actions', label: 'Acciones', width: '15%' },
    ];

    const rows = listState.activities.map((activity: Activity) => ({
        name: (
            <div 
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                onClick={() => handleSelectForDetails(activity)}
                title="Ver detalles e historial de esta actividad"
            >
                <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: selectedActivityDetails?.id === activity.id ? 'var(--bento-color-primary)' : 'transparent'
                }}/>
                <Text weight={selectedActivityDetails?.id === activity.id ? 'bold' : 'medium'}>
                    {activity.name || 'Sin nombre'}
                </Text>
            </div>
        ),
        categoryId: (
            <Text size="xs" color="secondary" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '150px' }}>
                {activity.categoryId}
            </Text>
        ),
        overlap: (
            <span className={`${styles.badge} ${activity.allowOverlap ? styles.badgeSuccess : styles.badgeNeutral}`}>
                {activity.allowOverlap ? 'Permitido' : 'No permitido'}
            </span>
        ),
        actions: (
            <div className={styles.actions}>
                <Button variant="ghost" size="sm" onClick={() => handleEditClick(activity)} title="Editar">
                    <Icon name="Edit" size={18} />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(activity)} title="Eliminar">
                    <Icon name="Trash2" size={18} />
                </Button>
            </div>
        ),
    }));

    return (
        <>
            <Card h={3} w={4} title="Actividades" className={styles.card}>
                <div className={styles.header}>
                    <ActivityCreate onSuccess={handleCreateSuccess} />
                </div>

                {listState.error && (
                    <Text size="sm" className={styles.error}>
                        {listState.error.detail || 'Error al cargar actividades'}
                    </Text>
                )}

                <Table
                    columns={columns}
                    rows={rows}
                    loading={listState.isLoading}
                    emptyMessage="No hay actividades. Crea una nueva seleccionando una categoría."
                />

                {selectedActivityDetails && (
                    <div className={styles.detailsPanel}>
                        <div className={styles.tabsHeader}>
                            <Button 
                                variant={activeTab === 'history' ? 'primary' : 'ghost'} 
                                size="sm" 
                                onClick={() => setActiveTab('history')}
                            >
                                <Icon name="Clock" size={16} /> Historial
                            </Button>
                            <Button 
                                variant={activeTab === 'properties' ? 'primary' : 'ghost'} 
                                size="sm" 
                                onClick={() => setActiveTab('properties')}
                            >
                                <Icon name="Settings" size={16} /> Propiedades
                            </Button>
                        </div>
                        
                        <div className={styles.tabContent}>
                            {activeTab === 'history' && (
                                <ActivityLogsList
                                    key={`logs-${selectedActivityDetails.id}`}
                                    activityId={selectedActivityDetails.id}
                                    activityName={selectedActivityDetails.name || 'Sin nombre'}
                                />
                            )}
                            {activeTab === 'properties' && (
                                <ActivityValueDefinitions 
                                    key={`props-${selectedActivityDetails.id}`}
                                    activityId={selectedActivityDetails.id}
                                    activityName={selectedActivityDetails.name || 'Sin nombre'}
                                />
                            )}
                        </div>
                    </div>
                )}
            </Card>

            <ActivityFormEdit
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedActivity(null);
                }}
                activity={selectedActivity}
                onSuccess={handleEditSuccess}
            />

            <ActivityDeleteConfirm
                isOpen={isDeleteConfirmOpen}
                onClose={() => {
                    setIsDeleteConfirmOpen(false);
                    setSelectedActivity(null);
                }}
                activity={selectedActivity}
                onSuccess={handleDeleteSuccess}
            />
        </>
    );
};
