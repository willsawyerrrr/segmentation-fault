import {
    HTTPValidationError,
    HTTPValidationErrorExternal,
    ValidationError,
    ValidationErrorExternal,
} from "../schemas";

export function internaliseHTTPValidationError(
    httpValidationError: HTTPValidationErrorExternal
): HTTPValidationError {
    return {
        detail: httpValidationError.detail,
    };
}

export function internaliseValidationError(
    validationError: ValidationErrorExternal
): ValidationError {
    return {
        loc: validationError.loc,
        msg: validationError.msg,
        type: validationError.type,
    };
}
