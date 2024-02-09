import 'dotenv/config';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user.module';

let service: UserService;

beforeAll(async () => {
  const baseUrl = process.env.DB_CONNECTION_TEST;
  const module: TestingModule = await Test.createTestingModule({
    providers: [UserService],
    imports: [MongooseModule.forRoot(baseUrl), UserModule],
  }).compile();

  service = module.get<UserService>(UserService);
});
describe('UserService', () => {
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
