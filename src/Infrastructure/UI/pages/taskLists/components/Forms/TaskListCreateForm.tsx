import React, { useState, useEffect } from 'react'
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
import type { ITaskListCreateFormState } from '../../../../../../Domain/IStates'
import styles from './TaskListCreateForm.module.scss'

export const TaskListCreateForm: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { providerTaskListCreateFormPloc, providerTaskListsPloc } =
    useDependencies()
  const state = usePlocState<ITaskListCreateFormState>(
    providerTaskListCreateFormPloc
  )

  useEffect(() => {
    if (state.success) {
      providerTaskListsPloc.loadTaskLists()
    }
  }, [state.success, providerTaskListsPloc])

  const handleOpen = () => {
    providerTaskListCreateFormPloc.reset()
    setIsModalOpen(true)
  }

  const handleClose = () => {
    setIsModalOpen(false)
    providerTaskListCreateFormPloc.reset()
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    providerTaskListCreateFormPloc.updateName(e.target.value)
  }

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    providerTaskListCreateFormPloc.updateColor(e.target.value || '#ff4d4f')
  }

  const handleSubmit = async () => {
    await providerTaskListCreateFormPloc.submitCreate()
  }

  return (
    <>
      <Button
        variant='ghost'
        title='Nueva Lista de Tareas'
        size='md'
        onClick={handleOpen}
      >
        <Icon
          name='Plus'
          size={18}
        />
        <span>Nueva Lista</span>
      </Button>

      <Modal
        isOpen={isModalOpen}
        onClose={handleClose}
        title={state.success ? '¡Éxito!' : 'Crear nueva lista de tareas'}
      >
        {state.success ? (
          <div className={styles['success-container']}>
            <Text>La lista de tareas se ha creado con éxito.</Text>
            <div className={styles['success-actions']}>
              <Button onClick={handleClose}>Cerrar</Button>
            </div>
          </div>
        ) : (
          <>
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
                id='name'
                name='name'
                value={state.name}
                onChange={handleNameChange}
                placeholder='Ej: Tareas de la casa'
                disabled={state.isLoading}
              />
            </FormField>

            <FormField
              label='Color'
              error={state.errors.color?.[0]}
            >
              <Input
                type='color'
                id='color'
                name='color'
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
                Crear
              </Button>
            </div>
          </>
        )}
      </Modal>
    </>
  )
}
