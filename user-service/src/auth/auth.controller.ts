import {
  BadRequestException,
  Body,
  Controller,
  Next,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Register } from './dto/register.dto';
import { NextFunction, Response } from 'express';
import { Payload } from './dto/payload.dto';
import { EmailPasswordRequiredError } from 'src/helpers/errors/EmailPasswordRequiredError';
import { Error as MongooseError } from 'mongoose';
import { InvalidPayloadError } from 'src/helpers/errors/InvalidPayloadError';

@Controller('api')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() register: Register,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    console.log('api register...');

    try {
      const { username, email, password, confirmPassword } = register;

      const user = await this.authService.register({
        username,
        email,
        password,
        confirmPassword,
      });

      res.json(user);
    } catch (error) {
      if (
        error instanceof MongooseError.ValidationError ||
        error.name === 'MongoServerError'
      ) {
        next(new BadRequestException(error.message));
      } else {
        next(error);
      }
    }
  }

  @Post('login')
  async login(
    @Body() payload: Payload,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    console.log('api login...');

    try {
      const { email, password } = payload;

      if (!email || !password) {
        throw new EmailPasswordRequiredError('Email or Password is required');
      }

      const access_token = await this.authService.login({ email, password });

      res.json({ access_token });
    } catch (error) {
      if (
        error instanceof EmailPasswordRequiredError ||
        error instanceof InvalidPayloadError
      ) {
        next(new BadRequestException(error.message));
      } else {
        next(error);
      }
    }
  }
}
