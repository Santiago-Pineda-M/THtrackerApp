import { useEffect } from 'react';
import { usePlocState } from './usePlocState';
import { dependenciesLocator } from '../DI/DependenciesLocator';
import type { UserProfileState } from '../../Controllers/User/UserPloc';
import type { IUpdateUserRequest } from '../../Domain';

export function useUserProfile() {
    const userPloc = dependenciesLocator.provideUserPloc();
    const state = usePlocState<UserProfileState>(userPloc);

    useEffect(() => {
        if (!state.profile && !state.isLoading && !state.error) {
            userPloc.loadProfile();
        }
    }, [userPloc, state.profile, state.isLoading, state.error]);

    const updateProfile = (request: IUpdateUserRequest) => userPloc.updateProfile(request);
    const reloadProfile = () => userPloc.loadProfile();

    return {
        ...state,
        updateProfile,
        reloadProfile,
    };
}
