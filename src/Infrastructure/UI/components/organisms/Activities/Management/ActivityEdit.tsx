import React, { useState, useEffect } from 'react'
import { Button, Text, Modal, Input, FormField, Icon } from '../../..'
import { useDependencies } from '../../../../../Context/useDependencies'
import { usePlocState } from '../../../../../Hooks/usePlocState'
import type { IActivityEditFormState } from '../../../../../../Domain/IStates'
import styles from './ActivityForm.module.css'

interface ActivityEditProps {
  activityId: string
}

export const ActivityEdit: React.FC<ActivityEditProps> = ({ activityId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { providerActivityEditFormPloc, providerActivitiesListPloc } =
    useDependencies()

  const state = usePlocState<IActivityEditFormState>(
    providerActivityEditFormPloc
  )

  useEffect(() => {
    if (state.success) {
      providerActivitiesListPloc.loadActivities()
    }
  }, [state.success, providerActivitiesListPloc])

  const handleOpen = () => {
    providerActivityEditFormPloc.loadActivity(activityId)
    setIsModalOpen(true)
  }

  const handleClose = () => {
    setIsModalOpen(false)
    providerActivityEditFormPloc.reset()
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    providerActivityEditFormPloc.updateName(e.target.value)
  }

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    providerActivityEditFormPloc.updateColor(e.target.value)
  }

  const handleOverlapChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    providerActivityEditFormPloc.updateAllowOverlap(e.target.checked)
  }

  const handleSubmit = async () => {
    await providerActivityEditFormPloc.submit()
  }

  return (
    <>
      <Button
        variant='ghost'
        title='Editar Actividad'
        size='md'
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
        title={state.success ? '¡Éxito!' : 'Editar Actividad'}
      >
        {state.success ? (
          <div className={styles.successContainer}>
            <Text>La actividad se ha actualizado con éxito.</Text>
            <div className={styles.successActions}>
              <Button
                variant='primary'
                onClick={handleClose}
              >
                Cerrar
              </Button>
            </div>
          </div>
        ) : (
          <div className={styles.modalContent}>
            {state.message && (
              <Text
                size='sm'
                className={styles.errorMessage}
                style={{
                  color:
                    Object.keys(state.errors).length > 0
                      ? 'var(--color-error)'
                      : 'var(--color-success)',
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
                placeholder='Ej: Desarrollo Backend, Lectura'
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
                value={state.color || '#000000'}
                onChange={handleColorChange}
                disabled={state.isLoading}
                className={styles.colorInput}
              />
            </FormField>

            <FormField label='Permitir solapamiento'>
              <div className={styles.overlapOption}>
                <input
                  type='checkbox'
                  checked={state.allowOverlap}
                  onChange={handleOverlapChange}
                  disabled={state.isLoading}
                />
                <Text
                  size='xs'
                  color='secondary'
                >
                  Esta actividad puede ocurrir al mismo tiempo que otras.
                </Text>
              </div>
            </FormField>

            <div className={styles.modalActions}>
              <Button
                variant='primary'
                onClick={handleSubmit}
                loading={state.isLoading}
              >
                Guardar cambios
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}
