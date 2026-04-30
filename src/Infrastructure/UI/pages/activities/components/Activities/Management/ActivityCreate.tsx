import React, { useState, useEffect } from 'react'
import {
  Button,
  Text,
  Modal,
  Input,
  FormField,
  Icon,
} from '../../../../../components'
import { useDependencies } from '../../../../../../Context/useDependencies'
import { usePlocState } from '../../../../../../Hooks/usePlocState'
import type {
  IActivityCreateFormState,
  ICategoriesListState,
} from '../../../../../../../Domain/IStates'
import styles from './ActivityForm.module.scss'

export const ActivityCreate: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const {
    providerActivityCreateFormPloc,
    providerActivitiesListPloc,
    providerCategoriesListPloc,
  } = useDependencies()

  const state = usePlocState<IActivityCreateFormState>(
    providerActivityCreateFormPloc
  )
  const categoriesState = usePlocState<ICategoriesListState>(
    providerCategoriesListPloc
  )

  useEffect(() => {
    if (isModalOpen) {
      providerCategoriesListPloc.loadCategories()
    }
  }, [isModalOpen, providerCategoriesListPloc])

  useEffect(() => {
    if (state.success) {
      providerActivitiesListPloc.loadActivities()
    }
  }, [state.success, providerActivitiesListPloc])

  const handleOpen = () => {
    providerActivityCreateFormPloc.reset()
    setIsModalOpen(true)
  }

  const handleClose = () => {
    setIsModalOpen(false)
    providerActivityCreateFormPloc.reset()
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    providerActivityCreateFormPloc.updateName(e.target.value)
  }

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    providerActivityCreateFormPloc.updateColor(e.target.value)
  }

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    providerActivityCreateFormPloc.updateCategory(e.target.value)
  }

  const handleOverlapChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    providerActivityCreateFormPloc.updateAllowOverlap(e.target.checked)
  }

  const handleSubmit = async () => {
    await providerActivityCreateFormPloc.submit()
  }

  return (
    <>
      <Button
        variant='ghost'
        title='Agregar Actividad'
        size='md'
        onClick={handleOpen}
      >
        <Icon
          name='Plus'
          size={18}
        />
        <span>Actividad</span>
      </Button>

      <Modal
        isOpen={isModalOpen}
        onClose={handleClose}
        title={state.success ? 'Â¡Éxito!' : 'Nueva Actividad'}
      >
        {state.success ? (
          <div className={styles.successContainer}>
            <Text>La actividad se ha creado con éxito.</Text>
            <div className={styles.successActions}>
              <Button onClick={handleClose}>Cerrar</Button>
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
              label='Categoría'
              required
              error={state.errors.categoryId?.[0]}
            >
              <select
                value={state.categoryId}
                onChange={handleCategoryChange}
                disabled={state.isLoading}
                className={styles.select}
              >
                <option value=''>Selecciona una categoría</option>
                {categoriesState.categories.map((cat) => (
                  <option
                    key={cat.id}
                    value={cat.id}
                  >
                    {cat.name}
                  </option>
                ))}
              </select>
            </FormField>

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
                Crear
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}
