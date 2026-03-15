import type { IUserDto, IUpdateUserRequest } from '../../../Domain';

export interface IUserSelfService {
    getMe(): Promise<IUserDto>;
    updateMe(request: IUpdateUserRequest): Promise<IUserDto>;
}
