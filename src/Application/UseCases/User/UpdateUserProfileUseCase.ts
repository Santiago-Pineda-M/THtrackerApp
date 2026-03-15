import type { IUseCase, IUpdateUserRequest, IUserDto } from '../../../Domain';
import type { IUserSelfService } from '../../Services/User/IUserSelfService';

export class UpdateUserProfileUseCase implements IUseCase<IUpdateUserRequest, IUserDto> {
    private readonly userService: IUserSelfService;

    constructor(userService: IUserSelfService) {
        this.userService = userService;
    }

    async execute(request: IUpdateUserRequest): Promise<IUserDto> {
        return this.userService.updateMe(request);
    }
}
