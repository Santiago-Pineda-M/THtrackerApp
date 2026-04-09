import { useState, useEffect } from 'react'
import { Button, Icon, Modal, Text, Spinner } from '../../../../../'
import { useDependencies } from '../../../../../../../Context/useDependencies'
import { usePlocState } from '../../../../../../../Hooks/usePlocState'
import type {
  IActivitiesListState,
  IActiveActivityLogsState,
  IActivityLogStartState,
} from '../../../../../../../../Domain/IStates'
import styles from '../SelectionModals.module.css'

export const StartRecordLogs = () => {
  const {
    providerActivitiesListPloc,
    providerActiveActivityLogsPloc,
    providerActivityLogStartPloc,
  } = useDependencies()

  const listState = usePlocState<IActivitiesListState>(
    providerActivitiesListPloc
  )
  const activeState = usePlocState<IActiveActivityLogsState>(
    providerActiveActivityLogsPloc
  )
  const startState = usePlocState<IActivityLogStartState>(
    providerActivityLogStartPloc
  )

  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false)
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<{
    id: string
    name: string | null
    color: string | null
  } | null>(null)

  useEffect(() => {
    if (isSelectionModalOpen) {
      providerActivitiesListPloc.loadActivities()
    }
  }, [isSelectionModalOpen, providerActivitiesListPloc])

  useEffect(() => {
    if (startState.success) {
      setTimeout(() => {
        setIsConfirmationModalOpen(false)
        setIsSelectionModalOpen(false)
        providerActiveActivityLogsPloc.loadActiveLogs()
        providerActivityLogStartPloc.reset()
      }, 0)
    }
  }, [
    startState.success,
    providerActiveActivityLogsPloc,
    providerActivityLogStartPloc,
  ])

  // Filter activities that are NOT currently active
  const inactiveActivities = listState.activities.filter(
    (activity) =>
      !activeState.logs.some((log) => log.activityId === activity.id)
  )

  const handleSelect = (activity: (typeof inactiveActivities)[0]) => {
    setSelectedActivity({
      id: activity.id,
      name: activity.name,
      color: activity.color,
    })
    setIsSelectionModalOpen(false)
    setIsConfirmationModalOpen(true)
  }

  const handleConfirm = () => {
    if (selectedActivity) {
      providerActivityLogStartPloc.startLog(selectedActivity.id)
    }
  }

  return (
    <>
      <Button
        variant='ghost'
        size='lg'
        icon={<Icon name='Play' />}
        onClick={() => setIsSelectionModalOpen(true)}
      >
        Iniciar
      </Button>

      {/* Selection Modal */}
      <Modal
        isOpen={isSelectionModalOpen}
        onClose={() => setIsSelectionModalOpen(false)}
        title='Seleccionar Actividad'
      >
        <div className={styles.listContainer}>
          {listState.isLoading ? (
            <div className={styles.emptyState}>
              <Spinner size='lg' />
              <Text>Cargando actividades...</Text>
            </div>
          ) : inactiveActivities.length > 0 ? (
            inactiveActivities.map((activity) => (
              <div
                key={activity.id}
                className={styles.listItem}
                onClick={() => handleSelect(activity)}
              >
                <div className={styles.activityInfo}>
                  <div
                    className={styles.colorDot}
                    style={{
                      color: activity.color || 'var(--color-primary)',
                      backgroundColor: activity.color || 'var(--color-primary)',
                    }}
                  />
                  <Text weight='medium'>{activity.name}</Text>
                </div>
                <Icon
                  name='ChevronRight'
                  size={18}
                />
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>
              <Text>No hay actividades disponibles para iniciar.</Text>
            </div>
          )}
        </div>
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        title='Confirmar Inicio'
      >
        <div className={styles.confirmationBox}>
          <Text size='lg'>
            ¿Estás seguro de que quieres iniciar{' '}
            <Text
              as='span'
              weight='bold'
              color='primary'
            >
              "{selectedActivity?.name}"
            </Text>
            ?
          </Text>

          {startState.error && (
            <Text color='danger'>
              {startState.error.title || 'Error al iniciar actividad'}
            </Text>
          )}

          <div className={styles.confirmationActions}>
            <Button
              variant='ghost'
              onClick={() => {
                setIsConfirmationModalOpen(false)
                setIsSelectionModalOpen(true)
              }}
              disabled={startState.isLoading}
            >
              Cambiar
            </Button>
            <Button
              variant='primary'
              onClick={handleConfirm}
              loading={startState.isLoading}
            >
              Iniciar Registro
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
