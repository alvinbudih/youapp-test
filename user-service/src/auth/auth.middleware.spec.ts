import { UserService } from '../user/user.service';
import { AuthMiddleware } from './auth.middleware';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';

describe('AuthMiddleware', () => {
  it('should be defined', () => {
    expect(new AuthMiddleware(new UserService(new Model()))).toBeDefined();
  });
});
