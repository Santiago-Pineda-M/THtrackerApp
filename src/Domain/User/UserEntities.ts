/**
 * DOMAIN LAYER - User Entities
 */

import type { IUserDto } from './IUserSelfResponse';

export interface IUser {
    id: string;
    name: string | null;
    email: string | null;
}

export class User implements IUser {
    public readonly id: string;
    public readonly name: string | null;
    public readonly email: string | null;

    private constructor(id: string, name: string | null, email: string | null) {
        this.id = id;
        this.name = name;
        this.email = email;
    }

    static create(props: IUserDto): User {
        return new User(props.id, props.name, props.email);
    }
}
