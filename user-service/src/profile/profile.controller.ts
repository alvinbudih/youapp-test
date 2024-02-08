import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Res,
  Req,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto, FormProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Response } from 'express';
import NotFoundError from 'src/helpers/errors/NotFoundError';
import { AuthRequest } from 'src/auth/auth.interface';
import { UserService } from 'src/user/user.service';

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
  ) {
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

      await this.profileService.create({
        displayName,
        gender,
        birthday,
        horoscope,
        zodiac,
        height,
        weight,
        userId,
      });

      res.status(201).json({ msg: 'Profile Created Successfully' });
    } catch (error) {
      res.status(400).json({ msg: error.message, errors: error.errors });
    }
  }

  @Get('getProfile')
  async findOne(@Req() req: AuthRequest, @Res() res: Response) {
    try {
      const user = await this.userService.findById(req.user.id);
      const profile = await this.profileService.findOne(user.id);

      res.json({ profile, user });
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  }

  @Patch('updateProfile')
  async update(
    @Body() updateProfileDto: UpdateProfileDto,
    @Req() req: AuthRequest,
    @Res() res: Response,
  ) {
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

      res.json({ msg: 'Profile Updated Successfully', updatedProfile });
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  }
}
