/**
 * PRESENTATION LAYER - User PLOC
 * Business Logic Component para gestionar los datos del usuario.
 */

import { Ploc } from '../../Domain/Ploc';
import { GetUserProfileUseCase, UpdateUserProfileUseCase } from '../../Application/UseCases/User';
import type { IUserDto, IUpdateUserRequest } from '../../Domain';

export interface UserProfileState {
    profile: IUserDto | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: UserProfileState = {
    profile: null,
    isLoading: false,
    error: null,
};

export class UserPloc extends Ploc<UserProfileState> {
    private readonly getUserProfileUseCase: GetUserProfileUseCase;
    private readonly updateUserProfileUseCase: UpdateUserProfileUseCase;

    constructor(
        getUserProfileUseCase: GetUserProfileUseCase,
        updateUserProfileUseCase: UpdateUserProfileUseCase
    ) {
        super(initialState);
        this.getUserProfileUseCase = getUserProfileUseCase;
        this.updateUserProfileUseCase = updateUserProfileUseCase;
    }

    async loadProfile(): Promise<void> {
        this.changeState({ ...this.state, isLoading: true, error: null });
        try {
            const profile = await this.getUserProfileUseCase.execute();
            this.changeState({ ...this.state, profile, isLoading: false });
        } catch (error) {
            this.changeState({
                ...this.state,
                isLoading: false,
                error: error instanceof Error ? error.message : 'Error al cargar el perfil'
            });
        }
    }

    async updateProfile(request: IUpdateUserRequest): Promise<void> {
        this.changeState({ ...this.state, isLoading: true, error: null });
        try {
            const profile = await this.updateUserProfileUseCase.execute(request);
            this.changeState({ ...this.state, profile, isLoading: false });
        } catch (error) {
            this.changeState({
                ...this.state,
                isLoading: false,
                error: error instanceof Error ? error.message : 'Error al actualizar el perfil'
            });
        }
    }
}
