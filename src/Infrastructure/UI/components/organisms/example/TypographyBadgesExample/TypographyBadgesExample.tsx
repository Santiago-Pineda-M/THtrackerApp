import React from 'react';
import Card from '../../../atoms/Card/Card';
import { Text } from '../../../atoms/Text/Text';
import { Badge } from '../../../atoms/Badge/Badge';
import { Divider } from '../../../atoms/Divider/Divider';
import s from './TypographyBadgesExample.module.css';

export const TypographyBadgesExample: React.FC = () => (
  <Card title="Typography & Badges" w={2} h={2}>
    <div className={s.root}>
      <div className={s.header}>
        <Text as="h3" size="lg" weight="bold">
          Bento Title System
        </Text>
        <Text>
          Texto de cuerpo usando la tipografía base del sistema. Ideal para contenido principal.
        </Text>
        <Text size="sm" muted>
          Caption para notas, ayudas contextuales o información secundaria.
        </Text>
      </div>
      <Divider />
      <div className={s.badgesRow}>
        <Badge variant="default">Default</Badge>
        <Badge variant="success">Success</Badge>
        <Badge variant="warning">Warning</Badge>
        <Badge variant="danger">Danger</Badge>
        <Badge variant="info">Info</Badge>
      </div>
    </div>
  </Card>
);

