import React from 'react';
import styles from './StatCard.module.css';
import { Text } from '../../atoms';
import { Icon, type IconName } from '../../atoms/Icon/Icon';

interface StatCardProps {
  label: string;
  value: string | number;
  trend?: number; // positive or negative percentage
  trendLabel?: string;
  icon?: IconName;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  trend,
  trendLabel,
  icon,
  className = ''
}) => {
  const isPositive = trend !== undefined && trend > 0;
  const isNegative = trend !== undefined && trend < 0;

  return (
    <div className={`${styles.statCard} ${className}`}>
      <div className={styles.header}>
        <Text size="sm" className={styles.label}>{label}</Text>
        {icon && (
          <div className={styles.iconWrapper}>
            <Icon name={icon} size={18} />
          </div>
        )}
      </div>

      <div className={styles.content}>
        <Text as="h3" size="lg" weight="bold" className={styles.value}>{value}</Text>

        {trend !== undefined && (
          <div className={`${styles.trend} ${isPositive ? styles.positive : isNegative ? styles.negative : styles.neutral}`}>
            <Icon name={isPositive ? 'TrendingUp' : isNegative ? 'TrendingDown' : 'Minus'} size={14} />
            <span className={styles.trendValue}>{Math.abs(trend)}%</span>
            {trendLabel && <span className={styles.trendLabel}>{trendLabel}</span>}
          </div>
        )}
      </div>
    </div>
  );
};
