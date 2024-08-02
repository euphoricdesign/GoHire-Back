import { Injectable, NotFoundException } from '@nestjs/common';
import { Feedback } from 'src/database/entities/feedback.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as data from '../../utils/mock-feedbacks.json';
import { PostFeedbackDto } from './dto/create-feedback.dto';
import { User } from 'src/database/entities/user.entity';
import * as forbidden_words from '../../utils/forbidden-words.json';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private feedbackRepository: Repository<Feedback>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async seederFeedbacks() {
    const users = await this.userRepository.find();
    data?.map(async (element) => {
      const feedback = new Feedback();
      feedback.rate = element.rate;
      feedback.description = element.description;
      feedback.user = users[Math.round(Math.random() * 30)];

      await this.feedbackRepository.save(feedback);
    });
  }

  async getAllFeedbacks() {
    const feedbacks = await this.feedbackRepository.find({
      relations: { user: true },
    });

    if (feedbacks.length === 0)
      throw new NotFoundException('The feedback list is still empty');

    const approvedFeedbacks: Feedback[] = [];

    feedbacks.map(async (element) => {
      if (element.blocked === true) {
        const blocked = await this.feedbackRepository.findOneBy({
          id: element.id,
        });
        approvedFeedbacks.push(blocked);
      }
    });
    return feedbacks;
  }

  async postFeedback(feedbackData: PostFeedbackDto, req) {
    const user: User = await this.userRepository.findOneBy({
      id: req.currentUser.id,
    });
    const feedback = new Feedback();
    feedback.rate = feedbackData.rate;
    feedback.description = feedbackData.description.toLocaleLowerCase();
    feedback.user = user;

    const response = await this.checkDescriptionEntries(feedbackData);

    if (response) {
      feedback.isOfensive = true;
      console.log(user);
      user.strikes += 1;
      await this.userRepository.save(user);
      await this.feedbackRepository.save(feedback);
      return response;
    }
    await this.feedbackRepository.save(feedback);
    return { message: 'You feebacks has been send successfully' };
  }

  async editFeedback(feedbackData: Partial<Feedback>, id) {
    const feebackFounded: Feedback = await this.feedbackRepository.findOneBy({
      id: id,
    });

    if (!feebackFounded)
      throw new NotFoundException('The feedback is not found or not exists');
    const feedbackUpdates = this.feedbackRepository.merge(
      feebackFounded,
      feedbackData,
    );

    await this.feedbackRepository.save(feedbackUpdates);
    return {
      message: 'Your feeback has been update successfully',
      feebackFounded,
    };
  }

  private async checkDescriptionEntries(data) {
    const feedback = data.description.split(/\s+/);
    const words = forbidden_words.forbidden_words;
    const matches: string[] = [];

    words.map((element) => {
      for (let i = 0; i < feedback.length; i++) {
        if (feedback[i] === element) {
          matches.push(feedback[i]);
        }
      }
    });
    return {
      message:
        'Your feedback has been created successfully but remember that the applications policies do not allow words that promote violence or abuse',
      matches,
    };
  }
}
