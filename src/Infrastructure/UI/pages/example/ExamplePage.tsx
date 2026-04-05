import React from 'react';
import {
  TypographyBadgesExample,
  ButtonsExample,
  InputsControlsExample,
  StatsMetricsExample,
  ProgressBarsExample,
  TableExample,
  SpinnersExample,
  AvatarsIconsExample,
  AuthSessionExample,
} from '../../components/organisms';
import { MainLayout } from '../../components/layouts';

const ExamplePage: React.FC = () => {
  const breadcrumbs = [
    { label: 'Ejemplos' }
  ];

  return (
    <MainLayout breadcrumbs={breadcrumbs}>
      <TypographyBadgesExample />
      <AuthSessionExample />
      <ButtonsExample />
      <InputsControlsExample />
      <StatsMetricsExample />
      <ProgressBarsExample />
      <TableExample />
      <SpinnersExample />
      <AvatarsIconsExample />
    </MainLayout>
  );
};

export default ExamplePage;
