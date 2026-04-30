import React, { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Card, Button, Icon, Text, Divider, type IconProps } from '../../atoms'
import { usePlocState } from '../../../../Hooks/usePlocState'
import { useDependencies } from '../../../../Context/useDependencies'
import type { IAuthState, ISidebarState } from '../../../../../Domain'
import styles from './Sidebar.module.scss'

interface NavItem {
  path: string
  label: string
  icon?: IconProps['name']
}

const NAV_ITEMS: NavItem[] = [
  { path: '/dashboard', label: 'Inicio', icon: 'Home' },
  { path: '/activities', label: 'Actividades', icon: 'Activity' },
  { path: '/task-lists', label: 'Listas de Tareas', icon: 'List' },
  { path: '/example', label: 'Ejemplos', icon: 'FileText' },
  { path: '/user-profile', label: 'Perfil', icon: 'User' },
]

const isRouteActive = (currentPath: string, targetRoute: string): boolean => {
  const pattern = new RegExp(`^${targetRoute}(/.*)?$`)
  return pattern.test(currentPath)
}

export const Sidebar: React.FC = () => {
  const { providerLogoutPloc, providerAuthPloc, providerSidebarPloc } =
    useDependencies()
  const authState = usePlocState<IAuthState>(providerAuthPloc)
  const sidebarState = usePlocState<ISidebarState>(providerSidebarPloc)
  const location = useLocation()

  // Inicializar el estado del Sidebar desde localStorage
  useEffect(() => {
    providerSidebarPloc.init()
  }, [providerSidebarPloc])

  const userEmail = authState.user?.email

  const handleLogout = () => {
    providerLogoutPloc.logout()
  }

  const isOpen = sidebarState.isMenuOpen
  const sidebarClass = `${styles.sidebar} ${isOpen ? styles.sidebarOpen : styles.sidebarClosed}`
  const iconSize = isOpen ? 20 : 18

  return (
    <Card className={sidebarClass}>
      <div className={`${styles.header} ${isOpen ? styles.headerOpen : ''}`}>
        <Text
          as='h2'
          size='lg'
          weight='bold'
          className={styles.logo}
        >
          {isOpen ? 'THtracker' : 'TH'}
        </Text>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => providerSidebarPloc.toggleMenu()}
        >
          <Icon
            name={isOpen ? 'X' : 'Menu'}
            size={24}
          />
        </Button>
      </div>
      <Divider spacing='md' />
      <nav className={`${styles.nav} ${!isOpen ? styles.navMenuClosed : ''}`}>
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`${styles.link} ${isRouteActive(location.pathname, item.path) ? styles.active : ''}`}
          >
            <Icon
              name={item.icon ?? 'FileText'}
              size={iconSize}
              className={styles.linkIcon}
            />
            {isOpen && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>
      <Divider spacing='md' />
      <div className={styles.footer}>
        {userEmail && isOpen && (
          <Text
            size='xs'
            className={`${styles.email} ${!isOpen ? styles.hidden : ''}`}
            title={userEmail}
          >
            {userEmail}
          </Text>
        )}
        <Button
          variant='danger'
          size='sm'
          onClick={handleLogout}
          className={styles.logoutButton}
        >
          <Icon
            name='LogOut'
            size={iconSize}
          />
          {isOpen && <span>Cerrar Sesión</span>}
        </Button>
      </div>
    </Card>
  )
}

export default Sidebar
