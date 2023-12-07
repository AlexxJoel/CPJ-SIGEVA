export type ResponseApi<T> = {
    code: number,
    error?: boolean,
    message?: string,
    data?: T;
}

export const enum Errors {
    BAD_REQUEST = 'Bad Request',
    INCORRECT_CREDENTIALS = 'Incorrect credentials',
    MISSING_ID = 'Missing id',
    MISSING_FIELDS = 'Missing fields',
    INVALID_FIELDS = 'Invalid fields',
    INVALID_TOKEN = 'Invalid Token',
    ALREADY_EXISTS = 'Already exists',
    NOT_AVAILABLE = 'Not available',
    USER_DISABLED = 'User disabled',
    EXPIRED_TOKEN = 'Expired Token',
    UNAUTHORIZED = 'Unauthorized',
    FORBIDDEN = 'Forbidden',
    USER_NOT_ACTIVE = 'User not active',
    NOT_FOUND = 'Not found',
    ERROR_SAVING = 'Error saving',
    ERROR_UPDATING = 'Error updating',
    ERROR_DELETING = 'Error deleting',
    ERROR_SENDING_EMAIL = 'Error sending email',
    SERVER_ERROR = 'Server Error',
}

const errors: { [x: string]: ResponseApi<undefined> } = {
    'Bad Request': {code: 400, error: true, message: 'Bad Request'},
    'Incorrect credentials': {code: 400, error: true, message: 'Incorrect credentials check your data'},
    'Missing id': {code: 400, error: true, message: 'Missing id'},
    'Missing fields': {code: 400, error: true, message: 'Missing fields'},
    'Invalid fields': {code: 400, error: true, message: 'Invalid fields'},
    'Invalid Token': {code: 401, error: true, message: 'Unauthorized'},
    'Already exists': {code: 400, error: true, message: 'Already exists'},
    'Not available': {code: 400, error: true, message: 'Not available'},
    'User disabled': {code: 400, error: true, message: 'User disabled'},
    'Expired Token': {code: 401, error: true, message: 'Expired Token'},
    'Unauthorized': {code: 401, error: true, message: 'Unauthorized'},
    'Forbidden': {code: 403, error: true, message: 'Forbidden'},
    'User not active': {code: 403, error: true, message: 'User not active'},
    'Not found': {code: 404, error: true, message: 'Not found'},
    'Error saving': {code: 500, error: true, message: 'Error saving'},
    'Error updating': {code: 500, error: true, message: 'Error updating'},
    'Error deleting': {code: 500, error: true, message: 'Error deleting'},
    'Error sending email': {code: 500, error: true, message: 'Error sending email'},
    'Server Error': {code: 500, error: true, message: 'Internal Server Error'},
};

export const validateError = (error: Error): ResponseApi<undefined> => {
    return errors[error.message] || errors['Server Error'];
}