import React, { useState } from 'react'
import { Button, Text, Modal, Icon } from '../../../../components'
import { useDependencies } from '../../../../../Context/useDependencies'
import { usePlocState } from '../../../../../Hooks/usePlocState'
import type { ApiTasksTypes } from '../../../../../../Domain'
import type { ITaskDeleteState } from '../../../../../../Domain/IStates'
import styles from './TaskDelete.module.scss'

interface TaskDeleteProps {
  task: ApiTasksTypes['TaskResponse']
  onSuccess?: () => void
}

export const TaskDelete: React.FC<TaskDeleteProps> = ({ task, onSuccess }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { providerTaskDeletePloc } = useDependencies()
  const state = usePlocState<ITaskDeleteState>(providerTaskDeletePloc)

  const handleOpen = () => {
    providerTaskDeletePloc.reset()
    setIsModalOpen(true)
  }

  const handleClose = () => {
    setIsModalOpen(false)
    if (state.success) {
      onSuccess?.()
    }
    providerTaskDeletePloc.reset()
  }

  const handleDelete = async () => {
    await providerTaskDeletePloc.deleteTask({ id: task.id! })
  }

  return (
    <>
      <Button
        variant='danger'
        size='sm'
        onClick={handleOpen}
      >
        <Icon
          name='Trash2'
          size={14}
        />
      </Button>

      <Modal
        isOpen={isModalOpen}
        onClose={handleClose}
        title={state.success ? '¡Éxito!' : 'Eliminar Tarea'}
      >
        {state.success ? (
          <div className={styles['success-container']}>
            <Text>La tarea se ha eliminado con éxito.</Text>
            <div className={styles['success-actions']}>
              <Button onClick={handleClose}>Cerrar</Button>
            </div>
          </div>
        ) : (
          <div className={styles['modal-content']}>
            {state.errors && (
              <Text
                size='sm'
                style={{
                  color: 'var(--danger-color, #ff4d4f)',
                  marginBottom: '16px',
                  display: 'block',
                }}
              >
                {state.errors?.[0] ||
                  'Ha ocurrido un error al eliminar la tarea.'}
              </Text>
            )}

            <Text className={styles['modal-text']}>
              ¿Estás seguro de que deseas eliminar la tarea{' '}
              <strong>{task.content}</strong>?
            </Text>

            <div className={styles['modal-actions']}>
              <Button
                variant='secondary'
                loading={state.isLoading}
                disabled={state.isLoading}
                onClick={handleClose}
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
