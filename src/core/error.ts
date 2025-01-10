export class AuthError extends Error {
  constructor(message: string = 'AuthError') {
    super(message);
    this.name = 'AuthError';
  }
}

export class APIError extends Error {
  constructor(message: string = 'ApiError') {
    super(message);
    this.name = 'APIError';
  }
}