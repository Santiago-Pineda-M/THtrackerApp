import React, { useState } from 'react'
import { Button, Text, Modal, Icon } from '../../../../../components'
import { useDependencies } from '../../../../../../Context/useDependencies'
import { usePlocState } from '../../../../../../Hooks/usePlocState'
import type { IValueDefinitionDeleteState } from '../../../../../../../Domain'
import styles from './ValueDefinitionForm.module.scss'

interface ValueDefinitionDeleteProps {
  activityId: string
  definitionId: string
  definitionName: string
}

export const ValueDefinitionDelete: React.FC<ValueDefinitionDeleteProps> = ({
  activityId,
  definitionId,
  definitionName,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const {
    providerValueDefinitionDeletePloc,
    providerActivityValueDefinitionsListPloc,
  } = useDependencies()
  const state = usePlocState<IValueDefinitionDeleteState>(
    providerValueDefinitionDeletePloc
  )

  const handleOpen = () => {
    providerValueDefinitionDeletePloc.reset()
    setIsModalOpen(true)
  }

  const handleClose = () => {
    setIsModalOpen(false)
    if (state.success) {
      providerActivityValueDefinitionsListPloc.loadDefinitions(activityId)
    }
    providerValueDefinitionDeletePloc.reset()
  }

  const handleDelete = async () => {
    await providerValueDefinitionDeletePloc.deleteValueDefinition(
      activityId,
      definitionId
    )
  }

  return (
    <>
      <Button
        variant='danger'
        size='sm'
        onClick={handleOpen}
        title='Eliminar Propiedad'
      >
        <Icon
          name='Trash2'
          size={14}
        />
      </Button>

      <Modal
        isOpen={isModalOpen}
        onClose={handleClose}
        title={state.success ? 'Â¡Éxito!' : 'Eliminar Propiedad'}
      >
        {state.success ? (
          <div className={styles.successContainer}>
            <Text>La propiedad se ha eliminado con éxito.</Text>
            <div className={styles.successActions}>
              <Button onClick={handleClose}>Cerrar</Button>
            </div>
          </div>
        ) : (
          <div className={styles.modalContent}>
            {state.error && (
              <Text
                size='sm'
                className={styles.errorMessage}
                style={{
                  color: 'var(--color-error)',
                }}
              >
                {state.error.title || 'Error al eliminar la propiedad.'}
              </Text>
            )}

            <Text className={styles.modalText}>
              Â¿Estás seguro de que deseas eliminar la propiedad{' '}
              <strong>{definitionName}</strong>? Esta acción no se puede
              deshacer.
            </Text>

            <div className={styles.modalActions}>
              <Button
                variant='ghost'
                onClick={handleClose}
                disabled={state.isLoading}
              >
                Cancelar
              </Button>
              <Button
                variant='primary'
                style={{ backgroundColor: 'var(--color-error)' }}
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
