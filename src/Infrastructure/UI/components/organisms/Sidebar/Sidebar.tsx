import React, { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Card, Button, Icon, Text, Divider, type IconProps } from '../../atoms'
import { usePlocState } from '../../../../Hooks/usePlocState'
import { useDependencies } from '../../../../Context/useDependencies'
import type { IAuthState, ISidebarState } from '../../../../../Domain'
import styles from './Sidebar.module.css'

interface NavItem {
  path: string
  label: string
  icon?: IconProps['name']
}

const NAV_ITEMS: NavItem[] = [
  { path: '/dashboard', label: 'Inicio', icon: 'Home' },
  { path: '/activities', label: 'Actividades', icon: 'Activity' },
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
  const navigate = useNavigate()

  // Inicializar el estado del Sidebar desde localStorage
  useEffect(() => {
    providerSidebarPloc.init()
  }, [providerSidebarPloc])

  const userEmail = authState.user?.email

  const handleLogout = () => {
    providerLogoutPloc.logout()
    navigate('/login')
  }

  const isOpen = sidebarState.isMenuOpen
  const sidebarClass = `${styles.sidebar} ${isOpen ? styles.sidebarOpen : styles.sidebarClosed}`
  const iconSize = isOpen ? 20 : 18

  return (
    <Card className={sidebarClass}>
      <div className={styles.header}>
        <Text
          as='h2'
          size='lg'
          weight='bold'
          className={styles.logo}
        >
          {isOpen ? 'THtracke' : 'TH'}
        </Text>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => providerSidebarPloc.toggleMenu()}
        >
          <Icon
            name={isOpen ? 'X' : 'Menu'}
            size={16}
          />
        </Button>
      </div>
      <Divider />
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
      <Divider />
      <div className={styles.footer}>
        {userEmail && isOpen && (
          <Text
            size='xs'
            className={styles.email}
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
