import React from 'react'
import Card from '../../../atoms/Card/Card'
import { Table } from '../../../molecules/Table/Table'
import { useDependencies } from '../../../../../Context/useDependencies'
import { usePlocState } from '../../../../../Hooks/usePlocState'
import type { IAuthState } from '../../../../../../Domain'
import type { AuthSession } from '../../../../../../Domain/Entities/AuthSession'

export const AuthSessionExample: React.FC = () => {
  const { providerAuthPloc } = useDependencies()
  const authState = usePlocState<IAuthState>(providerAuthPloc)

  // Convertir el estado a filas de tabla
  const getStateRows = (): Record<string, React.ReactNode>[] => {
    const rows: Record<string, React.ReactNode>[] = [
      { key: 'status', value: authState.status },
    ]

    if (authState.user) {
      const session = authState.user as AuthSession
      rows.push(
        { key: 'user.id', value: session.userId },
        { key: 'user.email', value: session.email },
        { key: 'user.name', value: session.name || 'N/A' },
        {
          key: 'user.accessToken',
          value: session.accessToken
            ? `${session.accessToken.substring(0, 30)}...`
            : 'N/A',
        },
        {
          key: 'user.refreshToken',
          value: session.refreshToken
            ? `${session.refreshToken.substring(0, 30)}...`
            : 'N/A',
        },
        {
          key: 'user.accessTokenExpiresAt',
          value: session.accessTokenExpiresAt
            ? new Date(session.accessTokenExpiresAt).toLocaleString()
            : 'N/A',
        },
        {
          key: 'user.refreshTokenExpiresAt',
          value: session.refreshTokenExpiresAt
            ? new Date(session.refreshTokenExpiresAt).toLocaleString()
            : 'N/A',
        },
        { key: 'user.isValid', value: session.isValid() ? 'true' : 'false' },
        {
          key: 'user.isAccessTokenExpired',
          value: session.isAccessTokenExpired() ? 'true' : 'false',
        },
        {
          key: 'user.isRefreshTokenExpired',
          value: session.isRefreshTokenExpired() ? 'true' : 'false',
        }
      )
    } else {
      rows.push({ key: 'user', value: 'null' })
    }

    return rows
  }

  const columns = [
    { key: 'key', label: 'Clave' },
    { key: 'value', label: 'Valor' },
  ]

  const rows = getStateRows()

  return (
    <Card
      title='Auth Session State'
      w={2}
      h={4}
    >
      <Table
        columns={columns}
        rows={rows}
      />
    </Card>
  )
}
