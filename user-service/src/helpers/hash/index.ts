import { compareSync, hashSync } from 'bcryptjs';

export function hash(password: string) {
  return hashSync(password);
}

export function compare(password: string, hashed: string) {
  return compareSync(password, hashed);
}
