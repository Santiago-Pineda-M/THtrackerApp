import React from 'react'
import { UserProfileDisplay, UserProfileForm } from '../../components/organisms'
import { MainLayout } from '../../components/layouts'

const UserProfilePage: React.FC = () => {
  const breadcrumbs = [{ label: 'Perfil de Usuario' }]

  return (
    <MainLayout breadcrumbs={breadcrumbs}>
      <UserProfileDisplay />
      <UserProfileForm />
    </MainLayout>
  )
}

export default UserProfilePage
