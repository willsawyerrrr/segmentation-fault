import {
    ForgotPasswordForm,
    ForgotPasswordFormExternal,
    ResetPasswordForm,
    ResetPasswordFormExternal,
    Token,
    TokenExternal,
} from "../schemas";

export function internaliseToken(token: TokenExternal): Token {
    return {
        accessToken: token.access_token,
        tokenType: token.token_type,
    };
}

export function externaliseForgotPasswordForm(
    forgotPasswordForm: ForgotPasswordForm
): ForgotPasswordFormExternal {
    return {
        email: forgotPasswordForm.email,
    };
}

export function externaliseResetPasswordForm(
    resetPasswordForm: ResetPasswordForm
): ResetPasswordFormExternal {
    return {
        token: resetPasswordForm.token,
        password: resetPasswordForm.password,
    };
}
