import { useEffect, useState } from 'react';
import { useDependencies } from '../../../../Context/DependenciesProvider';
import { usePlocState } from '../../../../Hooks/usePlocState';
import type { IActivityLogsListState, ActivityLogResponse } from '../../../../../Domain';
import Button from '../../atoms/Button/Button';
import Text from '../../atoms/Text/Text';
import Icon from '../../atoms/Icon/Icon';
import Spinner from '../../atoms/Spinner/Spinner';
import Card from '../../atoms/Card/Card';
import { ActivityLogValuesForm } from './ActivityLogValuesForm';
import styles from './ActivityLogsList.module.css';

interface ActivityLogsListProps {
    activityId: string;
    activityName: string;
}

export const ActivityLogsList: React.FC<ActivityLogsListProps> = ({ activityId, activityName }) => {
    const { providerActivityLogsListPloc } = useDependencies();
    const state = usePlocState<IActivityLogsListState>(providerActivityLogsListPloc);
    const [selectedLogId, setSelectedLogId] = useState<string | null>(null);

    useEffect(() => {
        if (activityId) {
            providerActivityLogsListPloc.getLogs(activityId);
        }
    }, [activityId, providerActivityLogsListPloc]);

    const handleStartLog = () => {
        providerActivityLogsListPloc.startLog();
    };

    const handleStopLog = (logId: string) => {
        providerActivityLogsListPloc.stopLog(logId);
    };

    const formatTime = (isoString: string) => {
        return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (isoString: string) => {
        return new Date(isoString).toLocaleDateString();
    };

    const formatDuration = (minutes?: number | null) => {
        if (minutes == null) return '0m';
        const h = Math.floor(minutes / 60);
        const m = Math.floor(minutes % 60);
        return h > 0 ? `${h}h ${m}m` : `${m}m`;
    };

    const handleLogClick = (logId: string) => {
        setSelectedLogId(selectedLogId === logId ? null : logId);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.titleInfo}>
                    <Text size="lg" weight="bold">
                        Historial: {activityName}
                    </Text>
                    <Text size="sm" color="secondary">
                        Registra el tiempo y valores dedicados a esta actividad.
                    </Text>
                </div>
                <Button 
                    variant="primary" 
                    icon="Play" 
                    onClick={handleStartLog}
                    disabled={state.isLoading}
                >
                    Iniciar Actividad
                </Button>
            </div>

            {state.error && (
                <div className={styles.errorAlert}>
                    <Icon name="AlertCircle" size={20} color="var(--bento-color-error)" />
                    <Text style={{ color: 'var(--bento-color-error)' }}>{state.error.detail || 'Ocurrió un error al cargar el historial.'}</Text>
                </div>
            )}

            {state.isLoading && state.logs.length === 0 ? (
                <div className={styles.loadingState}>
                    <Spinner size="lg" />
                    <Text>Cargando registros...</Text>
                </div>
            ) : state.logs.length === 0 ? (
                <div className={styles.emptyState}>
                    <Icon name="Clock" size={48} color="var(--bento-color-gray-400)" />
                    <Text color="secondary" weight="medium">No hay registros recientes</Text>
                    <Text color="secondary" size="sm">
                        Presiona "Iniciar Actividad" para comenzar a traquear tu tiempo.
                    </Text>
                </div>
            ) : (
                <div className={styles.logsList}>
                    {state.logs.map((log: ActivityLogResponse) => {
                        const isRunning = !log.endedAt;
                        const isSelected = selectedLogId === log.id;
                        
                        return (
                            <Card 
                                key={log.id} 
                                className={`${styles.logCard} ${isRunning ? styles.logCardRunning : ''} ${isSelected ? styles.logCardSelected : ''}`}
                            >
                                <div className={styles.logSummary} onClick={() => handleLogClick(log.id)}>
                                    <div className={styles.logLeft}>
                                        <div className={`${styles.statusDot} ${isRunning ? styles.statusActive : ''}`} />
                                        <div className={styles.logDateInfo}>
                                            <Text weight="bold">{formatDate(log.startedAt)}</Text>
                                            <Text size="sm" color="secondary">
                                                {formatTime(log.startedAt)} - {log.endedAt ? formatTime(log.endedAt) : 'En curso'}
                                            </Text>
                                        </div>
                                    </div>
                                    
                                    <div className={styles.logRight}>
                                        <Text weight={isRunning ? 'bold' : 'medium'} style={{ color: isRunning ? 'var(--bento-color-primary)' : 'inherit' }}>
                                            {isRunning ? 'Activo' : formatDuration(log.durationMinutes)}
                                        </Text>
                                        {isRunning && (
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                icon="Square"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleStopLog(log.id);
                                                }}
                                                disabled={state.isLoading}
                                            >
                                                Detener
                                            </Button>
                                        )}
                                        <Icon 
                                            name={isSelected ? 'ChevronUp' : 'ChevronDown'} 
                                            size={20} 
                                            color="var(--bento-color-gray-500)" 
                                        />
                                    </div>
                                </div>

                                {isSelected && (
                                    <div className={styles.logDetails}>
                                        <div className={styles.logDetailsDivider} />
                                        <ActivityLogValuesForm logId={log.id} activityId={activityId} />
                                    </div>
                                )}
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
