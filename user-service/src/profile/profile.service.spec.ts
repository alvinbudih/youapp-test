import { Test, TestingModule } from '@nestjs/testing';
import { ProfileService } from './profile.service';
import 'dotenv/config';
import { Model, Schema, connect, disconnect } from 'mongoose';
import { model } from 'mongoose';
import { Profile } from 'src/schemas/profile.schema';

let service: ProfileService;
const baseUrl = process.env.DB_CONNECTION_TEST;
let profileModel: Model<{
  displayName: string;
  gender: string;
  birthday: Date;
  horoscope: string;
  zodiac: string;
  height: number;
  weight: number;
  userId: string;
  profilePicture?: string;
  interests: Array<string>;
}>;

beforeAll(async () => {
  await connect(baseUrl);

  const profileSchema = new Schema({
    displayName: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    birthday: {
      type: Date,
      required: true,
    },
    horoscope: {
      type: String,
      required: true,
    },
    zodiac: {
      type: String,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    profilePicture: {
      type: String,
    },
    interests: {
      type: [String],
    },
  });

  profileModel = model('Profile', profileSchema);
  service = new ProfileService(profileModel as Model<Profile>);
});

afterAll(async () => {
  await disconnect();
});

describe('ProfileService', () => {
  afterEach(async () => {
    await profileModel.deleteMany().exec();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  let body = {
    displayName: 'Ucup Surucup',
    gender: 'Male',
    birthday: '2000-03-03',
    height: 163,
    weight: 45,
    userId: '1',
  };

  describe('Create Profile', () => {
    it('should create profile', async () => {
      const result = await service.create({
        ...body,
        birthday: new Date(body.birthday),
      });

      expect(result).toHaveProperty('displayName', body.displayName);
    });

    it('should failed when name is empty', async () => {
      const result = service.create({
        ...body,
        displayName: '',
        birthday: new Date(body.birthday),
      });

      await expect(result).rejects.toThrow();
    });

    it('should failed when gender is empty', async () => {
      const result = service.create({
        ...body,
        gender: '',
        birthday: new Date(body.birthday),
      });

      await expect(result).rejects.toThrow();
    });

    it('should failed when birthday is empty', async () => {
      const result = service.create({
        ...body,
        birthday: undefined,
      });

      await expect(result).rejects.toThrow();
    });

    it('should failed when height is empty', async () => {
      const result = service.create({
        ...body,
        height: undefined,
        birthday: new Date(body.birthday),
      });

      await expect(result).rejects.toThrow();
    });

    it('should failed when weight is empty', async () => {
      const result = service.create({
        ...body,
        weight: undefined,
        birthday: new Date(body.birthday),
      });

      await expect(result).rejects.toThrow();
    });
  });

  describe('Get Profile', () => {
    it('should get profile', async () => {
      await service.create({
        ...body,
        birthday: new Date(body.birthday),
      });

      const result = await service.findOne('1');

      expect(result).toHaveProperty('displayName', body.displayName);
      expect(result).toHaveProperty('gender', body.gender);
      expect(result).toHaveProperty('birthday', new Date(body.birthday));
      expect(result).toHaveProperty('height', body.height);
      expect(result).toHaveProperty('weight', body.weight);
      expect(result).toHaveProperty('horoscope', 'Pisces');
      expect(result).toHaveProperty('zodiac', 'Fish');
    });

    it('should return null', async () => {
      const result = await service.findOne('2');

      expect(result).toBeNull();
    });
  });

  describe('Update Profile', () => {
    it('should update profile', async () => {
      await service.create({
        ...body,
        birthday: new Date(body.birthday),
      });

      const result = await service.update('1', { displayName: 'Ucup' });

      expect(result.modifiedCount).toBe(1);
    });

    it('should not update profile', async () => {
      const result = await service.update('1', { displayName: 'Ucup' });

      expect(result.modifiedCount).toBe(0);
    });

    it('should not change the name', async () => {
      await service.create({
        ...body,
        birthday: new Date(body.birthday),
      });

      await service.update('1', { displayName: '' });
      const result = await service.findOne('1');

      expect(result).toHaveProperty('displayName', body.displayName);
    });
  });
});
