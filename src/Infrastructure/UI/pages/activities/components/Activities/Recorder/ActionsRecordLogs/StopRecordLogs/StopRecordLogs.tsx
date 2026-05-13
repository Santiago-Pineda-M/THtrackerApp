import { useState } from 'react'
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
import styles from './StopRecordLogs.module.scss'

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

  const handleOpenSelection = () => {
    setIsSelectionModalOpen(true)
  }

  const handleSelect = (logId: string, activityName: string) => {
    setSelectedLog({ id: logId, activityName })
    setIsSelectionModalOpen(false)
    setIsConfirmationModalOpen(true)
    setFormValues({})

    const log = activeState.logs?.items?.find((l) => l.id === logId)
    if (log) {
      providerActivityLogStopPloc.prepareStop(log)
    }
  }

  const handleConfirm = () => {
    if (selectedLog) {
      const items = Object.entries(formValues)
        .filter(
          ([, value]) => value !== null && value !== undefined && value !== ''
        )
        .map(([id, value]) => ({
          id,
          value: value as string,
        }))
      providerActivityLogStopPloc.stopAndSaveValues(selectedLog.id, { items })
      // errors es un diccionario de errores
      const errors = stopState.errors
      if (Object.keys(errors).length === 0) {
        providerActiveActivityLogsPloc.loadActiveLogs()
      }
      providerActivityLogStopPloc.reset()
    }
  }

  const isValidForm = stopState.definitions?.items?.every((def) => {
    if (!def.isRequired) return true
    if (!def.id) return true
    const val = formValues[def.id]
    return val !== undefined && val !== null && val !== ''
  })

  const getLogActivityName = (activityId: string | undefined) => {
    if (!activityId) return 'Actividad desconocida'
    const activity = activitiesState.activities?.items?.find(
      (a) => a.id === activityId
    )
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
        disabled={
          !activeState.logs?.items || activeState.logs.items.length === 0
        }
        onClick={() => handleOpenSelection()}
        className={styles.btn}
      />

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
          ) : activeState.logs?.items && activeState.logs.items.length > 0 ? (
            activeState.logs.items.map((log) => {
              if (!log.id || !log.activityId) return null
              const activityName = getLogActivityName(log.activityId)
              return (
                <div
                  key={log.id}
                  className={styles.listItem}
                  onClick={() => handleSelect(log.id!, activityName)}
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
            <div className={styles.loadingRow}>
              <Spinner size='sm' />
              <Text size='sm'>Cargando valores requeridos...</Text>
            </div>
          ) : (
            stopState.definitions?.items &&
            stopState.definitions.items.length > 0 && (
              <div className={styles.formContainer}>
                {stopState.definitions.items.map((def) => {
                  if (!def.id) return null
                  return (
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
                              [def.id!]: checked.toString(),
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
                              [def.id!]: e.target.value,
                            }))
                          }
                          placeholder={
                            def.unit
                              ? `Ej: x ${def.unit}`
                              : `Ingresa ${def.name}`
                          }
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            )
          )}

          {stopState.errors && (
            <Text color='danger'>
              {stopState.errors?.title || 'Error al detener actividad'}
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
