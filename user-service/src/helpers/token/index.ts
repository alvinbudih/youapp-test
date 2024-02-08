import { sign, verify } from 'jsonwebtoken';
const secretKey = process.env.JWT_TOKEN;

type Payload = {
  username: string;
  email: string;
};

export function signToken(payload: Payload) {
  return sign(payload, secretKey);
}

export function decodeToken(token: string): Payload {
  return verify(token, secretKey) as Payload;
}
