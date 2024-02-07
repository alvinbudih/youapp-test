import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Response } from 'express';
import NotFoundError from 'src/helpers/errors/NotFoundError';

@Controller('api')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post('createProfile')
  async create(
    @Body() createProfileDto: CreateProfileDto,
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
        userId,
      } = createProfileDto;

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

  @Get('getProfile/:userId')
  async findOne(@Param('userId') userId: string, @Res() res: Response) {
    try {
      const profile = await this.profileService.findOne(userId);

      res.json(profile);
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  }

  @Patch('updateProfile/:id')
  async update(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto,
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
        userId,
      } = updateProfileDto;

      const updatedProfile = await this.profileService.update(id, {
        displayName,
        gender,
        birthday,
        horoscope,
        zodiac,
        height,
        weight,
        userId,
      });

      if (!updatedProfile) throw new NotFoundError(id, 'Profile');

      res.json({ msg: 'Profile Updated Successfully', updatedProfile });
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  }
}
