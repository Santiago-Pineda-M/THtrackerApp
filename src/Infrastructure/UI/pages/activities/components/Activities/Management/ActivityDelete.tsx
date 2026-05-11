import React, { useState } from 'react'
import { Button, Text, Modal, Icon } from '../../../../../components'
import { useDependencies } from '../../../../../../Context/useDependencies'
import { usePlocState } from '../../../../../../Hooks/usePlocState'
import type { IActivityDeleteState } from '../../../../../../../Domain/IStates'
import styles from './ActivityForm.module.scss'

interface ActivityDeleteProps {
  activityId: string
  activityName: string
}

export const ActivityDelete: React.FC<ActivityDeleteProps> = ({
  activityId,
  activityName,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { providerActivityDeletePloc, providerActivitiesListPloc } =
    useDependencies()
  const state = usePlocState<IActivityDeleteState>(providerActivityDeletePloc)

  const handleOpen = () => {
    providerActivityDeletePloc.reset()
    setIsModalOpen(true)
  }

  const handleClose = () => {
    setIsModalOpen(false)
    if (state.success) {
      providerActivitiesListPloc.loadActivities()
    }
    providerActivityDeletePloc.reset()
  }

  const handleDelete = async () => {
    await providerActivityDeletePloc.deleteActivity(activityId)
  }

  return (
    <>
      <Button
        variant='danger'
        size='md'
        onClick={handleOpen}
        title='Eliminar Actividad'
      >
        <Icon
          name='Trash2'
          size={16}
        />
      </Button>

      <Modal
        isOpen={isModalOpen}
        onClose={handleClose}
        title={state.success ? '¡Éxito!' : 'Eliminar Actividad'}
      >
        {state.success ? (
          <div className={styles.successContainer}>
            <Text>La actividad se ha eliminado con éxito.</Text>
            <div className={styles.successActions}>
              <Button onClick={handleClose}>Cerrar</Button>
            </div>
          </div>
        ) : (
          <div className={styles.modalContent}>
            {state.errors && (
              <Text
                size='sm'
                className={styles.errorMessage}
                style={{
                  color: '#ef4444',
                }}
              >
                {state.errors?.[0] || 'Error al eliminar la actividad.'}
              </Text>
            )}

            <Text className={styles.modalText}>
              ¿Estás seguro de que deseas eliminar la actividad{' '}
              <strong>{activityName}</strong>? Esta acción no se puede deshacer.
            </Text>

            <div className={styles.modalActions}>
              <Button
                variant='ghost'
                onClick={handleClose}
                disabled={state.isLoading}
              >
                Cancelar
              </Button>
              <Button
                variant='danger'
                onClick={handleDelete}
                loading={state.isLoading}
              >
                Eliminar permanentemente
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}
