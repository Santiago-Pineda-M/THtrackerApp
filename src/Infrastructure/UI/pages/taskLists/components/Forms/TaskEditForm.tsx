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
import type { ITaskEditFormState } from '../../../../../../Domain/IStates'
import type { ITaskItem } from '../../../../../../Domain/TaskList/ITaskListResponses'
import styles from './TaskEditForm.module.css'

interface TaskEditFormProps {
  task: ITaskItem
  onSuccess?: () => void
}

export const TaskEditForm: React.FC<TaskEditFormProps> = ({
  task,
  onSuccess,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { providerTaskEditFormPloc } = useDependencies()
  const state = usePlocState<ITaskEditFormState>(providerTaskEditFormPloc)

  const handleOpen = () => {
    providerTaskEditFormPloc.reset()
    providerTaskEditFormPloc.loadForEdit(task.id)
    setIsModalOpen(true)
  }

  const handleClose = () => {
    setIsModalOpen(false)
    if (state.success) {
      onSuccess?.()
    }
    providerTaskEditFormPloc.reset()
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    providerTaskEditFormPloc.updateContent(e.target.value)
  }

  const handleSubmit = async () => {
    await providerTaskEditFormPloc.submitEdit({
      id: task.id,
      taskListId: task.taskListId,
      content: state.content,
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
          size={14}
        />
      </Button>

      <Modal
        isOpen={isModalOpen}
        onClose={handleClose}
        title={state.success ? '¡Éxito!' : `Editar tarea`}
      >
        {state.success ? (
          <div className={styles['success-container']}>
            <Text>
              {state.message || 'La tarea se ha actualizado con éxito.'}
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
              label='Contenido'
              required
              error={state.errors.content?.[0]}
            >
              <Input
                type='text'
                value={state.content}
                onChange={handleContentChange}
                placeholder='Ej: Comprar leche'
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
