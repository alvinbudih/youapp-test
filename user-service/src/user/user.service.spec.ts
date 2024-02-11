import 'dotenv/config';
import { UserService } from './user.service';
import { Model, Schema, connect, disconnect, model } from 'mongoose';
import isEmail from 'validator/lib/isEmail';
import { hash } from '../helpers/hash';

type UserModel = {
  username: string;
  email: string;
  password: string;
};

let service: UserService;
const baseUrl = process.env.DB_CONNECTION_TEST;
let userModel: Model<UserModel>;

beforeAll(async () => {
  await connect(baseUrl);

  const userSchema = new Schema({
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      validate: {
        validator: (v: string) => {
          isEmail(v);
        },
      },
    },
    password: {
      type: String,
      required: true,
    },
  });

  userSchema.pre('save', function (next) {
    this.password = hash(this.password);
    next();
  });

  userModel = model('User', userSchema);
  service = new UserService(userModel);
});

afterAll(async () => {
  await disconnect();
});

describe('UserService', () => {
  afterEach(async () => {
    await userModel.deleteMany().exec();
  });

  let body: UserModel = {
    username: 'ucup',
    email: 'ucup@mail.com',
    password: 'password',
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Find By Email', () => {
    it('should get user', async () => {
      await new userModel(body).save();

      const result = await service.findOne(body.email);

      expect(result).toHaveProperty('username', body.username);
      expect(result).toHaveProperty('email', body.email);
      expect(result).toHaveProperty('password');
    });

    it("should return null when email doesn't exist", async () => {
      const result = await service.findOne(body.email);

      expect(result).toBeNull();
    });
  });

  describe('Find By Id', () => {
    it('should get user', async () => {
      const user = await new userModel(body).save();

      const result = await service.findById(user.id);

      expect(result).toHaveProperty('username', body.username);
      expect(result).toHaveProperty('email', body.email);
      expect(result).toHaveProperty('password');
    });

    it("should return null when email doesn't exist", async () => {
      const result = await service.findById('65c8acde597c30903e675d79');

      expect(result).toBeNull();
    });
  });
});
