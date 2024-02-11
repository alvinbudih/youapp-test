import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from '../schemas/message.schema';
import { Model } from 'mongoose';
import NotFoundError from '../helpers/errors/NotFoundError';
import { User } from '../schemas/user.schema';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async create(createMessageDto: CreateMessageDto) {
    const { value, senderId, receiverId, sendAt } = createMessageDto;

    const sender = await this.userModel.findById(senderId).exec();

    const receiver = await this.userModel.findById(receiverId).exec();

    if (!receiver) {
      throw new NotFoundError(createMessageDto.receiverId, 'User');
    }

    return await new this.messageModel({
      value,
      sender,
      receiver,
      sendAt,
    }).save();
  }

  async findAll(userIds: string[]) {
    const query = {
      $and: [
        {
          sender: { $in: userIds },
        },
        {
          receiver: { $in: userIds },
        },
      ],
    };

    return await this.messageModel
      .find(query)
      .populate('sender')
      .populate('receiver')
      .exec();
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} message`;
  // }

  // update(id: number, updateMessageDto: UpdateMessageDto) {
  //   return `This action updates a #${id} message`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} message`;
  // }
}
