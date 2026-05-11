import React, { useState } from 'react'
import { Button, Text, Modal, Icon } from '../../../../components'
import { useDependencies } from '../../../../../Context/useDependencies'
import { usePlocState } from '../../../../../Hooks/usePlocState'
import type { ApiTasksTypes } from '../../../../../../Domain'
import type { ITaskListDeleteState } from '../../../../../../Domain/IStates'
import styles from './TaskListDelete.module.scss'

interface TaskListDeleteProps {
  taskList: ApiTasksTypes['TaskResponse']
  onSuccess?: () => void
}

export const TaskListDelete: React.FC<TaskListDeleteProps> = ({
  taskList,
  onSuccess,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { providerTaskListDeletePloc, providerTaskListsPloc } =
    useDependencies()
  const state = usePlocState<ITaskListDeleteState>(providerTaskListDeletePloc)

  const handleOpen = () => {
    providerTaskListDeletePloc.reset()
    setIsModalOpen(true)
  }

  const handleClose = () => {
    setIsModalOpen(false)
    if (state.success) {
      providerTaskListsPloc.loadTaskLists()
      if (onSuccess) onSuccess()
    }
    providerTaskListDeletePloc.reset()
  }

  const handleDelete = async () => {
    await providerTaskListDeletePloc.deleteTaskList(taskList.id!)
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
          size={16}
        />
      </Button>

      <Modal
        isOpen={isModalOpen}
        onClose={handleClose}
        title={state.success ? '¡Éxito!' : 'Eliminar Lista de Tareas'}
      >
        {state.success ? (
          <div className={styles['success-container']}>
            <Text>La lista de tareas se ha eliminado con éxito.</Text>
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
                {state.errors?.toString()}
              </Text>
            )}

            <Text className={styles['modal-text']}>
              ¿Estás seguro de que deseas eliminar la lista de tareas{' '}
              <strong>{taskList.content}</strong>?
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
