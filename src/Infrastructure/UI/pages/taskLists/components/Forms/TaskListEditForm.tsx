import React, { useState } from 'react'
import {
  Button,
  Text,
  Modal,
  Input,
  FormField,
  Icon,
} from '../../../../components'
import { useDependencies } from '../../../../../Context/useDependencies'
import { usePlocState } from '../../../../../Hooks/usePlocState'
import type { ApiTasksTypes } from '../../../../../../Domain'
import type { ITaskListEditFormState } from '../../../../../../Domain/IStates'
import styles from './TaskListEditForm.module.scss'

interface TaskListEditFormProps {
  taskList: ApiTasksTypes['TaskResponse']
  onSuccess?: () => void
}

export const TaskListEditForm: React.FC<TaskListEditFormProps> = ({
  taskList,
  onSuccess,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { providerTaskListEditFormPloc, providerTaskListsPloc } =
    useDependencies()
  const state = usePlocState<ITaskListEditFormState>(
    providerTaskListEditFormPloc
  )

  const handleOpen = () => {
    providerTaskListEditFormPloc.reset()
    providerTaskListEditFormPloc.loadForEdit(taskList.id!)
    setIsModalOpen(true)
  }

  const handleClose = () => {
    setIsModalOpen(false)
    if (state.success) {
      providerTaskListsPloc.loadTaskLists()
      if (onSuccess) onSuccess()
    }
    providerTaskListEditFormPloc.reset()
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    providerTaskListEditFormPloc.updateName(e.target.value)
  }

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    providerTaskListEditFormPloc.updateColor(e.target.value)
  }

  const handleSubmit = async () => {
    await providerTaskListEditFormPloc.submitEdit()
  }

  return (
    <>
      <Button
        variant='ghost'
        size='sm'
        onClick={handleOpen}
      >
        <Icon
          name='Edit'
          size={16}
        />
      </Button>

      <Modal
        isOpen={isModalOpen}
        onClose={handleClose}
        title={state.success ? '¡Éxito!' : `Editar ${taskList.content}`}
      >
        {state.success ? (
          <div className={styles['success-container']}>
            <Text>
              {state.message ||
                'La lista de tareas se ha actualizado con éxito.'}
            </Text>
            <div className={styles['success-actions']}>
              <Button onClick={handleClose}>Cerrar</Button>
            </div>
          </div>
        ) : (
          <div className={styles['modal-content']}>
            {state.message && (
              <Text
                size='sm'
                style={{
                  color:
                    Object.keys(state.errors).length > 0
                      ? 'var(--danger-color, #ff4d4f)'
                      : 'var(--success-color, #52c41a)',
                  marginBottom: '16px',
                  display: 'block',
                }}
              >
                {state.message}
              </Text>
            )}

            <FormField
              label='Nombre'
              required
              error={state.errors.name?.[0]}
            >
              <Input
                type='text'
                value={state.name}
                onChange={handleNameChange}
                placeholder='Ej: Tareas de la casa'
                disabled={state.isLoading}
              />
            </FormField>

            <FormField
              label='Color'
              required
              error={state.errors.color?.[0]}
            >
              <Input
                type='color'
                value={state.color}
                onChange={handleColorChange}
                disabled={state.isLoading}
              />
            </FormField>

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
                variant='primary'
                onClick={handleSubmit}
                loading={state.isLoading}
              >
                Guardar Cambios
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}
