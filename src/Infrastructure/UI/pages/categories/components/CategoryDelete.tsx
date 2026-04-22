import React, { useState } from 'react'
import { Button, Text, Modal, Icon } from '../../../components'
import { useDependencies } from '../../../../Context/useDependencies'
import { usePlocState } from '../../../../Hooks/usePlocState'
import type { ICategory } from '../../../../../Domain'
import type { ICategoryDeleteState } from '../../../../../Controllers/Category/CategoryDeletePloc'
import styles from './CategoryDelete.module.css'

interface CategoryDeleteProps {
  category: ICategory
}

export const CategoryDelete: React.FC<CategoryDeleteProps> = ({ category }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { providerCategoryDeletePloc, providerCategoriesListPloc } =
    useDependencies()
  const state = usePlocState<ICategoryDeleteState>(providerCategoryDeletePloc)

  const handleOpen = () => {
    providerCategoryDeletePloc.reset()
    setIsModalOpen(true)
  }

  const handleClose = () => {
    setIsModalOpen(false)
    if (state.success) {
      providerCategoriesListPloc.loadCategories() // Reload ONLY after closing the success message
    }
    providerCategoryDeletePloc.reset()
  }

  const handleDelete = async () => {
    await providerCategoryDeletePloc.deleteCategory(category.id)
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
        title={state.success ? 'Â¡Ã‰xito!' : 'Eliminar CategorÃ­a'}
      >
        {state.success ? (
          <div className={styles['success-container']}>
            <Text>
              {state.message || 'La categorÃ­a se ha eliminado con Ã©xito.'}
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
                  color: state.error
                    ? 'var(--danger-color, #ff4d4f)'
                    : 'var(--success-color, #52c41a)',
                  marginBottom: '16px',
                  display: 'block',
                }}
              >
                {state.message}
              </Text>
            )}

            <Text className={styles['modal-text']}>
              Â¿EstÃ¡s seguro de que deseas eliminar la categorÃ­a{' '}
              <strong>{category.name}</strong>?
            </Text>

            <div className={styles['modal-actions']}>
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
