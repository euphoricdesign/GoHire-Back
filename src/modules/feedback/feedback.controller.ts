import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Req,
  ParseUUIDPipe,
  Param,
} from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { Request } from 'express';
import { PostFeedbackDto } from './dto/create-feedback.dto';
import { Feedback } from 'src/database/entities/feedback.entity';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/enum/role.enum';

@Controller('feedback')
export class FeedbackController {
  constructor(private feedbackService: FeedbackService) {}

  @Get()
  @Roles(Role.USER)
  getAllFeedbacks() {
    return this.feedbackService.getAllFeedbacks();
  }

  @Post()
  @Roles(Role.USER)
  postFeedback(@Body() feedbackData: PostFeedbackDto, @Req() req: Request) {
    return this.feedbackService.postFeedback(feedbackData, req);
  }

  @Patch(':id')
  @Roles(Role.USER)
  editFeedback(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() feedbackData: Partial<Feedback>,
  ) {
    return this.feedbackService.editFeedback(feedbackData, id);
  }
}
