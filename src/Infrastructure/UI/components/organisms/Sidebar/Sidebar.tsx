import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Card, Button, Icon, Text, Divider } from '../../atoms';
import { usePlocState } from '../../../../Hooks/usePlocState';
import { useDependencies } from '../../../../Context/DependenciesProvider';
import type { IAuthState } from '../../../../../Domain';
import styles from './Sidebar.module.css';

export const Sidebar: React.FC = () => {
  const { providerLogoutPloc, providerAuthPloc } = useDependencies();
  const authState = usePlocState<IAuthState>(providerAuthPloc);
  const location = useLocation();
  const navigate = useNavigate();
  // funcion de menu desplegado o contraido
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const userEmail = authState.user?.email;

  const handleLogout = () => {
    providerLogoutPloc.logout();
    navigate('/login');
  };

  return (
    <Card className={`${styles.sidebar}`}>
      <div className={styles.header}>
        <Text as="h2" size="lg" weight="bold" className={styles.logo}>
          {isMenuOpen ? 'THtracke' : 'TH'}
        </Text>
        {/* btn para alternar el menú en pc */}
        <Button
          variant='ghost'
          size="sm"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Icon name={isMenuOpen ? "X" : "Menu"} size={18} />
        </Button>
      </div>
      <Divider />
      <nav className={ `${styles.nav} ${!isMenuOpen ? styles.navMenuClosed : ''}`}>
        <Link
          to="/dashboard"
          className={`${styles.link} ${location.pathname === '/dashboard' ? styles.active : ''}`}
        >
          <Icon name="TrendingUp" size={20} />
          {isMenuOpen && <span>Dashboard</span>}
        </Link>
        <Link
          to="/example"
          className={`${styles.link} ${location.pathname === '/example' ? styles.active : ''}`}
        >
          <Icon name="Users" size={20} />
          {isMenuOpen && <span>Ejemplos</span>}
        </Link>
      </nav>
      <Divider />
      <div className={styles.footer}>
        {(userEmail && isMenuOpen) && (
          <Text size="xs" className={styles.email} title={userEmail}>
            {userEmail}
          </Text>
        )}
        <Button
          variant='danger'
          size="md"
          onClick={handleLogout}
        >
          <Icon name="LogOut" size={18} />
          {isMenuOpen && <span>Cerrar Sesión</span>}
        </Button>
      </div>
    </Card>
  );
};

export default Sidebar;
