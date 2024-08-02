import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ExperienceService } from './experience.service';
import { ApiTags } from '@nestjs/swagger';
import { PostExperienceDto } from './dto/post-exp.dto';
import { Request } from 'express';

@ApiTags('experience')
@Controller('experience')
export class ExperienceController {
  constructor(private experienceService: ExperienceService) {}

  @Get()
  async getExperience() {
    return await this.experienceService.getExperiences();
  }
  @Post()
  @UsePipes(new ValidationPipe())
  postExperience(
    @Body() experienceData: PostExperienceDto,
    @Req() req: Request,
  ) {
    return this.experienceService.postExperience(experienceData, req);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe())
  updateExperience(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() experienceData,
  ) {
    return this.experienceService.updateExperience(id, experienceData);
  }
  @Delete(':id')
  @UsePipes(new ValidationPipe())
  deleteExperience(@Param('id', ParseUUIDPipe) id: string) {
    return this.experienceService.deleteExperience(id);
  }
}
