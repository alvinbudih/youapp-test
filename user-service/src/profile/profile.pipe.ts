import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

type ProfilePicture = {
  originalName: string;
};

@Injectable()
export class ProfileExtValidationPipe implements PipeTransform {
  transform(value: ProfilePicture, metadata: ArgumentMetadata) {
    const validExtentsions = ['jpg', 'jpeg', 'png'];
    const fileExtension = value.originalName.split('.').pop();
    return validExtentsions.includes(fileExtension);
  }
}
