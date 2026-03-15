import type { IUseCase, IUserDto } from '../../../Domain';
import type { IUserSelfService } from '../../Services/User/IUserSelfService';

export class GetUserProfileUseCase implements IUseCase<void, IUserDto> {
    private readonly userService: IUserSelfService;

    constructor(userService: IUserSelfService) {
        this.userService = userService;
    }

    async execute(): Promise<IUserDto> {
        return this.userService.getMe();
    }
}
