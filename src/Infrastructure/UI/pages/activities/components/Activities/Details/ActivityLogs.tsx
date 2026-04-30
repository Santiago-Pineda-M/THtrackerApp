import React, { useEffect, useState } from 'react'
import { Card, Spinner, Text, Badge } from '../../../../../components/atoms'
import { Modal } from '../../../../../components/molecules'
import { useDependencies } from '../../../../../../Context/useDependencies'
import { usePlocState } from '../../../../../../Hooks/usePlocState'
import type { IActivityLogsListState } from '../../../../../../../Domain/IStates'
import type { ActivityLogResponse } from '../../../../../../../Domain'
import styles from './ActivityLogs.module.scss'

interface ActivityLogsProps {
  activityId: string
}

interface LogDetailData {
  log: ActivityLogResponse
  formattedStartDate: string
  formattedStartTime: string
  formattedEndTime: string | null
  formattedDuration: string
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

function parseDurationToUnits(
  minutes: number | null
): { hours: number; minutes: number; seconds: number } | null {
  if (!minutes) return null
  const totalSeconds = Math.round(minutes * 60)
  const hours = Math.floor(totalSeconds / 3600)
  const mins = Math.floor((totalSeconds % 3600) / 60)
  const secs = totalSeconds % 60
  return { hours, minutes: mins, seconds: secs }
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
    const startDate = providerDateProvider.parse(log.startedAt)
    const endDate = log.endedAt ? providerDateProvider.parse(log.endedAt) : null

    setSelectedLog({
      log,
      formattedStartDate: providerDateProvider.formatDate(startDate),
      formattedStartTime: providerDateProvider.formatTime(startDate),
      formattedEndTime: endDate
        ? providerDateProvider.formatTime(endDate)
        : null,
      formattedDuration: formatDuration(log.durationMinutes),
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
        ) : state.logs.length === 0 ? (
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
                {state.logs.map((log) => {
                  const startDate = providerDateProvider.parse(log.startedAt)
                  const endDate = log.endedAt
                    ? providerDateProvider.parse(log.endedAt)
                    : null

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
                        <Text size='sm'>
                          {formatDuration(log.durationMinutes)}
                        </Text>
                      </td>
                      <td>
                        <Badge
                          variant={log.durationMinutes ? 'default' : 'success'}
                        >
                          {log.durationMinutes ? 'Completado' : 'En curso'}
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
              <Badge
                variant={
                  selectedLog.log.durationMinutes ? 'default' : 'success'
                }
              >
                {selectedLog.log.durationMinutes
                  ? (() => {
                      const d = parseDurationToUnits(
                        selectedLog.log.durationMinutes
                      )
                      if (!d) return selectedLog.formattedDuration
                      const pad = (n: number) => n.toString().padStart(2, '0')
                      return `${pad(d.hours)}:${pad(d.minutes)}:${pad(d.seconds)}`
                    })()
                  : 'En curso'}
              </Badge>
            </div>
            {selectedLog.log.values && selectedLog.log.values.length > 0 && (
              <div className={styles.valuesSection}>
                <Text
                  weight='medium'
                  className={styles.valuesTitle}
                >
                  Valores registrados:
                </Text>
                <div className={styles.valuesList}>
                  {selectedLog.log.values.map((value) => (
                    <div
                      key={value.id}
                      className={styles.valueItem}
                    >
                      <Text
                        size='sm'
                        color='secondary'
                      >
                        ID: {value.valueDefinitionId}
                      </Text>
                      <Text size='sm'>Valor: {value.value || 'Sin valor'}</Text>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  )
}

export default ActivityLogs
