import { useEffect, useMemo } from 'react'
import styles from './ActionsRecordLogs.module.scss'
import { ChronometerRecordLogs } from './ChronometerRecordLogs/ChronometerRecordLogs'
import { StartRecordLogs } from './StartRecordLogs/StartRecordLogs'
import { StopRecordLogs } from './StopRecordLogs/StopRecordLogs'
import { Card, Spinner, Text } from '../../../../../../components'
import { useDependencies } from '../../../../../../../Context/useDependencies'
import { usePlocState } from '../../../../../../../Hooks/usePlocState'
import type { IActiveActivityLogsState } from '../../../../../../../../Domain/IStates'

export const ActionsRecordLogs = () => {
  const { providerActiveActivityLogsPloc } = useDependencies()
  const state = usePlocState<IActiveActivityLogsState>(
    providerActiveActivityLogsPloc
  )

  useEffect(() => {
    providerActiveActivityLogsPloc.loadActiveLogs()
  }, [providerActiveActivityLogsPloc])

  // Indicador seguro de "sin datos": undefined o array vacío
  const hasNoData = !state.logs?.items || state.logs.items.length === 0
  const errorMessage = useMemo(() => {
    if (!state.errors) return ''
    return Object.values(state.errors).join(', ')
  }, [state.errors])

  // Renderizado condicional con early returns
  return (
    <Card
      className={styles.card}
      h={1}
      w={4}
    >
      {/* 1. Carga inicial con spinner */}
      {state.isLoading && hasNoData && (
        <div className={styles.stateContainer}>
          <Spinner size='lg' />
          <Text size='sm'>Cargando registros activos...</Text>
        </div>
      )}

      {/* 2. Error */}
      {!state.isLoading && errorMessage && (
        <div className={styles.stateContainer}>
          <Text
            className={styles.errorText}
            weight='medium'
          >
            {errorMessage}
          </Text>
        </div>
      )}

      {/* 3. Sin registros activos (sin error y sin cargando) */}
      {!state.isLoading && !errorMessage && hasNoData && (
        <div className={styles.container}>
          <StartRecordLogs />
          <Text
            className={styles.emptyText}
            size='sm'
          >
            No hay actividades en curso.
          </Text>
        </div>
      )}

      {/* 4. Con registros activos */}
      {!state.isLoading && !errorMessage && !hasNoData && (
        <div className={styles.container}>
          <StartRecordLogs />
          <ChronometerRecordLogs log={state.logs!.items![0]} />
          <StopRecordLogs />
        </div>
      )}
    </Card>
  )
}
