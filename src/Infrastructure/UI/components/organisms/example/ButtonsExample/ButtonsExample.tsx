import React from 'react';
import Card from '../../../atoms/Card/Card';
import { Button } from '../../../atoms/Button/Button';
import { Divider } from '../../../atoms/Divider/Divider';
import s from './ButtonsExample.module.css';

export const ButtonsExample: React.FC = () => (
  <Card title="Buttons" w={1} h={3}>
    <div className={s.root}>
      <div className={s.sizes}>
        <Button variant="primary" size="sm">
          Primary sm
        </Button>
        <Button variant="primary" size="md">
          Primary md
        </Button>
        <Button variant="primary" size="lg">
          Primary lg
        </Button>
      </div>
      <Divider />
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
      <Divider />
      <Button variant="primary" loading>
        Guardando...
      </Button>
    </div>
  </Card>
);

