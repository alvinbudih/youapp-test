export class FormMessageDto {
  value: string;
}

export class CreateMessageDto extends FormMessageDto {
  senderId: string;
  receiverId: string;
  sendAt: Date;
}
