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
import type { IValueDefinitionCreateFormState } from '../../../../../../Domain/IStates'
import styles from './ValueDefinitionForm.module.css'

interface ValueDefinitionCreateFormProps {
  activityId: string
}

export const ValueDefinitionCreateForm: React.FC<
  ValueDefinitionCreateFormProps
> = ({ activityId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const {
    providerValueDefinitionCreateFormPloc,
    providerActivityValueDefinitionsListPloc,
  } = useDependencies()

  const state = usePlocState<IValueDefinitionCreateFormState>(
    providerValueDefinitionCreateFormPloc
  )

  useEffect(() => {
    if (state.success) {
      providerActivityValueDefinitionsListPloc.loadDefinitions(activityId)
    }
  }, [state.success, providerActivityValueDefinitionsListPloc, activityId])

  const handleOpen = () => {
    providerValueDefinitionCreateFormPloc.init(activityId)
    setIsModalOpen(true)
  }

  const handleClose = () => {
    setIsModalOpen(false)
    providerValueDefinitionCreateFormPloc.reset()
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    providerValueDefinitionCreateFormPloc.updateName(e.target.value)
  }

  const handleValueTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    providerValueDefinitionCreateFormPloc.updateValueType(e.target.value)
  }

  const handleIsRequiredChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    providerValueDefinitionCreateFormPloc.updateIsRequired(e.target.checked)
  }

  const handleUnitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    providerValueDefinitionCreateFormPloc.updateUnit(e.target.value)
  }

  const handleMinValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    providerValueDefinitionCreateFormPloc.updateMinValue(e.target.value)
  }

  const handleMaxValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    providerValueDefinitionCreateFormPloc.updateMaxValue(e.target.value)
  }

  const handleSubmit = async () => {
    await providerValueDefinitionCreateFormPloc.submit()
  }

  return (
    <>
      <Button
        variant='primary'
        title='Agregar Propiedad'
        size='sm'
        onClick={handleOpen}
      >
        <Icon
          name='Plus'
          size={14}
        />
        <span>Agregar Propiedad</span>
      </Button>

      <Modal
        isOpen={isModalOpen}
        onClose={handleClose}
        title={state.success ? '¡Éxito!' : 'Nueva Propiedad'}
      >
        {state.success ? (
          <div className={styles.successContainer}>
            <Text>La propiedad se ha creado con éxito.</Text>
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
              label='Nombre'
              required
              error={state.errors.name?.[0]}
            >
              <Input
                type='text'
                value={state.name}
                onChange={handleNameChange}
                placeholder='Ej: Duración, Cantidad'
                disabled={state.isLoading}
              />
            </FormField>

            <FormField
              label='Tipo de Valor'
              required
            >
              <select
                value={state.valueType || 'Number'}
                onChange={handleValueTypeChange}
                disabled={state.isLoading}
                className={styles.select}
              >
                <option value='Number'>Número</option>
                <option value='Text'>Texto</option>
                <option value='Boolean'>Booleano</option>
                <option value='Duration'>Duración</option>
              </select>
            </FormField>

            <FormField label='Obligatorio'>
              <div className={styles.checkboxOption}>
                <input
                  type='checkbox'
                  checked={state.isRequired}
                  onChange={handleIsRequiredChange}
                  disabled={state.isLoading}
                />
                <Text
                  size='xs'
                  color='secondary'
                >
                  Esta propiedad es obligatoria.
                </Text>
              </div>
            </FormField>

            <FormField label='Unidad'>
              <Input
                type='text'
                value={state.unit}
                onChange={handleUnitChange}
                placeholder='Ej: horas, kg, unidades'
                disabled={state.isLoading}
              />
            </FormField>

            <FormField label='Valor Mínimo'>
              <Input
                type='text'
                value={state.minValue}
                onChange={handleMinValueChange}
                placeholder='Ej: 0'
                disabled={state.isLoading}
              />
            </FormField>

            <FormField label='Valor Máximo'>
              <Input
                type='text'
                value={state.maxValue}
                onChange={handleMaxValueChange}
                placeholder='Ej: 100'
                disabled={state.isLoading}
              />
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
