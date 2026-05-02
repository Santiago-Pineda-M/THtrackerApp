import React from 'react'
import { Text, Icon } from '../../atoms'
import { AuthInfo } from './AuthInfo'
import styles from './AuthLayout.module.scss'

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
      <div className={styles.layoutWrapper}>
        <div className={styles.infoColumn}>
          <AuthInfo />
        </div>

        <div className={styles.formColumn}>
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
          <div className={styles.chevronDownContainer}>
            <Icon
              name='ChevronDown'
              size={48}
              className={styles.arrowDown}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
