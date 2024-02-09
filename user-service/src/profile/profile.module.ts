import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Profile, ProfileSchema } from 'src/schemas/profile.schema';
import { AuthMiddleware } from 'src/auth/auth.middleware';
import { UserService } from 'src/user/user.service';
import { User, UserSchema } from 'src/schemas/user.schema';
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
