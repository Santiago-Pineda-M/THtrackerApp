import React, { useEffect } from 'react'
import { Card, Spinner, Text, Badge, Icon } from '../../../atoms'
import { useDependencies } from '../../../../../Context/useDependencies'
import { usePlocState } from '../../../../../Hooks/usePlocState'
import type { IActivityLogsListState } from '../../../../../../Domain/IStates'
import styles from './ActivityLogs.module.css'

interface ActivityLogsProps {
  activityId: string
}

export const ActivityLogs: React.FC<ActivityLogsProps> = ({ activityId }) => {
  const { providerActivityLogsListPloc } = useDependencies()
  const state = usePlocState<IActivityLogsListState>(
    providerActivityLogsListPloc
  )

  useEffect(() => {
    providerActivityLogsListPloc.getLogs(activityId)
  }, [activityId, providerActivityLogsListPloc])

  return (
    <Card
      title='Historial de Registros'
      h={3}
      w={3}
    >
      <div className={styles.container}>
        {state.isLoading ? (
          <div className={styles.loadingContainer}>
            <Spinner size='md' />
          </div>
        ) : state.logs.length > 0 ? (
          <div className={styles.list}>
            {state.logs.map((log) => (
              <div
                key={log.id}
                className={styles.logItem}
              >
                <div className={styles.timeInfo}>
                  <Text weight='medium'>
                    {new Date(log.startedAt).toLocaleDateString()}{' '}
                    {new Date(log.startedAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                  {log.endedAt && (
                    <Text
                      size='xs'
                      color='secondary'
                    >
                      Fin:{' '}
                      {new Date(log.endedAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  )}
                </div>
                <div className={styles.statusContainer}>
                  <Badge variant={log.durationMinutes ? 'default' : 'success'}>
                    {log.durationMinutes
                      ? `${log.durationMinutes} min`
                      : 'En curso'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <Icon
                name='Clock'
                size={48}
              />
            </div>
            <Text>Aún no hay registros para esta actividad.</Text>
          </div>
        )}
      </div>
    </Card>
  )
}

export default ActivityLogs
