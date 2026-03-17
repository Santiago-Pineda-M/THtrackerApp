import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Sidebar.module.css';
import Card from '../../atoms/Card/Card';

export const Sidebar: React.FC = () => {
    return (
        <Card w={1} h={2} title='menu' gridTopRight={true}>
            <nav className={styles.nav}>
                <Link to="/dashboard" className={styles.link}>DASHBOARD</Link>
                <Link to="/profile" className={styles.link}>PERFIL</Link>
            </nav>
        </Card>
    );
};
