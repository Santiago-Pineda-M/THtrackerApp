import React from 'react';
import Card from '../../../atoms/Card/Card';
import { ProgressBar } from '../../../molecules/ProgressBar/ProgressBar';
import s from './ProgressBarsExample.module.css';

export const ProgressBarsExample: React.FC = () => (
  <Card title="Progress Bars" w={1} h={2}>
    <div className={s.column}>
      <ProgressBar value={75} variant="success" label="Onboarding" />
      <ProgressBar value={40} variant="warning" label="Backlog" />
      <ProgressBar value={92} variant="danger" label="Errores críticos" />
    </div>
  </Card>
);

