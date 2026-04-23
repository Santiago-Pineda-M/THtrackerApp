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
} from '../../../../../../../components'
import { useDependencies } from '../../../../../../../../Context/useDependencies'
import { usePlocState } from '../../../../../../../../Hooks/usePlocState'
import type {
  IActiveActivityLogsState,
  IActivityLogStopState,
  IActivitiesListState,
} from '../../../../../../../../../Domain/IStates'
import styles from './StopRecordLogs.module.css'

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
        icon={
          <Icon
            size={45}
            name='Square'
          />
        }
        disabled={activeState.logs.length === 0}
        onClick={() => setIsSelectionModalOpen(true)}
        className={styles.btn}
      ></Button>

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
        title='Confirmar DetenciÃ³n'
      >
        <div className={styles.confirmationBox}>
          <Text size='lg'>
            Â¿EstÃ¡s seguro de que quieres detener{' '}
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
            <div className={styles.loadingRow}>
              <Spinner size='sm' />
              <Text size='sm'>Cargando valores requeridos...</Text>
            </div>
          ) : (
            stopState.definitions.length > 0 && (
              <div className={styles.formContainer}>
                {stopState.definitions.map((def) => (
                  <div
                    key={def.id}
                    className={styles.formField}
                  >
                    <Label htmlFor={def.id}>
                      {def.name} {def.isRequired && '*'}
                    </Label>
                    {def.valueType === 'Boolean' ? (
                      <ToggleSwitch
                        checked={formValues[def.id] === 'true'}
                        onChange={(checked: boolean) =>
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
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
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
