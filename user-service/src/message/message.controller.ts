import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  Res,
  Next,
  BadRequestException,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { AuthRequest } from '../auth/auth.interface';
import { NextFunction, Response } from 'express';
import { Error as MongooseError } from 'mongoose';

@Controller('api')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('sendMessages/:userId')
  async create(
    @Param('userId') userId: string,
    @Body('value') value: string,
    @Req() req: AuthRequest,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    console.log('send message api');

    try {
      const {
        user: { id },
      } = req;

      const message = await this.messageService.create({
        value,
        senderId: id,
        receiverId: userId,
        sendAt: new Date(),
      });

      res.json(message);
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

  @Get('viewMessages/:userId')
  async findAll(
    @Param('userId') userId: string,
    @Req() req: AuthRequest,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    console.log('view message api..');

    try {
      const {
        user: { id },
      } = req;

      const messages = await this.messageService.findAll([id, userId]);

      res.json(messages);
    } catch (error) {
      next(error);
    }
  }
}
