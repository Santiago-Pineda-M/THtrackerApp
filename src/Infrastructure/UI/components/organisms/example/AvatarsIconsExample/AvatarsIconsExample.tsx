import React from 'react';
import Card from '../../../atoms/Card/Card';
import { Avatar } from '../../../atoms/Avatar/Avatar';
import { Icon } from '../../../atoms/Icon/Icon';
import { Text } from '../../../atoms/Text/Text';
import s from './AvatarsIconsExample.module.css';

export const AvatarsIconsExample: React.FC = () => (
  <Card title="Elements & Media" w={1} h={3}>
    <div className={s.container}>
      {/* Avatars Section */}
      <section className={s.section}>
        <Text size="xs" weight="bold" className={s.sectionTitle}>Avatars & Groups</Text>
        <div className={s.group}>
          <div className={s.stacked}>
            <Avatar size="sm" initials="JD" />
            <Avatar size="sm" initials="AS" />
            <Avatar size="sm" initials="UI" />
            <Avatar size="sm" initials="+5" />
          </div>
          <Avatar size="md" initials="MD" />
          <Avatar size="lg" initials="LG" />
        </div>
      </section>

      {/* Icons Section */}
      <section className={s.section}>
        <Text size="xs" weight="bold" className={s.sectionTitle}>System Icons</Text>
        <div className={s.group}>
          <Icon name="Users" color="var(--color-accent)" size={18} />
          <Icon name="DollarSign" color="var(--color-success)" size={18} />
          <Icon name="TrendingUp" color="var(--color-success)" size={18} />
          <Icon name="TrendingDown" color="var(--color-error)" size={18} />
          <Icon name="Clock" color="var(--color-accent)" size={18} />
          <Icon name="LogOut" color="var(--color-text-secondary)" size={18} />
        </div>
      </section>
    </div>
  </Card>
);

export default AvatarsIconsExample;

