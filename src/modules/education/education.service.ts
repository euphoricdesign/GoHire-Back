import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Education } from 'src/database/entities/education.entity';
import { Repository } from 'typeorm';
import { UserRepository } from '../users/users.repository';
import * as data from '../../utils/mock-educations.json';
import { PostEducationDto } from './dto/post-education.dto';
import { UpdateEducationDto } from './dto/update-education-dto';

@Injectable()
export class EducationService implements OnModuleInit {
  constructor(
    @InjectRepository(Education)
    private educationsRepository: Repository<Education>,
    private userRepository: UserRepository,
  ) {}

  onModuleInit() {
    this.seederEducation();
  }
  async seederEducation() {
    const users = await this.userRepository.findAll();

    data?.map(async (element) => {
      const education = new Education();
      education.title = element.title;
      education.educationalEntity = element.educationalEntity;
      education.studiesState = element.studiesState;
      education.startDate = element.startDate;
      education.endDate = element.endDate;
      education.description = element.description;
      education.user = users[Math.round(Math.random() * 30)];

      await this.educationsRepository
        .createQueryBuilder()
        .insert()
        .into(Education)
        .values(education)
        .execute();
    });
  }

  async getAllEducations() {
    const educations = await this.educationsRepository.find({
      relations: { user: true },
    });

    if (educations.length === 0)
      throw new NotFoundException('the education list is still empty ');
    return educations;
  }
  async findMe(userid: any) {
    const educations = await this.educationsRepository.find({
      where: { user: { id: userid } },
    });
    if (!educations) throw new NotFoundException(`Not found ${userid}`);
    return educations;
  }

  async postEducation(educationData: PostEducationDto, req) {
    const education = new Education();
    education.title = educationData.title;
    education.educationalEntity = educationData.educationalEntity;
    education.studiesState = educationData.studiesState;
    education.description = educationData.description;
    education.startDate = educationData.startDate;
    education.endDate = educationData.endDate;
    education.user = await this.userRepository.findOne(req.user.userid);

    await this.educationsRepository.save(education);
    return { message: 'new history education has been added', education };
  }

  async updateEducation(educationData: UpdateEducationDto, id: string) {
    const educationFounded = await this.educationsRepository.findOneBy({
      id: id,
    });

    if (!educationFounded)
      throw new NotFoundException('education is not found or not exists');

    const updates = this.educationsRepository.merge(
      educationFounded,
      educationData,
    );
    await this.educationsRepository.save(updates);
    return {
      message: 'the history education has benn modified',
      educationFounded,
    };
  }

  async deleteEducation(id: string) {
    const educationFounded = await this.educationsRepository.findOneBy({
      id: id,
    });

    if (!educationFounded)
      throw new NotFoundException('education is not found or not exists');

    await this.educationsRepository.remove(educationFounded);
    return {
      message: 'the history education has benn deleted',
      educationFounded,
    };
  }
}
