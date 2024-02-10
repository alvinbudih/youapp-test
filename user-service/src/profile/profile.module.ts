import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Profile, ProfileSchema } from '../schemas/profile.schema';
import { AuthMiddleware } from '../auth/auth.middleware';
import { UserService } from '../user/user.service';
import { User, UserSchema } from '../schemas/user.schema';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Profile.name, schema: ProfileSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MulterModule.register({
      storage: diskStorage({
        destination: './public/profile-pictures',
        filename: (req, file, cb) => {
          const imageName = file.originalname.split('.')[0];
          const imageExt = file.originalname.split('.').pop();
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${imageName}-${uniqueSuffix}.${imageExt}`);
        },
      }),
    }),
  ],
  controllers: [ProfileController],
  providers: [ProfileService, UserService],
})
export class ProfileModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(ProfileController);
  }
}
