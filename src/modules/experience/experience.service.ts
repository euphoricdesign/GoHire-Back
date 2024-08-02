import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Experience } from 'src/database/entities/experience.entity';
import { Repository } from 'typeorm';
import * as data from '../../utils/mock-experiences.json';
import { UserRepository } from 'src/modules/users/users.repository';
import { ProfesionsRepository } from 'src/modules/profesions/profesions.repository';
import { Feedback } from 'src/database/entities/feedback.entity';
import { PostExperienceDto } from './dto/post-exp.dto';
import { User } from 'src/database/entities/user.entity';

@Injectable()
export class ExperienceService {
  constructor(
    @InjectRepository(Feedback)
    private feedbackRepository: Repository<Feedback>,
    @InjectRepository(Experience)
    private experienceRepository: Repository<Experience>,
    private userRepository: UserRepository,
    private profesionRepository: ProfesionsRepository,
  ) {}

  async seedExperiences() {
    const users = await this.userRepository.findAll();
    const professions = await this.profesionRepository.getAllProfessions();
    const feedbacks = await this.feedbackRepository.find();

    data?.map(async (element, index) => {
      const experience = new Experience();
      experience.imgUrl = element.imgUrl;
      experience.company = element.company;
      experience.title = element.title;
      experience.description = element.description;
      experience.startDate = element.startDate;
      experience.endDate = element.endDate;
      experience.profesion = professions[Math.round(Math.random() * 16)];
      experience.user = users[Math.round(Math.random() * 30)];
      experience.client = users[Math.round(Math.random() * 30)];
      experience.feedback = feedbacks[index];

      await this.experienceRepository
        .createQueryBuilder()
        .insert()
        .into(Experience)
        .values(experience)
        .execute();
    });
  }

  async getExperiences() {
    const experiences = await this.experienceRepository.find({
      relations: { client: true, feedback: true },
    });
    return experiences;
  }

  async postExperience(experienceData: PostExperienceDto, req) {
    const client: User = await this.userRepository.findOne(
      experienceData.clientID,
    );
    console.log(req.user);
    if (!client)
      throw new NotFoundException('The referenced client does not exist');

    const experience = new Experience();
    experience.company = experienceData.company;
    experience.title = experienceData.title;
    experience.description = experienceData.description;
    experience.startDate = experienceData.startDate;
    experience.endDate = experienceData.endDate;
    experience.imgUrl = experienceData.imgUrl;
    //falta agregar este campo
    // experience.profesion = experienceData.profesion;
    experience.client = client;

    await this.experienceRepository.save(experience);

    return { message: 'The experience has benn added', experience };
  }

  async updateExperience(id, experienceData) {
    const expFounded = await this.experienceRepository.findOneBy({
      id: id,
    });
    if (!expFounded)
      throw new NotFoundException(`No found experience con id ${id}`);
    return await this.experienceRepository.update(id, experienceData);
  }

  async deleteExperience(id) {
    const experienceFounded = await this.experienceRepository.findOneBy({
      id: id,
    });
    if (!experienceFounded)
      throw new NotFoundException(
        'experience history is not found or not exists',
      );
    await this.experienceRepository.remove(experienceFounded);
    return {
      message: 'the experience history has benn deleted',
      experienceFounded,
    };
  }
}
