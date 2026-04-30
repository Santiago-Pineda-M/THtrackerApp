import React from 'react'
import { Sidebar } from '../../organisms/Sidebar/Sidebar'
import { BreadcrumbNavigation } from '../../molecules/BreadcrumbNavigation/BreadcrumbNavigation'
import styles from './MainLayout.module.scss'

interface Breadcrumb {
  label: string
  path?: string
  onClick?: () => void
}

interface MainLayoutProps {
  children: React.ReactNode
  breadcrumbs?: Breadcrumb[]
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  breadcrumbs,
}) => {
  return (
    <main className={styles.main}>
      <Sidebar />
      <div className={styles.mainContainer}>
        {breadcrumbs && <BreadcrumbNavigation breadcrumbs={breadcrumbs} />}
        <div className={styles.content}>{children}</div>
      </div>
    </main>
  )
}

export default MainLayout
