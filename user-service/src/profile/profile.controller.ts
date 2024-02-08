import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Res,
  Req,
  Next,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto, FormProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { NextFunction, Response } from 'express';
import NotFoundError from 'src/helpers/errors/NotFoundError';
import { AuthRequest } from 'src/auth/auth.interface';
import { UserService } from 'src/user/user.service';
import { Error as MongooseError } from 'mongoose';

@Controller('api')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly userService: UserService,
  ) {}

  @Post('createProfile')
  async create(
    @Body() createProfileDto: FormProfileDto,
    @Req() req: AuthRequest,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    console.log('create profile api...');

    try {
      const {
        displayName,
        gender,
        birthday,
        horoscope,
        zodiac,
        height,
        weight,
      } = createProfileDto;

      const {
        user: { id: userId },
      } = req;

      const profile = await this.profileService.create({
        displayName,
        gender,
        birthday,
        horoscope,
        zodiac,
        height,
        weight,
        userId,
      });

      res
        .status(201)
        .json({ msg: 'Profile Created Successfully', data: profile });
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

  @Get('getProfile')
  async findOne(
    @Req() req: AuthRequest,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    console.log('get profile api...');

    try {
      const user = await this.userService.findById(req.user.id);
      const profile = await this.profileService.findOne(user.id);

      res.json({ profile, user });
    } catch (error) {
      next(error);
    }
  }

  @Patch('updateProfile')
  async update(
    @Body() updateProfileDto: UpdateProfileDto,
    @Req() req: AuthRequest,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    console.log('update profile api...');

    try {
      const {
        displayName,
        gender,
        birthday,
        horoscope,
        zodiac,
        height,
        weight,
      } = updateProfileDto;

      const {
        user: { id },
      } = req;

      const updatedProfile = await this.profileService.update(id, {
        displayName,
        gender,
        birthday,
        horoscope,
        zodiac,
        height,
        weight,
      });

      if (!updatedProfile) throw new NotFoundError(id, 'Profile');

      res.json({ msg: 'Profile Updated Successfully', data: updatedProfile });
    } catch (error) {
      if (
        error instanceof MongooseError.ValidationError ||
        error.name === 'MongoServerError'
      ) {
        next(new BadRequestException(error.message));
      } else if (error instanceof NotFoundError) {
        next(new NotFoundException(error.message));
      } else {
        next(error);
      }
    }
  }
}
