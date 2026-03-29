/**
 * ActivityValueDefinitions - Panel inline para listar propiedades (definiciones) de una actividad.
 */
import React, { useEffect } from 'react';
import { useDependencies } from '../../../../Context/DependenciesProvider';
import { usePlocState } from '../../../../Hooks/usePlocState';
import type { IActivityValueDefinitionsState } from '../../../../../Domain/IStates';
import Text from '../../atoms/Text/Text';
import { Table } from '../../molecules/Table/Table';
import { ValueDefinitionCreate } from './ValueDefinitionCreate';
import styles from './ActivitiesList.module.css';

interface ActivityValueDefinitionsProps {
    activityId: string;
    activityName: string;
}

export const ActivityValueDefinitions: React.FC<ActivityValueDefinitionsProps> = ({ activityId, activityName }) => {
    const { providerActivityValueDefinitionsListPloc } = useDependencies();
    const listState = usePlocState<IActivityValueDefinitionsState>(providerActivityValueDefinitionsListPloc);

    useEffect(() => {
        if (activityId) {
            providerActivityValueDefinitionsListPloc.loadDefinitions(activityId);
        }
    }, [activityId, providerActivityValueDefinitionsListPloc]);

    const handleCreateSuccess = () => {
        providerActivityValueDefinitionsListPloc.loadDefinitions(activityId);
    };

    const columns = [
        { key: 'name', label: 'Propiedad', width: '35%' },
        { key: 'type', label: 'Tipo', width: '20%' },
        { key: 'required', label: 'Obligatorio', width: '15%' },
        { key: 'unit', label: 'Unidad', width: '30%' },
    ];

    const rows = listState.definitions.map((def) => ({
        name: def.name || 'Sin nombre',
        type: (
            <span className={`${styles.badge} ${styles.badgeNeutral}`}>
                {def.valueType || 'TBD'}
            </span>
        ),
        required: (
            <span className={`${styles.badge} ${def.isRequired ? styles.badgeSuccess : styles.badgeNeutral}`}>
                {def.isRequired ? 'Sí' : 'No'}
            </span>
        ),
        unit: def.unit ? (
            <Text size="xs" color="secondary">
                {def.unit} {def.minValue && def.maxValue ? `(${def.minValue} - ${def.maxValue})` : ''}
            </Text>
        ) : '-',
    }));

    return (
        <div style={{ marginTop: '1.5rem', padding: '1.5rem', backgroundColor: 'var(--bento-color-surface-hover)', borderRadius: 'var(--bento-radius-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <Text size="md" weight="bold">
                    Propiedades para: {activityName}
                </Text>
                <ValueDefinitionCreate activityId={activityId} onSuccess={handleCreateSuccess} />
            </div>

            {listState.error && (
                <Text size="sm" style={{ color: 'var(--bento-color-danger)', marginBottom: '1rem' }}>
                    {listState.error.detail || 'Error al cargar propiedades'}
                </Text>
            )}

            <Table
                columns={columns}
                rows={rows}
                loading={listState.isLoading}
                emptyMessage="Esta actividad no tiene propiedades configurables extra."
            />
        </div>
    );
};
