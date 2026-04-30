import React, { useState } from 'react'
import {
  Button,
  Text,
  Modal,
  Input,
  FormField,
  Icon,
  ToggleSwitch,
  DateTimePicker,
} from '../../../../components'
import { useDependencies } from '../../../../../Context/useDependencies'
import { usePlocState } from '../../../../../Hooks/usePlocState'
import type { ITaskCreateFormState } from '../../../../../../Domain/IStates'
import styles from './TaskCreateForm.module.scss'

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

  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    providerTaskCreateFormPloc.updateContent(e.target.value)
  }

  const handleToggleShowDueDate = () => {
    providerTaskCreateFormPloc.toggleShowDueDate()
  }

  const handleSubmit = async () => {
    await providerTaskCreateFormPloc.submitCreate({
      taskListId,
      content: state.content,
      dueDate: state.showDueDate ? state.dueDate : undefined,
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

            <FormField label='Establecer fecha de vencimiento'>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <ToggleSwitch
                  checked={state.showDueDate}
                  onChange={handleToggleShowDueDate}
                  disabled={state.isLoading}
                />
                <Text size='sm'>{state.showDueDate ? 'Sí' : 'No'}</Text>
              </div>
            </FormField>

            {state.showDueDate && (
              <FormField
                label='Fecha de vencimiento'
                error={state.errors.dueDate?.[0]}
              >
                <DateTimePicker
                  value={state.dueDate}
                  onChange={(val) =>
                    providerTaskCreateFormPloc.updateDueDate(val)
                  }
                  disabled={state.isLoading}
                />
              </FormField>
            )}

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
