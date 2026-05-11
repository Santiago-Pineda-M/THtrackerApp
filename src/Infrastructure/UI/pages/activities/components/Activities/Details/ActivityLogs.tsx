import React, { useEffect, useState } from 'react'
import { Card, Spinner, Text, Badge } from '../../../../../components/atoms'
import { Modal } from '../../../../../components/molecules'
import { useDependencies } from '../../../../../../Context/useDependencies'
import { usePlocState } from '../../../../../../Hooks/usePlocState'
import type { IActivityLogsListState } from '../../../../../../../Domain/IStates'
import type { ApiActivityLogsTypes } from '../../../../../../../Domain'
import styles from './ActivityLogs.module.scss'

type ActivityLogResponse = ApiActivityLogsTypes['ActivityLogResponse']

interface ActivityLogsProps {
  activityId: string
}

interface LogDetailData {
  log: ActivityLogResponse
  formattedStartDate: string
  formattedStartTime: string
  formattedEndTime: string | null
  durationMinutes: number | null
}

function formatDuration(minutes: number | null): string {
  if (!minutes) return '-'

  const totalSeconds = Math.round(minutes * 60)
  const hours = Math.floor(totalSeconds / 3600)
  const mins = Math.floor((totalSeconds % 3600) / 60)
  const secs = totalSeconds % 60

  const pad = (n: number) => n.toString().padStart(2, '0')

  if (hours > 0) {
    return `${pad(hours)}:${pad(mins)}:${pad(secs)}`
  }
  return `${pad(mins)}:${pad(secs)}`
}

function calculateDurationMinutes(
  startedAt: string,
  endedAt: string | null,
  now: Date
): number | null {
  const start = new Date(startedAt)
  const end = endedAt ? new Date(endedAt) : now
  const diffMs = end.getTime() - start.getTime()
  if (diffMs < 0) return null
  return diffMs / 60000
}

export const ActivityLogs: React.FC<ActivityLogsProps> = ({ activityId }) => {
  const { providerActivityLogsListPloc, providerDateProvider } =
    useDependencies()
  const state = usePlocState<IActivityLogsListState>(
    providerActivityLogsListPloc
  )
  const [selectedLog, setSelectedLog] = useState<LogDetailData | null>(null)

  useEffect(() => {
    providerActivityLogsListPloc.getLogs(activityId)
  }, [activityId, providerActivityLogsListPloc])

  const handleLogClick = (log: ActivityLogResponse) => {
    if (!log.startedAt || !log.id) return
    const startDate = providerDateProvider.parse(log.startedAt)
    const endDate = log.endedAt ? providerDateProvider.parse(log.endedAt) : null
    const durationMinutes = calculateDurationMinutes(
      log.startedAt,
      log.endedAt ?? null,
      providerDateProvider.now()
    )

    setSelectedLog({
      log,
      formattedStartDate: providerDateProvider.formatDate(startDate),
      formattedStartTime: providerDateProvider.formatTime(startDate),
      formattedEndTime: endDate
        ? providerDateProvider.formatTime(endDate)
        : null,
      durationMinutes,
    })
  }

  const columns = [
    { key: 'date', label: 'Fecha', width: '120px' },
    { key: 'startTime', label: 'Inicio', width: '80px' },
    { key: 'endTime', label: 'Fin', width: '80px' },
    { key: 'duration', label: 'Duración', width: '100px' },
    { key: 'status', label: 'Estado', width: '100px' },
  ]

  return (
    <>
      <Card
        title='Historial de Registros'
        h={3}
        w={3}
      >
        {state.isLoading ? (
          <div className={styles.loadingContainer}>
            <Spinner size='md' />
          </div>
        ) : !state.logs?.items || state.logs.items.length === 0 ? (
          <div className={styles.emptyState}>
            <Text>Aún no hay registros para esta actividad.</Text>
          </div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  {columns.map((c) => (
                    <th
                      key={c.key}
                      style={c.width ? { width: c.width } : undefined}
                    >
                      {c.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {state.logs.items.map((log) => {
                  if (!log.startedAt || !log.id) return null
                  const startDate = providerDateProvider.parse(log.startedAt)
                  const endDate = log.endedAt
                    ? providerDateProvider.parse(log.endedAt)
                    : null
                  const durationMinutes = calculateDurationMinutes(
                    log.startedAt,
                    log.endedAt ?? null,
                    providerDateProvider.now()
                  )

                  return (
                    <tr
                      key={log.id}
                      onClick={() => handleLogClick(log)}
                    >
                      <td>
                        <Text size='sm'>
                          {providerDateProvider.formatDate(startDate)}
                        </Text>
                      </td>
                      <td>
                        <Text size='sm'>
                          {providerDateProvider.formatTime(startDate)}
                        </Text>
                      </td>
                      <td>
                        <Text size='sm'>
                          {endDate
                            ? providerDateProvider.formatTime(endDate)
                            : '-'}
                        </Text>
                      </td>
                      <td>
                        <Text size='sm'>{formatDuration(durationMinutes)}</Text>
                      </td>
                      <td>
                        <Badge variant={log.endedAt ? 'default' : 'success'}>
                          {log.endedAt ? 'Completado' : 'En curso'}
                        </Badge>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal
        isOpen={!!selectedLog}
        onClose={() => setSelectedLog(null)}
        title='Detalle del Registro'
      >
        {selectedLog && (
          <div className={styles.modalContent}>
            <div className={styles.detailRow}>
              <Text weight='medium'>Fecha:</Text>
              <Text>{selectedLog.formattedStartDate}</Text>
            </div>
            <div className={styles.detailRow}>
              <Text weight='medium'>Hora de inicio:</Text>
              <Text>{selectedLog.formattedStartTime}</Text>
            </div>
            <div className={styles.detailRow}>
              <Text weight='medium'>Hora de fin:</Text>
              <Text>{selectedLog.formattedEndTime || 'En curso'}</Text>
            </div>
            <div className={styles.detailRow}>
              <Text weight='medium'>Duración:</Text>
              <Badge variant={selectedLog.log.endedAt ? 'default' : 'success'}>
                {selectedLog.log.endedAt
                  ? formatDuration(selectedLog.durationMinutes)
                  : 'En curso'}
              </Badge>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}

export default ActivityLogs
