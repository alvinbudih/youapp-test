import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Profile } from 'src/schemas/profile.schema';
import { Model } from 'mongoose';

@Injectable()
export class ProfileService {
  constructor(@InjectModel(Profile.name) private profileModel: Model<Profile>) {
    //
  }

  create(createProfileDto: CreateProfileDto) {
    return new this.profileModel(createProfileDto).save();
  }

  findOne(userId: string) {
    return this.profileModel.findOne({ userId }).exec();
  }

  update(userId: string, updateProfileDto: UpdateProfileDto) {
    return this.profileModel
      .findOneAndUpdate({ userId }, updateProfileDto)
      .exec();
  }
}
