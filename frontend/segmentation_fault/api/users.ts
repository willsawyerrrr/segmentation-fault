import { get, httpDelete, post, put } from ".";
import { externaliseUserUpdate, internaliseUser } from "./conversions";
import { User, UserCreate, UserExternal, UserUpdate } from "./schemas";

const ROUTE_PREFIX = "/users";

export async function getUsers(): Promise<User[]> {
    const [status, retrievedUsers] = await get<UserExternal[]>(`${ROUTE_PREFIX}/`);

    if (status === 200) {
        return retrievedUsers.map(internaliseUser);
    } else {
        throw new Error("Unknown error");
    }
}

export async function createUser(user: UserCreate): Promise<User> {
    const [status, createdUser] = await post<UserExternal>(
        `${ROUTE_PREFIX}/`,
        JSON.stringify(user)
    );

    if (status === 201) {
        return internaliseUser(createdUser);
    } else {
        throw new Error("Unknown error");
    }
}

export async function getUser(userId: number): Promise<User> {
    const [status, retrievedUser] = await get<UserExternal>(`${ROUTE_PREFIX}/${userId}`);

    if (status === 200) {
        return internaliseUser(retrievedUser);
    } else if (status === 404) {
        throw new Error(`User '${userId}' not found`);
    } else {
        throw new Error("Unknown error");
    }
}

export async function updateUser(userId: number, user: UserUpdate): Promise<User> {
    const [status, updatedUser] = await put<UserExternal>(
        `${ROUTE_PREFIX}/${userId}`,
        JSON.stringify(externaliseUserUpdate(user))
    );

    if (status === 200) {
        return internaliseUser(updatedUser);
    } else if (status === 404) {
        throw new Error(`User '${userId}' not found`);
    } else {
        throw new Error("Unknown error");
    }
}

export async function deleteUser(userId: number): Promise<void> {
    const [status, _] = await httpDelete(`${ROUTE_PREFIX}/${userId}`);

    if (status === 404) {
        throw new Error(`User '${userId}' not found`);
    } else if (status !== 200) {
        throw new Error("Unknown error");
    }
}

export function getUserImage(userId: number): string {
    return `${import.meta.env.VITE_API_URL}${ROUTE_PREFIX}/${userId}/image`;
}

export async function uploadUserImage(userId: number, image: string) {
    const form = new FormData();
    form.append("image", await fetch(image).then((response) => response.blob()));

    const [status, _] = await post<string>(
        `${ROUTE_PREFIX}/${userId}/image`,
        form,
        undefined,
        false
    );

    if (status === 404) {
        throw new Error(`User '${userId}' not found`);
    } else if (status !== 200) {
        throw new Error("Unknown error");
    }
}
