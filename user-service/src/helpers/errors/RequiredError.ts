export class RequiredError extends Error {
  constructor(field: string) {
    super(`${field} is Required`);
  }
}
