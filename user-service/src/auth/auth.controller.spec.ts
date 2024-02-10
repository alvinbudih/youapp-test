import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Schema, model } from 'mongoose';
import isEmail from 'validator/lib/isEmail';

let controller: AuthController;
let service: AuthService;

beforeAll(async () => {
  // const module: TestingModule = await Test.createTestingModule({
  //   controllers: [AuthController],
  // }).compile();

  // controller = module.get<AuthController>(AuthController);
  const userSchema = new Schema({
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      validate: {
        validator: (v) => {
          isEmail(v);
        },
      },
    },
    password: {
      type: String,
      required: true,
    },
  });

  const userModel = model('User', userSchema);
  service = new AuthService(userModel);
  controller = new AuthController(service);
});
describe('AuthController', () => {
  describe('controller must be defined', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });
  });
});
