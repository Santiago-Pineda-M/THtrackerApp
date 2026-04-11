import React from 'react'
import {
  UserProfileDisplay,
  UserProfileForm,
  UserSessions,
} from '../../components/organisms'
import { MainLayout } from '../../components/layouts'

const UserProfilePage: React.FC = () => {
  const breadcrumbs = [{ label: 'Perfil' }]

  return (
    <MainLayout breadcrumbs={breadcrumbs}>
      <UserProfileDisplay />
      <UserProfileForm />
      <UserSessions />
    </MainLayout>
  )
}

export default UserProfilePage
