export interface User {
    id: number;
    created: Date;
    updated?: Date;
    username: string;
    email: string;
    super: boolean;
    firstName: string;
    lastName: string;
}

export interface UserCreate {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export interface UserCreateExternal {
    username: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
}

export interface UserExternal {
    id: number;
    created: string;
    updated?: string;
    username: string;
    email: string;
    super: boolean;
    first_name: string;
    last_name: string;
}

export interface UserUpdate {
    username?: string;
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
}

export interface UserUpdateExternal {
    username?: string;
    email?: string;
    password?: string;
    first_name?: string;
    last_name?: string;
}
