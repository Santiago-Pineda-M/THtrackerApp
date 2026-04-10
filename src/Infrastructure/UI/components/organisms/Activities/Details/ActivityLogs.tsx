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
  const { providerActivityLogsListPloc, providerDateProvider } =
    useDependencies()
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
                    {providerDateProvider.formatDate(
                      providerDateProvider.parse(log.startedAt)
                    )}{' '}
                    {providerDateProvider.formatTime(
                      providerDateProvider.parse(log.startedAt)
                    )}
                  </Text>
                  {log.endedAt && (
                    <Text
                      size='xs'
                      color='secondary'
                    >
                      Fin:{' '}
                      {providerDateProvider.formatTime(
                        providerDateProvider.parse(log.endedAt)
                      )}
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
