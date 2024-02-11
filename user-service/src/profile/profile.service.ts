import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Profile } from '../schemas/profile.schema';
import { Model } from 'mongoose';
import findZodiacSign from '../helpers/findZodiacSign';
import { RequiredError } from '../helpers/errors/RequiredError';
import { cleanEmptyValue } from '../helpers/cleanEmptyValue';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile.name) private profileModel: Model<Profile>,
  ) {}

  async create(createProfileDto: CreateProfileDto) {
    if (!createProfileDto.birthday) {
      throw new RequiredError('Birthday');
    }

    const { horoscope, zodiac } = findZodiacSign(
      new Date(createProfileDto?.birthday).getDate(),
      new Date(createProfileDto?.birthday).getMonth(),
    );

    return await new this.profileModel({
      ...createProfileDto,
      profilePicture: createProfileDto?.profilePicture?.path,
      horoscope: horoscope,
      zodiac: zodiac,
    }).save();
  }

  findOne(userId: string) {
    return this.profileModel.findOne({ userId }).exec();
  }

  update(userId: string, updateProfileDto: UpdateProfileDto) {
    let horoscope: string, zodiac: string;

    if (updateProfileDto.birthday) {
      const resultZodiac = findZodiacSign(
        new Date(updateProfileDto.birthday).getDate(),
        new Date(updateProfileDto.birthday).getMonth(),
      );

      horoscope = resultZodiac.horoscope;
      zodiac = resultZodiac.zodiac;
    }

    const payload = cleanEmptyValue(updateProfileDto);

    return this.profileModel
      .updateOne(
        { userId },
        {
          ...payload,
          ...(payload.profilePicture && {
            profilePicture: updateProfileDto?.profilePicture?.path,
          }),
        },
      )
      .exec();
  }
}
