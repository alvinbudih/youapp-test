import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UnauthenticatedError } from 'src/helpers/errors/UnauthenticatedError';
import { decodeToken } from 'src/helpers/token';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import { AuthRequest } from './auth.interface';
import { UserService } from 'src/user/user.service';

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
      res.status(401).json({ msg: error.message });
    }
  }
}
