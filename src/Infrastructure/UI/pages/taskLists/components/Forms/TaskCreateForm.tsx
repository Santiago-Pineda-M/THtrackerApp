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
import type { ITaskCreateFormState } from '../../../../../../Domain/IStates'
import styles from './TaskCreateForm.module.css'

interface TaskCreateFormProps {
  taskListId: string
  /** Callback opcional para recargar la lista de tareas tras crear una tarea. */
  onSuccess?: () => void
}

export const TaskCreateForm: React.FC<TaskCreateFormProps> = ({
  taskListId,
  onSuccess,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { providerTaskCreateFormPloc } = useDependencies()
  const state = usePlocState<ITaskCreateFormState>(providerTaskCreateFormPloc)

  const handleOpen = () => {
    providerTaskCreateFormPloc.reset()
    setIsModalOpen(true)
  }

  const handleClose = () => {
    setIsModalOpen(false)
    if (state.success) {
      onSuccess?.()
    }
    providerTaskCreateFormPloc.reset()
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    providerTaskCreateFormPloc.updateTitle(e.target.value)
  }

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    providerTaskCreateFormPloc.updateDescription(e.target.value)
  }

  const handleSubmit = async () => {
    await providerTaskCreateFormPloc.submitCreate({
      taskListId,
      title: state.title,
      description: state.description,
    })
  }

  return (
    <>
      <Button
        variant='ghost'
        title='Nueva Tarea'
        size='sm'
        onClick={handleOpen}
      >
        <Icon
          name='Plus'
          size={16}
        />
        <span>Añadir Tarea</span>
      </Button>

      <Modal
        isOpen={isModalOpen}
        onClose={handleClose}
        title={state.success ? '¡Éxito!' : 'Crear nueva tarea'}
      >
        {state.success ? (
          <div className={styles['success-container']}>
            <Text>La tarea se ha creado con éxito.</Text>
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
              label='Título'
              required
              error={state.errors.title?.[0]}
            >
              <Input
                type='text'
                value={state.title}
                onChange={handleTitleChange}
                placeholder='Ej: Comprar leche'
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
                placeholder='Ej: En el supermercado de la esquina'
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
                Crear
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}
