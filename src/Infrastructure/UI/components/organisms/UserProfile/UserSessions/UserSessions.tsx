import React, { useEffect } from 'react'
import { Card, Text, Icon, Spinner, Badge, Button } from '../../../'
import { useDependencies } from '../../../../../Context/useDependencies'
import { usePlocState } from '../../../../../Hooks/usePlocState'
import type {
  IUserSessionsListState,
  ISessionRevokeState,
  IAuthState,
} from '../../../../../../Domain/IStates'
import styles from './UserSessions.module.css'

export const UserSessions: React.FC = () => {
  const {
    providerUserSessionsListPloc,
    providerSessionRevokePloc,
    providerAuthPloc,
  } = useDependencies()

  const listState = usePlocState<IUserSessionsListState>(
    providerUserSessionsListPloc
  )
  const revokeState = usePlocState<ISessionRevokeState>(
    providerSessionRevokePloc
  )
  const authState = usePlocState<IAuthState>(providerAuthPloc)

  const currentSessionId = authState.user?.sessionId

  useEffect(() => {
    providerUserSessionsListPloc.loadSessions()
  }, [providerUserSessionsListPloc])

  // Recargar la lista si una sesión fue revocada exitosamente
  useEffect(() => {
    if (revokeState.success) {
      providerUserSessionsListPloc.loadSessions()
      const timeoutId = setTimeout(() => {
        providerSessionRevokePloc.reset()
      }, 0)
      return () => clearTimeout(timeoutId)
    }
  }, [
    revokeState.success,
    providerUserSessionsListPloc,
    providerSessionRevokePloc,
  ])

  const handleRevoke = (sessionId: string) => {
    if (window.confirm('¿Estás seguro de que deseas cerrar esta sesión?')) {
      providerSessionRevokePloc.revokeSession(sessionId)
    }
  }

  const formatDate = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleString()
  }

  if (listState.isLoading && listState.sessions.length === 0) {
    return (
      <Card
        h={4}
        w={4}
        title='Sesiones Activas'
      >
        <div className={styles.loadingContainer}>
          <Spinner size='md' />
        </div>
      </Card>
    )
  }

  return (
    <Card
      h={4}
      w={3}
      title='Sesiones Activas'
    >
      {listState.error && (
        <Text
          size='sm'
          color='error'
        >
          {listState.error.detail || 'Error al cargar las sesiones'}
        </Text>
      )}

      {revokeState.error && (
        <Text
          size='sm'
          color='error'
        >
          {revokeState.error.detail || 'Error al revocar la sesión'}
        </Text>
      )}

      <div className={styles.sessionsList}>
        {listState.sessions.length === 0 && !listState.isLoading ? (
          <Text>No hay sesiones activas.</Text>
        ) : (
          listState.sessions.map((session) => {
            const isCurrent = session.id === currentSessionId

            return (
              <div
                key={session.id}
                className={`${styles.sessionRow} ${
                  isCurrent ? styles.active : ''
                }`}
              >
                <div className={styles.sessionInfo}>
                  <Text
                    weight='bold'
                    size='sm'
                    className={styles.sessionInfoText}
                    title={session.deviceInfo || 'Dispositivo desconocido'}
                  >
                    {session.deviceInfo || 'Dispositivo desconocido'}
                  </Text>

                  <div className={styles.sessionMeta}>
                    <Icon
                      name='Monitor'
                      size={14}
                      color='var(--color-text-secondary)'
                    />
                    <Text
                      size='sm'
                      color='muted'
                    >
                      {session.ipAddress || 'IP desconocida'}{' '}
                      {session.location ? `- ${session.location}` : ''}
                    </Text>
                  </div>

                  <div className={styles.sessionMeta}>
                    <Icon
                      name='Clock'
                      size={14}
                      color='var(--color-text-secondary)'
                    />
                    <Text
                      size='sm'
                      color='muted'
                    >
                      Iniciada: {formatDate(session.createdAt)}
                    </Text>
                  </div>

                  {isCurrent && (
                    <div style={{ marginTop: '4px' }}>
                      <Badge variant='success'>Sesión Actual</Badge>
                    </div>
                  )}
                </div>

                {!isCurrent && (
                  <Button
                    className={styles.revokeBtn}
                    onClick={() => handleRevoke(session.id)}
                    disabled={revokeState.isRevoking}
                    title='Cerrar sesión remota'
                  >
                    {revokeState.isRevoking &&
                    revokeState.revokedSessionId === session.id ? (
                      <Spinner size='sm' />
                    ) : (
                      <Icon
                        name='LogOut'
                        size={20}
                      />
                    )}
                  </Button>
                )}
              </div>
            )
          })
        )}
      </div>
    </Card>
  )
}

export default UserSessions
