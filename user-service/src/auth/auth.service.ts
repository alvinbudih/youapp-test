import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { Register } from './dto/register.dto';
import { Payload } from './dto/payload.dto';
import { compare } from 'src/helpers/hash';
import { signToken } from 'src/helpers/token';
import { InvalidPayloadError } from 'src/helpers/errors/InvalidPayloadError';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  register({ username, email, password, confirmPassword }: Register) {
    let isConfirmPassword: boolean = password === confirmPassword;
    console.log(isConfirmPassword);

    if (!isConfirmPassword) throw new InvalidPayloadError();

    const userRegister = new this.userModel({ username, email, password });
    return userRegister.save();
  }

  async login(payload: Payload) {
    const user = await this.userModel.findOne({ email: payload.email }).exec();
    console.log(user);

    if (!user || !compare(payload.password, user.password)) {
      throw new InvalidPayloadError();
    }

    return signToken({ username: user.username, email: user.email });
  }
}
