export class AuthError extends Error {
  constructor(message: string = 'AuthError') {
    super(message);
    this.name = 'AuthError';
  }
}
