
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './BreadcrumbNavigation.module.css';
import { Text } from '../../atoms/Text/Text';

interface Breadcrumb {
    label: string;
    path?: string;
    onClick?: () => void;
}

interface BreadcrumbNavigationProps {
    breadcrumbs: Breadcrumb[];
}

export const BreadcrumbNavigation: React.FC<BreadcrumbNavigationProps> = ({ breadcrumbs }) => {
    const navigate = useNavigate();

    return (
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <ol className={styles.list}>
                {breadcrumbs.map((crumb, index) => {
                    const isLast = index === breadcrumbs.length - 1;
                    return (
                        <li key={index} className={styles.item}>
                            {isLast ? (
                                <Text size='lg'  >{crumb.label}</Text>
                            ) : crumb.path ? (
                                <Text size='lg' onClick={() => navigate(crumb.path || '/')} style={{ cursor: 'pointer' }}>{crumb.label}</Text>
                            ) : crumb.onClick ? (
                                <Text size='lg' onClick={crumb.onClick} style={{ cursor: 'pointer' }}>{crumb.label}</Text>
                            ) : (
                                <Text size='lg'>{crumb.label}</Text>
                            )}
                            {!isLast && <Text  size='lg' >{'>'}</Text>}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default BreadcrumbNavigation;