import 'dotenv/config';
import { AuthService } from './auth.service';
import { Model, Schema, connect, disconnect, model } from 'mongoose';
import isEmail from 'validator/lib/isEmail';
import { hash } from '../helpers/hash';

let service: AuthService;
const baseUrl = process.env.DB_CONNECTION_TEST;
let userModel: Model<{
  username: string;
  email: string;
  password: string;
}>;

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
  service = new AuthService(userModel);
});

afterAll(async () => {
  await disconnect();
});

describe('AuthService', () => {
  afterEach(async () => {
    await userModel.deleteMany().exec();
  });

  let body = {
    username: 'udin',
    email: 'udin@mail.com',
    password: 'password',
    confirmPassword: 'password',
  };

  describe('AuthService instanciate', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('Register User', () => {
    it('should create user', async () => {
      const result = await service.register(body);

      expect(result).toHaveProperty('username', 'udin');
      expect(result).toHaveProperty('email', 'udin@mail.com');
      expect(result).toHaveProperty('password');
    });

    it('should failed to create user when email exists', async () => {
      await service.register(body);
      const result = service.register(body);
      await expect(result).rejects.toThrow();
    });
  });

  describe('Login User', () => {
    it('should get JWT Token', async () => {
      await service.register(body);
      const { email, password } = body;

      const result = jest.fn(
        async () => await service.login({ email, password }),
      );

      await result();
      expect(result).toHaveReturned();
    });

    it('should throw error when email wrong', async () => {
      await service.register(body);
      const { password } = body;
      const result = service.login({ email: 'salah@mail.com', password });
      await expect(result).rejects.toThrow();
    });

    it('should throw error when password wrong', async () => {
      await service.register(body);
      const { email } = body;
      const result = service.login({ email, password: 'salah' });
      await expect(result).rejects.toThrow();
    });
  });
});
