import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Register } from './dto/register.dto';
import { Response } from 'express';
import { Payload } from './dto/payload.dto';
import { EmailPasswordRequiredError } from 'src/helpers/errors/EmailPasswordRequiredError';

@Controller('api')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() register: Register, @Res() res: Response) {
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
      res.status(400).json({ msg: error.message });
    }
  }

  @Post('login')
  async login(@Body() payload: Payload, @Res() res: Response) {
    try {
      const { email, password } = payload;

      if (!email || !password) {
        throw new EmailPasswordRequiredError('Email or Password is required');
      }

      const access_token = await this.authService.login({ email, password });

      res.json({ access_token });
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  }
}
