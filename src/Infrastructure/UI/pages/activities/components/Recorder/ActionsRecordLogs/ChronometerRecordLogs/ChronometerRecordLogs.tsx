import { useDependencies } from '../../../../../../../Context/useDependencies'
import { usePlocState } from '../../../../../../../Hooks/usePlocState'
import { useEffect } from 'react'
import type {
  IActivityDetailState,
  ActivityLogResponse,
} from '../../../../../../../../Domain'
import { Chronometer, Text, Spinner } from '../../../../../../components'
import styles from './ChronometerRecordLogs.module.css'

export const ChronometerRecordLogs = ({
  log,
}: {
  log: ActivityLogResponse
}) => {
  const { providerActivityDetailPloc, providerDateProvider } = useDependencies()
  const state = usePlocState<IActivityDetailState>(providerActivityDetailPloc)

  useEffect(() => {
    providerActivityDetailPloc.loadActivity(log.activityId)
  }, [log.activityId, providerActivityDetailPloc])

  if (state.isLoading) {
    return (
      <div className={styles.loadingRow}>
        <Spinner size='sm' />
        <Text size='sm'>Cargando actividad...</Text>
      </div>
    )
  }

  if (state.error) {
    return (
      <Text
        size='lg'
        color='danger'
      >
        Error al cargar
      </Text>
    )
  }

  return (
    <div className={styles.container}>
      <Text
        as='h2'
        size='lg'
        weight='medium'
        color='secondary'
        className={styles.activityName}
      >
        {state.activity?.name || 'Actividad desconocida'}
      </Text>
      <Chronometer
        time={providerDateProvider.parse(log.startedAt).getTime()}
        textProps={{
          size: 'lg',
          weight: 'bold',
          className: styles.chronometerWrapper,
        }}
      />
    </div>
  )
}
