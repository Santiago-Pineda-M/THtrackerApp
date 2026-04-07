import React from 'react'
import { Card, Text, Divider } from '../../components'
import { MainLayout } from '../../components/layouts'

export const DashboardPage: React.FC = () => {
  const breadcrumbs = [{ label: 'Dashboard' }]

  return (
    <MainLayout breadcrumbs={breadcrumbs}>
      {/* Bienvenida */}
      <Card
        title='Bienvenido al Dashboard'
        w={2}
        h={1}
      >
        <div>
          <Text
            size='lg'
            as='h3'
            weight='bold'
          >
            ¡Hola, Usuario!
          </Text>
          <Text size='md'>
            Bienvenido al sistema THtracker. Aquí podrás gestionar tus datos.
          </Text>
        </div>
      </Card>

      {/* Acciones */}
      <Card
        title='Acciones'
        w={1}
        h={2}
      >
        <div>
          <Text size='md'>
            Próximamente más funciones de tu sistema THtracker.
          </Text>
          <Divider />
        </div>
      </Card>
    </MainLayout>
  )
}

export default DashboardPage
