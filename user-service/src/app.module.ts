import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { ProfileModule } from './profile/profile.module';
import { AuthModule } from './auth/auth.module';
import { MessageModule } from './message/message.module';
const uri = process.env.DB_CONNECTION;

@Module({
  imports: [MongooseModule.forRoot(uri), UserModule, ProfileModule, AuthModule, MessageModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
