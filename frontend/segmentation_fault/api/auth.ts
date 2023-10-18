import { get, post } from ".";
import {
    externaliseForgotPasswordForm,
    externaliseResetPasswordForm,
    externaliseUserCreate,
    internaliseToken,
    internaliseUser,
} from "./conversions";
import {
    ForgotPasswordForm,
    LoginForm,
    ResetPasswordForm,
    Token,
    TokenExternal,
    User,
    UserCreate,
    UserExternal,
} from "./schemas";

const ROUTE_PREFIX = "/auth";

export async function login(credentials: LoginForm): Promise<Token> {
    const form = new FormData();
    form.append("username", credentials.username);
    form.append("password", credentials.password);

    const [status, token] = await post<TokenExternal>(
        `${ROUTE_PREFIX}/login`,
        form,
        undefined,
        false
    );

    if (status === 200) {
        return internaliseToken(token);
    } else if (status === 401) {
        throw new Error("Invalid credentials");
    } else {
        throw new Error("Unknown error");
    }
}

export async function signUp(user: UserCreate): Promise<User> {
    const [status, createdUser] = await post<UserExternal>(
        `${ROUTE_PREFIX}/sign-up`,
        JSON.stringify(externaliseUserCreate(user))
    );

    if (status === 200) {
        return internaliseUser(createdUser);
    } else if (status === 409) {
        throw new Error("Username or email already taken");
    } else {
        throw new Error("Unknown error");
    }
}

export async function verifyEmail(token: string) {
    await post<boolean>(`${ROUTE_PREFIX}/verify-email?token=${token}`);
}

export async function forgotPassword(forgotPasswordForm: ForgotPasswordForm) {
    await post<boolean>(
        `${ROUTE_PREFIX}/forgot-password`,
        JSON.stringify(externaliseForgotPasswordForm(forgotPasswordForm))
    );
}

export async function resetPassword(resetPasswordForm: ResetPasswordForm) {
    await post<boolean>(
        `${ROUTE_PREFIX}/reset-password`,
        JSON.stringify(externaliseResetPasswordForm(resetPasswordForm))
    );
}

export async function getCurrentUser(): Promise<User> {
    const [status, user] = await get<UserExternal>(`${ROUTE_PREFIX}/`);

    if (status === 200) {
        return internaliseUser(user);
    } else if (status === 401) {
        throw new Error("Invalid credentials");
    } else {
        throw new Error("Unknown error");
    }
}
