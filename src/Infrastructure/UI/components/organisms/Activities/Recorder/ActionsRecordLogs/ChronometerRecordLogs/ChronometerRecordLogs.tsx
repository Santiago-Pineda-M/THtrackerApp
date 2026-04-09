import { useDependencies } from '../../../../../../../Context/useDependencies'
import { usePlocState } from '../../../../../../../Hooks/usePlocState'
import { useEffect } from 'react'
import type {
  IActivityDetailState,
  ActivityLogResponse,
} from '../../../../../../../../Domain'
import { Chronometer, Text, Spinner } from '../../../../../'

export const ChronometerRecordLogs = ({
  log,
}: {
  log: ActivityLogResponse
}) => {
  const { providerActivityDetailPloc } = useDependencies()
  const state = usePlocState<IActivityDetailState>(providerActivityDetailPloc)

  useEffect(() => {
    providerActivityDetailPloc.loadActivity(log.activityId)
  }, [log.activityId, providerActivityDetailPloc])

  if (state.isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Spinner size='sm' />
        <Text size='sm'>Cargando actividad...</Text>
      </div>
    )
  }

  if (state.error) {
    return (
      <Text
        size='sm'
        color='danger'
      >
        Error al cargar
      </Text>
    )
  }

  return (
    <div>
      <Text
        size='sm'
        weight='medium'
        color='secondary'
      >
        {state.activity?.name || 'Actividad desconocida'}
      </Text>
      <Chronometer
        time={new Date(
          log.startedAt.endsWith('Z') ? log.startedAt : `${log.startedAt}Z`
        ).getTime()}
        textProps={{
          size: 'lg',
          weight: 'bold',
        }}
      />
    </div>
  )
}
