export class FormProfileDto {
  displayName: string;
  gender: string;
  birthday: Date;
  height: number;
  weight: number;
}

export class CreateProfileDto extends FormProfileDto {
  userId: string;
  horoscope: string;
  zodiac: string;
  profilePicture?: Express.Multer.File;
}
