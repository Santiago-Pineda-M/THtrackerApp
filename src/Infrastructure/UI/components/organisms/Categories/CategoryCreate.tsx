import React, { useState, useEffect } from 'react'
import { Button, Text, Modal, Input, FormField, Icon } from '../..'
import { useDependencies } from '../../../../Context/useDependencies'
import { usePlocState } from '../../../../Hooks/usePlocState'
import type { ICategoryCreateFormState } from '../../../../../Domain/IStates'
import styles from './CategoryCreate.module.css'

export const CategoryCreate: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { providerCategoryCreateFormPloc, providerCategoriesListPloc } =
    useDependencies()
  const state = usePlocState<ICategoryCreateFormState>(
    providerCategoryCreateFormPloc
  )

  useEffect(() => {
    if (state.success) {
      providerCategoriesListPloc.loadCategories()
    }
  }, [state.success, providerCategoriesListPloc])

  const handleOpen = () => {
    providerCategoryCreateFormPloc.reset()
    setIsModalOpen(true)
  }

  const handleClose = () => {
    setIsModalOpen(false)
    providerCategoryCreateFormPloc.reset()
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    providerCategoryCreateFormPloc.updateName(e.target.value)
  }

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    providerCategoryCreateFormPloc.updateColor(e.target.value)
  }

  const handleSubmit = async () => {
    await providerCategoryCreateFormPloc.submit()
  }

  return (
    <>
      <Button
        variant='ghost'
        title='Agregar Categoría'
        size='md'
        onClick={handleOpen}
      >
        <Icon
          name='Plus'
          size={18}
        />
        <span>Categoría</span>
      </Button>

      <Modal
        isOpen={isModalOpen}
        onClose={handleClose}
        title={state.success ? '¡Éxito!' : 'Nueva Categoría'}
      >
        {state.success ? (
          <div className={styles['success-container']}>
            <Text>La categoría se ha creado con éxito.</Text>
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
                placeholder='Ej: Trabajo, Estudio, Ejercicio'
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
                style={{ padding: '0 4px', height: '40px' }}
              />
            </FormField>

            <div className={styles['modal-actions']}>
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
