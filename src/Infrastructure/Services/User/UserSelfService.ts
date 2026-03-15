import type { IUserSelfService } from '../../../Application/Services/User/IUserSelfService';
import type { IHttpClient, IUserDto, IUpdateUserRequest } from '../../../Domain';

export class UserSelfService implements IUserSelfService {
    private readonly httpClient: IHttpClient;

    constructor(httpClient: IHttpClient) {
        this.httpClient = httpClient;
    }

    async getMe(): Promise<IUserDto> {
        const response = await this.httpClient.get<IUserDto>('/api/v1/users/me');
        return response.data;
    }

    async updateMe(request: IUpdateUserRequest): Promise<IUserDto> {
        const response = await this.httpClient.put<IUserDto>('/api/v1/users/me', request);
        return response.data;
    }
}
