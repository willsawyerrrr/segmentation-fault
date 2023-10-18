export interface HTTPValidationError {
    detail: ValidationError[];
}

export interface HTTPValidationErrorExternal {
    detail: ValidationErrorExternal[];
}

export interface ValidationError {
    loc: (string | number)[];
    msg: string;
    type: string;
}

export interface ValidationErrorExternal {
    loc: (string | number)[];
    msg: string;
    type: string;
}
