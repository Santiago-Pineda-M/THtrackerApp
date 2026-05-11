import React, { useState, useCallback } from 'react'
import { Button, Text, Modal, Icon } from '../../../../components'
import { useDependencies } from '../../../../../Context/useDependencies'
import { usePlocState } from '../../../../../Hooks/usePlocState'
import type { ApiCategoriesTypes } from '../../../../../../Domain'
import type { ICategoryDeleteState } from '../../../../../../Domain/IStates'
import styles from './CategoryDelete.module.scss'

type CategoryType = ApiCategoriesTypes['CategoryResponse']

interface CategoryDeleteProps {
  category: CategoryType
}

export const CategoryDelete: React.FC<CategoryDeleteProps> = ({ category }) => {
  // 1. TODOS los hooks deben ir aquí, sin condiciones
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { providerCategoryDeletePloc, providerCategoriesListPloc } =
    useDependencies()
  const state = usePlocState<ICategoryDeleteState>(providerCategoryDeletePloc)

  const handleOpen = useCallback(() => {
    providerCategoryDeletePloc.reset()
    setIsModalOpen(true)
  }, [providerCategoryDeletePloc])

  const handleClose = useCallback(() => {
    setIsModalOpen(false)
    if (state.success) {
      providerCategoriesListPloc.loadCategories()
    }
    providerCategoryDeletePloc.reset()
  }, [state.success, providerCategoryDeletePloc, providerCategoriesListPloc])

  const handleDelete = useCallback(async () => {
    // Evitar spam si ya está cargando
    if (state.isLoading) return
    // category.id podría ser undefined, pero el early return lo impide en práctica
    if (!category.id) return
    await providerCategoryDeletePloc.deleteCategory(category.id)
  }, [state.isLoading, providerCategoryDeletePloc, category.id])

  // Verificar si hay errores (antes era state.errors > 0, lo que es incorrecto)
  const hasErrors = state.errors && Object.keys(state.errors).length > 0

  // 2. Ahora sí podemos hacer el early return de forma segura
  if (!category.id) return null

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
        title={state.success ? '¡Éxito!' : 'Eliminar Categoría'}
      >
        {state.success ? (
          <div className={styles['success-container']}>
            <Text>La categoría se ha eliminado con éxito.</Text>
            <div className={styles['success-actions']}>
              <Button onClick={handleClose}>Cerrar</Button>
            </div>
          </div>
        ) : (
          <div className={styles['modal-content']}>
            {hasErrors && (
              <Text
                size='sm'
                style={{
                  color: 'var(--danger-color, #ff4d4f)',
                  marginBottom: '16px',
                  display: 'block',
                }}
              >
                {state.errors?.[0] || 'Error al eliminar la categoría.'}
              </Text>
            )}

            <Text className={styles['modal-text']}>
              ¿Estás seguro de que deseas eliminar la categoría{' '}
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
