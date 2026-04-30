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
import type { ITaskListItem } from '../../../../../../Domain/TaskList/ITaskListResponses'
import type { ITaskListEditFormState } from '../../../../../../Domain/IStates'
import styles from './TaskListEditForm.module.scss'

interface TaskListEditFormProps {
  taskList: ITaskListItem
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
    providerTaskListEditFormPloc.loadForEdit(taskList.id)
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

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    providerTaskListEditFormPloc.updateDescription(e.target.value || null)
  }

  const handleSubmit = async () => {
    await providerTaskListEditFormPloc.submitEdit({
      id: taskList.id,
      name: state.name,
      description: state.description,
    })
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
        title={state.success ? '¡Éxito!' : `Editar ${taskList.name}`}
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
              label='Descripción'
              error={state.errors.description?.[0]}
            >
              <Input
                type='text'
                value={state.description || ''}
                onChange={handleDescriptionChange}
                placeholder='Ej: Lista de tareas para hacer en la casa'
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
