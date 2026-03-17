import React from 'react';
import Card from '../../../atoms/Card/Card';
import { Spinner } from '../../../atoms/Spinner/Spinner';
import { Text } from '../../../atoms/Text/Text';
import s from './SpinnersExample.module.css';

export const SpinnersExample: React.FC = () => (
  <Card title="Spinners" w={1} h={2}>
    <div className={s.column}>
      <div className={s.row}>
        <Spinner size="sm" />
        <Text size="sm">Spinner sm</Text>
      </div>
      <div className={s.row}>
        <Spinner size="md" />
        <Text size="sm">Spinner md</Text>
      </div>
      <div className={s.row}>
        <Spinner size="lg" />
        <Text size="sm">Spinner lg</Text>
      </div>
    </div>
  </Card>
);

