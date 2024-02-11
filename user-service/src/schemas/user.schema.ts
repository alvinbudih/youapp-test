import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { hash } from '../helpers/hash';
import isEmail from 'validator/lib/isEmail';

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({
    required: true,
    unique: true,
    validate: {
      validator: function (v: string) {
        return isEmail(v);
      },
      message: (prop) => `${prop.value} is not a valid email`,
    },
  })
  email: string;

  @Prop({ required: true })
  password: string;
}

export type UserDocument = HydratedDocument<User>;

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', function (next) {
  this.password = hash(this.password);
  next();
});
