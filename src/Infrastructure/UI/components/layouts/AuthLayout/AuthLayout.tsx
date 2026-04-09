import React from 'react'
import { Text } from '../../atoms/Text/Text'
import styles from './AuthLayout.module.css'

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <Text
            as='h1'
            size='xl'
            weight='bold'
            className={styles.title}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              as='p'
              size='sm'
              className={styles.subtitle}
            >
              {subtitle}
            </Text>
          )}
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  )
}

export default AuthLayout
