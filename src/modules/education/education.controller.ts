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
  Headers,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EducationService } from './education.service';
import { PostEducationDto } from './dto/post-education.dto';
import { UpdateEducationDto } from './dto/update-education-dto';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@ApiTags('education')
@Controller('education')
export class EducationController {
  constructor(
    private educationService: EducationService,
    private jwtService: JwtService,
  ) {}

  @Get()
  getStudies() {
    return this.educationService.getAllEducations();
  }
  @Get('me')
  findMe(@Headers() header) {
    const secret = process.env.JWT_SECRET;
    const { userid } = this.jwtService.verify(header.authorization, { secret });
    return this.educationService.findMe(userid);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  postEducation(@Body() educationData: PostEducationDto, @Req() req: Request) {
    return this.educationService.postEducation(educationData, req);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe())
  updateEducation(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() educationData: UpdateEducationDto,
  ) {
    return this.educationService.updateEducation(educationData, id);
  }

  @Delete(':id')
  @UsePipes(new ValidationPipe())
  deleteEducation(@Param('id', ParseUUIDPipe) id: string) {
    return this.educationService.deleteEducation(id);
  }
}
