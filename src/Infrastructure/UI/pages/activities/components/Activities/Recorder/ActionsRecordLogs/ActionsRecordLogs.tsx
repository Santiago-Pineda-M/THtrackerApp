import styles from './ActionsRecordLogs.module.scss'
import { ChronometerRecordLogs } from './ChronometerRecordLogs/ChronometerRecordLogs'
import { StartRecordLogs } from './StartRecordLogs/StartRecordLogs'
import { StopRecordLogs } from './StopRecordLogs/StopRecordLogs'
import { Card, Spinner, Text } from '../../../../../../components'
import { useDependencies } from '../../../../../../../Context/useDependencies'
import { usePlocState } from '../../../../../../../Hooks/usePlocState'
import type { IActiveActivityLogsState } from '../../../../../../../../Domain/IStates'
import { useEffect } from 'react'

export const ActionsRecordLogs = () => {
  const { providerActiveActivityLogsPloc } = useDependencies()
  const state = usePlocState<IActiveActivityLogsState>(
    providerActiveActivityLogsPloc
  )

  useEffect(() => {
    providerActiveActivityLogsPloc.loadActiveLogs()
  }, [providerActiveActivityLogsPloc])

  const renderContent = () => {
    if (state.isLoading && state.logs.length === 0) {
      return (
        <div className={styles.stateContainer}>
          <Spinner size='lg' />
          <Text size='sm'>Cargando registros activos...</Text>
        </div>
      )
    }

    if (state.error) {
      return (
        <div className={styles.stateContainer}>
          <Text
            className={styles.errorText}
            weight='medium'
          >
            {state.error.title || 'Error al cargar registros'}
          </Text>
          <Text size='xs'>{state.error.detail}</Text>
        </div>
      )
    }

    if (state.logs.length === 0) {
      return (
        <div className={styles.container}>
          <StartRecordLogs />
          <Text
            className={styles.emptyText}
            size='sm'
          >
            No hay actividades en curso.
          </Text>
        </div>
      )
    }

    return (
      <div className={styles.container}>
        <StartRecordLogs />
        <ChronometerRecordLogs log={state.logs[0]} />
        <StopRecordLogs />
      </div>
    )
  }

  return (
    <Card
      className={styles.card}
      h={1}
      w={4}
    >
      {renderContent()}
    </Card>
  )
}
