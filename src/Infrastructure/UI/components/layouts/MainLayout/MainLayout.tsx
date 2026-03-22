import React from 'react';
import { Sidebar } from '../../organisms/Sidebar/Sidebar';
import styles from './MainLayout.module.css';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ 
  children 
}) => {
  return (
    <main className={styles.main}>
      <Sidebar />
      <div className={styles.content}>
        {children}
      </div>
    </main>
  );
};

export default MainLayout;
