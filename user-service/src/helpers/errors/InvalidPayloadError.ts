export class InvalidPayloadError extends Error {
  constructor() {
    super('Invalid Email or Password');
  }
}
