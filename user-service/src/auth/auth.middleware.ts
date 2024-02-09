import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { UnauthenticatedError } from '../helpers/errors/UnauthenticatedError';
import { decodeToken } from '../helpers/token';
import { AuthRequest } from './auth.interface';
import { UserService } from '../user/user.service';
import { JsonWebTokenError } from '@nestjs/jwt';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly user: UserService) {}

  async use(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { access_token } = req.headers;

      if (!access_token) throw new UnauthenticatedError();

      const payload = decodeToken(access_token as string);

      const user = await this.user.findOne(payload.email);

      if (!user) throw new UnauthenticatedError();

      req.user = {
        id: user.id,
        username: user.username,
        email: user.email,
      };

      next();
    } catch (error) {
      console.log(error);

      if (error instanceof UnauthenticatedError) {
        next(new UnauthorizedException(error.message));
      } else if (error instanceof JsonWebTokenError) {
        next(new UnauthorizedException('Invalid Token'));
      } else {
        next(error);
      }
    }
  }
}
