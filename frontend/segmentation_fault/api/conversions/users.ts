import { internaliseDate } from ".";
import {
    User,
    UserCreate,
    UserCreateExternal,
    UserExternal,
    UserUpdate,
    UserUpdateExternal,
} from "../schemas";

export function internaliseUser(user: UserExternal): User {
    return {
        id: user.id,
        created: new Date(user.created),
        updated: internaliseDate(user.updated),
        username: user.username,
        email: user.email,
        super: user.super,
        firstName: user.first_name,
        lastName: user.last_name,
    };
}

export function externaliseUserCreate(userCreate: UserCreate): UserCreateExternal {
    return {
        username: userCreate.username,
        email: userCreate.email,
        password: userCreate.password,
        first_name: userCreate.firstName,
        last_name: userCreate.lastName,
    };
}

export function externaliseUserUpdate(userUpdate: UserUpdate): UserUpdateExternal {
    return {
        username: userUpdate.username,
        email: userUpdate.email,
        password: userUpdate.password,
        first_name: userUpdate.firstName,
        last_name: userUpdate.lastName,
    };
}
