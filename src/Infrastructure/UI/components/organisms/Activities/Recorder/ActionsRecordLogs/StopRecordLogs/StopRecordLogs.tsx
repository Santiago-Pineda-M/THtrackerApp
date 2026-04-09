import { useState, useEffect } from 'react'
import {
  Button,
  Icon,
  Modal,
  Text,
  Spinner,
  Input,
  ToggleSwitch,
  Label,
} from '../../../../../'
import { useDependencies } from '../../../../../../../Context/useDependencies'
import { usePlocState } from '../../../../../../../Hooks/usePlocState'
import type {
  IActiveActivityLogsState,
  IActivityLogStopState,
  IActivitiesListState,
} from '../../../../../../../../Domain/IStates'
import styles from '../SelectionModals.module.css'

export const StopRecordLogs = () => {
  const {
    providerActiveActivityLogsPloc,
    providerActivityLogStopPloc,
    providerActivitiesListPloc,
  } = useDependencies()

  const activeState = usePlocState<IActiveActivityLogsState>(
    providerActiveActivityLogsPloc
  )
  const stopState = usePlocState<IActivityLogStopState>(
    providerActivityLogStopPloc
  )
  const activitiesState = usePlocState<IActivitiesListState>(
    providerActivitiesListPloc
  )

  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false)
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false)
  const [formValues, setFormValues] = useState<Record<string, string | null>>(
    {}
  )
  const [selectedLog, setSelectedLog] = useState<{
    id: string
    activityName: string
  } | null>(null)

  useEffect(() => {
    if (isSelectionModalOpen) {
      providerActiveActivityLogsPloc.loadActiveLogs()
      providerActivitiesListPloc.loadActivities()
    }
  }, [
    isSelectionModalOpen,
    providerActiveActivityLogsPloc,
    providerActivitiesListPloc,
  ])

  useEffect(() => {
    if (stopState.success) {
      setTimeout(() => {
        setIsConfirmationModalOpen(false)
        setIsSelectionModalOpen(false)
        providerActiveActivityLogsPloc.loadActiveLogs()
        providerActivityLogStopPloc.reset()
      }, 0)
    }
  }, [
    stopState.success,
    providerActiveActivityLogsPloc,
    providerActivityLogStopPloc,
  ])

  const handleSelect = (logId: string, activityName: string) => {
    setSelectedLog({ id: logId, activityName })
    setIsSelectionModalOpen(false)
    setIsConfirmationModalOpen(true)
    setFormValues({})

    // Prepare the stop workflow which loads definitions for this activity
    const log = activeState.logs.find((l) => l.id === logId)
    if (log) {
      providerActivityLogStopPloc.prepareStop(log)
    }
  }

  const handleConfirm = () => {
    if (selectedLog) {
      const payload = Object.entries(formValues)
        .filter(
          ([value]) => value !== null && value !== undefined && value !== ''
        )
        .map(([id, value]) => ({
          valueDefinitionId: id,
          value: value as string,
        }))
      providerActivityLogStopPloc.stopAndSaveValues(selectedLog.id, payload)
    }
  }

  const isValidForm = stopState.definitions.every((def) => {
    if (!def.isRequired) return true
    const val = formValues[def.id]
    return val !== undefined && val !== null && val !== ''
  })

  const getLogActivityName = (activityId: string) => {
    const activity = activitiesState.activities.find((a) => a.id === activityId)
    return activity?.name || 'Actividad desconocida'
  }

  return (
    <>
      <Button
        variant='danger'
        size='lg'
        icon={<Icon name='Square' />}
        disabled={activeState.logs.length === 0}
        onClick={() => setIsSelectionModalOpen(true)}
      >
        Detener
      </Button>

      {/* Selection Modal */}
      <Modal
        isOpen={isSelectionModalOpen}
        onClose={() => setIsSelectionModalOpen(false)}
        title='Seleccionar Actividad a Detener'
      >
        <div className={styles.listContainer}>
          {activeState.isLoading ? (
            <div className={styles.emptyState}>
              <Spinner size='lg' />
              <Text>Cargando registros activos...</Text>
            </div>
          ) : activeState.logs.length > 0 ? (
            activeState.logs.map((log) => {
              const activityName = getLogActivityName(log.activityId)
              return (
                <div
                  key={log.id}
                  className={styles.listItem}
                  onClick={() => handleSelect(log.id, activityName)}
                >
                  <div className={styles.activityInfo}>
                    <Icon
                      name='Clock'
                      size={18}
                      color='var(--color-danger)'
                    />
                    <Text weight='medium'>{activityName}</Text>
                  </div>
                  <Icon
                    name='ChevronRight'
                    size={18}
                  />
                </div>
              )
            })
          ) : (
            <div className={styles.emptyState}>
              <Text>No hay actividades en curso para detener.</Text>
            </div>
          )}
        </div>
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        title='Confirmar Detención'
      >
        <div className={styles.confirmationBox}>
          <Text size='lg'>
            ¿Estás seguro de que quieres detener{' '}
            <Text
              as='span'
              weight='bold'
              color='danger'
            >
              "{selectedLog?.activityName}"
            </Text>
            ?
          </Text>

          {stopState.isLoadingDefinitions ? (
            <div
              style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}
            >
              <Spinner size='sm' />
              <Text size='sm'>Cargando valores requeridos...</Text>
            </div>
          ) : (
            stopState.definitions.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  width: '100%',
                  textAlign: 'left',
                }}
              >
                {stopState.definitions.map((def) => (
                  <div
                    key={def.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                    }}
                  >
                    <Label htmlFor={def.id}>
                      {def.name} {def.isRequired && '*'}
                    </Label>
                    {def.valueType === 'Boolean' ? (
                      <ToggleSwitch
                        checked={formValues[def.id] === 'true'}
                        onChange={(checked) =>
                          setFormValues((p) => ({
                            ...p,
                            [def.id]: checked.toString(),
                          }))
                        }
                      />
                    ) : (
                      <Input
                        id={def.id}
                        type={def.valueType === 'Number' ? 'number' : 'text'}
                        value={formValues[def.id] || ''}
                        onChange={(e) =>
                          setFormValues((p) => ({
                            ...p,
                            [def.id]: e.target.value,
                          }))
                        }
                        placeholder={
                          def.unit ? `Ej: x ${def.unit}` : `Ingresa ${def.name}`
                        }
                      />
                    )}
                  </div>
                ))}
              </div>
            )
          )}

          {stopState.error && (
            <Text color='danger'>
              {stopState.error.title || 'Error al detener actividad'}
            </Text>
          )}

          <div className={styles.confirmationActions}>
            <Button
              variant='ghost'
              onClick={() => {
                setIsConfirmationModalOpen(false)
                setIsSelectionModalOpen(true)
              }}
              disabled={stopState.isStopping}
            >
              Cambiar
            </Button>
            <Button
              variant='danger'
              onClick={handleConfirm}
              loading={stopState.isStopping}
              disabled={!isValidForm || stopState.isLoadingDefinitions}
            >
              Detener Registro
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
