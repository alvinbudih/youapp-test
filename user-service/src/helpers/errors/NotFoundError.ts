export default class NotFoundError extends Error {
  constructor(
    public identity: string | number,
    public collectionName: string,
  ) {
    super(`${collectionName} with id ${identity} not found`);
  }
}
