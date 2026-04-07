import React, { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Card, Button, Icon, Text, Divider } from '../../atoms'
import { usePlocState } from '../../../../Hooks/usePlocState'
import { useDependencies } from '../../../../Context/useDependencies'
import type { IAuthState, ISidebarState } from '../../../../../Domain'
import styles from './Sidebar.module.css'

// Función para verificar si la ruta actual coincide con el patrón (incluyendo subrutas)
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

  return (
    <Card className={`${styles.sidebar}`}>
      <div className={styles.header}>
        <Text
          as='h2'
          size='lg'
          weight='bold'
          className={styles.logo}
        >
          {sidebarState.isMenuOpen ? 'THtracke' : 'TH'}
        </Text>
        {/* btn para alternar el menú en pc */}
        <Button
          variant='ghost'
          size='sm'
          onClick={() => providerSidebarPloc.toggleMenu()}
        >
          <Icon
            name={sidebarState.isMenuOpen ? 'X' : 'Menu'}
            size={18}
          />
        </Button>
      </div>
      <Divider />
      <nav
        className={`${styles.nav} ${!sidebarState.isMenuOpen ? styles.navMenuClosed : ''}`}
      >
        <Link
          to='/dashboard'
          className={`${styles.link} ${isRouteActive(location.pathname, '/dashboard') ? styles.active : ''}`}
        >
          <Icon
            name='Home'
            size={20}
          />
          {sidebarState.isMenuOpen && <span>Inicio</span>}
        </Link>
        <Link
          to='/activities'
          className={`${styles.link} ${isRouteActive(location.pathname, '/activities') ? styles.active : ''}`}
        >
          <Icon
            name='Activity'
            size={20}
          />
          {sidebarState.isMenuOpen && <span>Actividades</span>}
        </Link>
        <Link
          to='/example'
          className={`${styles.link} ${isRouteActive(location.pathname, '/example') ? styles.active : ''}`}
        >
          <Icon
            name='FileText'
            size={20}
          />
          {sidebarState.isMenuOpen && <span>Ejemplos</span>}
        </Link>
        <Link
          to='/user-profile'
          className={`${styles.link} ${isRouteActive(location.pathname, '/user-profile') ? styles.active : ''}`}
        >
          <Icon
            name='User'
            size={20}
          />
          {sidebarState.isMenuOpen && <span>Perfil</span>}
        </Link>
      </nav>
      <Divider />
      <div className={styles.footer}>
        {userEmail && sidebarState.isMenuOpen && (
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
          size='md'
          onClick={handleLogout}
        >
          <Icon
            name='LogOut'
            size={18}
          />
          {sidebarState.isMenuOpen && <span>Cerrar Sesión</span>}
        </Button>
      </div>
    </Card>
  )
}

export default Sidebar
