import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Res,
  Req,
  Next,
  BadRequestException,
  NotFoundException,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { FormProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { NextFunction, Response } from 'express';
import NotFoundError from '../helpers/errors/NotFoundError';
import { AuthRequest } from '../auth/auth.interface';
import { UserService } from '../user/user.service';
import { Error as MongooseError } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import findZodiacSign from 'src/helpers/findZodiacSign';

@Controller('api')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly userService: UserService,
  ) {}

  @Post('createProfile')
  @UseInterceptors(FileInterceptor('profilePicture', { limits: { files: 1 } }))
  async create(
    @Body() body: FormProfileDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: /jpg|jpeg|png/ })],
        fileIsRequired: false,
      }),
    )
    profilePicture: Express.Multer.File,
    @Req() req: AuthRequest,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    console.log('create profile api...');

    try {
      const { displayName, gender, birthday, height, weight } = body;

      const {
        user: { id: userId },
      } = req;

      const profile = await this.profileService.create({
        displayName,
        gender,
        birthday,
        height,
        weight,
        userId,
        profilePicture,
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

      return res.json({ user, profile });
    } catch (error) {
      next(error);
    }
  }

  @Patch('updateProfile')
  @UseInterceptors(FileInterceptor('profilePicture'))
  async update(
    @Body() updateProfileDto: UpdateProfileDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: /jpg|jpeg|png/ })],
        fileIsRequired: false,
      }),
    )
    profilePicture: Express.Multer.File,
    @Req()
    req: AuthRequest,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    console.log('update profile api...');

    try {
      const { displayName, gender, birthday, height, weight, interests } =
        updateProfileDto;

      const {
        user: { id },
      } = req;

      const updatedProfile = await this.profileService.update(id, {
        displayName,
        gender,
        birthday,
        height,
        weight,
        ...(profilePicture && { profilePicture }),
        interests,
      });

      if (!updatedProfile) throw new NotFoundError(id, 'Profile');

      res.json({ msg: 'Profile Updated Successfully' });
    } catch (error) {
      console.log(error);

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
