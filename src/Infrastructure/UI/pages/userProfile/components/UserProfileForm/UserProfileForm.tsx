import { useEffect, useState } from 'react'
import {
  Card,
  Input,
  Button,
  Text,
  Icon,
  Modal,
  FormField,
} from '../../../../components'
import { useDependencies } from '../../../../../Context/useDependencies'
import { usePlocState } from '../../../../../Hooks/usePlocState'
import type { IUserProfileFormState } from '../../../../../../Domain/IStates'
import styles from './UserProfileForm.module.scss'

type EditField = 'name' | 'email' | null

export const UserProfileForm: React.FC = () => {
  const { providerUserProfileFormPloc } = useDependencies()
  const state = usePlocState<IUserProfileFormState>(providerUserProfileFormPloc)

  const [editingField, setEditingField] = useState<EditField>(null)

  useEffect(() => {
    providerUserProfileFormPloc.initializeForm()
  }, [providerUserProfileFormPloc])

  useEffect(() => {
    if (state.success && editingField !== null) {
      const timeoutId = setTimeout(() => {
        setEditingField(null)
      }, 0)
      return () => clearTimeout(timeoutId)
    }
  }, [state.success, editingField])

  const handleSubmit = async () => {
    await providerUserProfileFormPloc.submit()
  }

  const handleEdit = (field: EditField) => {
    setEditingField(field)
  }

  const handleCloseModal = () => {
    setEditingField(null)
    // Restaurar los valores originales
    providerUserProfileFormPloc.initializeForm()
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    providerUserProfileFormPloc.updateName(e.target.value)
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    providerUserProfileFormPloc.updateEmail(e.target.value)
  }

  if (state.isLoading && !state.name && !state.email) {
    return (
      <Card title='Editar Perfil'>
        <div className={styles.loadingContainer}>
          <Text>Cargando...</Text>
        </div>
      </Card>
    )
  }

  return (
    <Card
      h={2}
      w={2}
      title='Editar Perfil'
    >
      {state.message && !editingField && (
        <div className={styles.messages}>
          <Text
            size='sm'
            className={state.success ? styles.success : styles.error}
          >
            {state.message}
          </Text>
        </div>
      )}

      <div className={styles.fieldList}>
        {/* Campo Nombre */}
        <div className={styles.fieldRow}>
          <div className={styles.fieldInfo}>
            <Text weight='bold'>Nombre</Text>
            <Text color={state.name ? 'default' : 'muted'}>
              {state.name || 'Sin nombre'}
            </Text>
          </div>
          <button
            className={styles.editBtn}
            onClick={() => handleEdit('name')}
            title='Editar Nombre'
          >
            <Icon
              name='Edit'
              size={18}
            />
          </button>
        </div>

        {/* Campo Email */}
        <div className={styles.fieldRow}>
          <div className={styles.fieldInfo}>
            <Text weight='bold'>Correo Electrónico</Text>
            <Text color={state.email ? 'default' : 'muted'}>
              {state.email || 'Sin correo'}
            </Text>
          </div>
          <button
            className={styles.editBtn}
            onClick={() => handleEdit('email')}
            title='Editar Correo'
          >
            <Icon
              name='Edit'
              size={18}
            />
          </button>
        </div>
      </div>

      <Modal
        isOpen={editingField !== null}
        onClose={handleCloseModal}
        title={
          editingField === 'name' ? 'Actualizar Nombre' : 'Actualizar Correo'
        }
      >
        <div className={styles.modalContent}>
          {/* Mostrar error/mensaje específico del modal */}
          {state.message && (
            <Text
              size='sm'
              className={state.success ? styles.success : styles.error}
            >
              {state.message}
            </Text>
          )}

          {editingField === 'name' && (
            <FormField
              label='Nombre'
              required
              error={state.errors.name?.[0]}
            >
              <Input
                name='name'
                type='text'
                value={state.name}
                onChange={handleNameChange}
                placeholder='Tu nombre'
                disabled={state.isLoading}
              />
            </FormField>
          )}

          {editingField === 'email' && (
            <FormField
              label='Correo Electrónico'
              required
              error={state.errors.email?.[0]}
            >
              <Input
                name='email'
                type='email'
                value={state.email}
                onChange={handleEmailChange}
                placeholder='tu@correo.com'
                disabled={state.isLoading}
              />
            </FormField>
          )}

          <div className={styles.modalActions}>
            <Button
              type='button'
              variant='secondary'
              onClick={handleCloseModal}
              disabled={state.isLoading}
            >
              Cancelar
            </Button>
            <Button
              type='button'
              variant='primary'
              onClick={handleSubmit}
              disabled={state.isLoading}
              loading={state.isLoading}
            >
              Guardar Cambios
            </Button>
          </div>
        </div>
      </Modal>
    </Card>
  )
}

export default UserProfileForm
