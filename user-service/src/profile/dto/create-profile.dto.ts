export class FormProfileDto {
  displayName: string;
  gender: string;
  birthday: Date;
  height: number;
  weight: number;
}

export class CreateProfileDto extends FormProfileDto {
  userId: string;
  profilePicture?: Express.Multer.File;
}
