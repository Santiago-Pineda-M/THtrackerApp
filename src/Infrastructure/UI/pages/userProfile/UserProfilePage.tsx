import React from 'react';
import { UserProfileDisplay, UserProfileForm } from '../../components/organisms';
import { MainLayout } from '../../components/layouts';

const UserProfilePage: React.FC = () => {
  return (
    <MainLayout>
      <UserProfileDisplay />
      <UserProfileForm />
    </MainLayout>
  );
};

export default UserProfilePage;
