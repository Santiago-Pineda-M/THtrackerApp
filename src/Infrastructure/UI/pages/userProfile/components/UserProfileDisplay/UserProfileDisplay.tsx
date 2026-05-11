/**
 * INFRASTRUCTURE LAYER - UI Components
 * Componente para mostrar el perfil del usuario.
 */

import { useEffect } from 'react'
import { Card, Text, Spinner, Avatar } from '../../../../components'
import { useDependencies } from '../../../../../Context/useDependencies'
import { usePlocState } from '../../../../../Hooks/usePlocState'
import type { IUserProfileDisplayState } from '../../../../../../Domain/IStates'
import styles from './UserProfileDisplay.module.scss'

/**
 * Obtiene las iniciales de un nombre o email.
 */
function getInitials(name: string): string {
  if (!name) return '?'
  const parts = name.split(/[@\s]+/)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

export const UserProfileDisplay: React.FC = () => {
  const { providerUserProfileDisplayPloc } = useDependencies()
  const state = usePlocState<IUserProfileDisplayState>(
    providerUserProfileDisplayPloc
  )

  useEffect(() => {
    providerUserProfileDisplayPloc.loadProfile()
  }, [providerUserProfileDisplayPloc])

  if (state.isLoading) {
    return (
      <Card
        h={2}
        w={2}
        title='Mi Perfil'
      >
        <div className={styles.loadingContainer}>
          <Spinner size='md' />
        </div>
      </Card>
    )
  }

  // saver si el dicionario d eerrores tiene contenido
  if (state.errors && Object.keys(state.errors).length > 0) {
    const errorMessages = Object.values(state.errors)
    return (
      <Card
        h={2}
        w={2}
        title='Mi Perfil'
      >
        <Text
          size='sm'
          className='error'
        >
          {errorMessages.join(', ') || 'Error al cargar el perfil'}
        </Text>
      </Card>
    )
  }

  if (!state.user) {
    return (
      <Card
        h={2}
        w={2}
        title='Mi Perfil'
      >
        <Text size='sm'>No se encontró información del usuario</Text>
      </Card>
    )
  }

  return (
    <Card
      h={2}
      w={2}
      title='Mi Perfil'
    >
      <div className={styles.header}>
        <Avatar
          initials={getInitials(
            state.user.name || state.user.email || 'Usuario'
          )}
          size='lg'
        />
        <div>
          <Text
            size='lg'
            weight='bold'
          >
            {state.user.name || 'Sin nombre'}
          </Text>
          <Text
            size='sm'
            color='muted'
          >
            {state.user.email}
          </Text>
        </div>
      </div>
      <div className={styles.info}>
        <Text
          size='sm'
          color='muted'
        >
          ID: {state.user.id}
        </Text>
      </div>
    </Card>
  )
}

export default UserProfileDisplay
