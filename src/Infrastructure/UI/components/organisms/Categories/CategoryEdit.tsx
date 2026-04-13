import React, { useState } from 'react'
import { Button, Text, Modal, Input, FormField, Icon } from '../..'
import { useDependencies } from '../../../../Context/useDependencies'
import { usePlocState } from '../../../../Hooks/usePlocState'
import type { ICategory } from '../../../../../Domain'
import type { ICategoryEditFormState } from '../../../../../Domain/IStates'
import styles from './CategoryEdit.module.css'

interface CategoryEditProps {
  category: ICategory
}

export const CategoryEdit: React.FC<CategoryEditProps> = ({ category }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { providerCategoryEditFormPloc, providerCategoriesListPloc } =
    useDependencies()
  const state = usePlocState<ICategoryEditFormState>(
    providerCategoryEditFormPloc
  )

  const handleOpen = () => {
    providerCategoryEditFormPloc.reset()
    providerCategoryEditFormPloc.initializeForm(category.id)
    setIsModalOpen(true)
  }

  const handleClose = () => {
    setIsModalOpen(false)
    if (state.success) {
      providerCategoriesListPloc.loadCategories()
    }
    providerCategoryEditFormPloc.reset()
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    providerCategoryEditFormPloc.updateName(e.target.value)
  }

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    providerCategoryEditFormPloc.updateColor(e.target.value)
  }

  const handleSubmit = async () => {
    await providerCategoryEditFormPloc.submit()
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
        title={state.success ? '¡Éxito!' : `Editar ${category.name}`}
      >
        {state.success ? (
          <div className={styles['success-container']}>
            <Text>
              {state.message || 'La categoría se ha actualizado con éxito.'}
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
                Guardar Cambios
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}
