export interface ForgotPasswordForm {
    email: string;
}

export interface ForgotPasswordFormExternal {
    email: string;
}

export interface LoginForm {
    username: string;
    password: string;
}

export interface LoginFormExternal {
    username: string;
    password: string;
}

export interface ResetPasswordForm {
    token: string;
    password: string;
}

export interface ResetPasswordFormExternal {
    token: string;
    password: string;
}

export interface Token {
    accessToken: string;
    tokenType: string;
}

export interface TokenExternal {
    access_token: string;
    token_type: string;
}
