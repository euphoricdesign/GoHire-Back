import { InjectRepository } from '@nestjs/typeorm';
import { Publicaction } from 'src/database/entities/publication.entity';
import { Repository } from 'typeorm';
import { CreatePublicationDto } from './dto/create-publication.dto';
import {
  BadRequestException,
  HttpStatus,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { UpdateProfesionDto } from '../profesions/dto/update-profesion.dto';
import { UserRepository } from '../users/users.repository';
import * as moment from 'moment';
import * as data from '../../utils/mock-publications.json';
import { ProfesionsRepository } from '../profesions/profesions.repository';
import { UploadApiResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');
import { createCategoryDto } from './dto/create-category.dto';
import { User } from 'src/database/entities/user.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from 'src/enum/notification.enum';

export class PublicationsRepository implements OnModuleInit {
  constructor(
    @InjectRepository(Publicaction)
    private publicationsRepository: Repository<Publicaction>,
    private userRepository: UserRepository,
    private profesionsRepository: ProfesionsRepository,
    @InjectRepository(User) private userEntity: Repository<User>,
    private notificationService: NotificationsService,
  ) {}

  async createCategory(categoryId: createCategoryDto) {


    const newcategory = await this.publicationsRepository.create({});
    const category = await this.publicationsRepository.save(newcategory);
    return category;
  }
  async findAllId(userid: any) {
    try {
      const userpublicationsId = await this.publicationsRepository.find({
        where: { user: { id: userid } },
      });
      if (!userpublicationsId) throw new BadRequestException(`not found user`);

      return userpublicationsId;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  onModuleInit() {
    this.seederPublicactions();
  }
  async seederPublicactions() {
    const users = await this.userRepository.findAll();
    const professions = await this.profesionsRepository.getAllProfessions();

    data?.map(async (element) => {
      const date = new Date();
      const timelapsed = moment(date).fromNow();
      const newPublication = new Publicaction();
      const formatTime = date.toLocaleTimeString();

      newPublication.title = element.title;
      newPublication.description = element.description;
      newPublication.category = element.category;
      newPublication.location = element.location;
      newPublication.remoteWork = element.remoteWork;
      newPublication.imgUrl = element.imgUrl;
      newPublication.date = element.date;
      newPublication.time = formatTime;
      newPublication.premium = element.premium;
      newPublication.timelapse = timelapsed;
      newPublication.profesion = professions[Math.round(Math.random() * 16)];
      newPublication.user = users[Math.round(Math.random() * 18)];

      await this.publicationsRepository
        .createQueryBuilder()
        .insert()
        .into(Publicaction)
        .values(newPublication)
        .execute();
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        { resource_type: 'auto' },
        (error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        },
      );
      toStream(file.buffer).pipe(upload);
    });
  }

  async create(createPublication: CreatePublicationDto, res, userid: any) {
    if (res) {
      res = res.secure_url;
    }
    const date = moment();
    const formatDate = date.format('YYYY-MM-DD');
    const formatTime = date.format('HH-mm-ss');
    const newPublication = await this.publicationsRepository.create({
      title: createPublication.title,
      description: createPublication.description,
      imgUrl: res,
      remoteWork: createPublication.remoteWork,
      category: createPublication.category,
      location: createPublication.location,
      user: userid,
      date: formatDate,
      time: formatTime,
    });
    const timelapsed = moment(date).fromNow();
    newPublication.timelapse = timelapsed;


    const publications = await this.publicationsRepository.save(newPublication);
    return publications;
  }

  async findAll() {
    const publications = await this.publicationsRepository.find();

    publications.forEach((publication) => {
      const { date, time } = publication;
      const datetime = `${date} ${time}`;
      const timelapsed = moment(datetime, 'DD/MM/YYYY HH:mm:ss').fromNow(true);

      const newPublication = new Publicaction();
      newPublication.id = publication.id;
      newPublication.title = publication.title;
      newPublication.description = publication.description;
      newPublication.profesion = publication.profesion;
      newPublication.imgUrl = publication.imgUrl;
      newPublication.date = publication.date;
      newPublication.time = publication.time;
      newPublication.timelapse = timelapsed;
      this.publicationsRepository.save(newPublication);

    });

    return await this.publicationsRepository.find();
  }
  async findPrublications(
    category: string,
    city: string,
    page: number,
    limit: number,
  ) {
    const skip = (page - 1) * limit;

    const where: any = {};
    if (category && city) {
      where.category = category;
      where.location = city;
    } else if (category) {
      where.category = category;
    } else if (city) {
      where.location = city;
    }

    const [publicationsFind, count] =
      await this.publicationsRepository.findAndCount({
        relations: {
          user: true,
          usersList: true,
        },
        where,
        take: limit,
        skip: skip,
      });

    if (publicationsFind.length === 0) {
      
      throw new NotFoundException(`No users were found whith those parameters`);
    }
    publicationsFind.forEach((publication) => {
      const { date, time } = publication;
      const datetime = `${date} ${time}`;
      const datetimeMoment = moment(datetime, 'YYYY-MM-DD HH:mm:ss');
      const timelapsed = datetimeMoment.fromNow();
      publication.timelapse = timelapsed;
    });
    return { publicationsFind, count };
  }

  async findAllPublications() {
    const [publicationsFind, count] =
      await this.publicationsRepository.findAndCount({
        relations: { user: true },
      });
    return { publicationsFind, count };
  }

  async update(id: string, updatePublication: UpdateProfesionDto) {
    await this.publicationsRepository.update(id, updatePublication);
    return this.publicationsRepository.findOneBy({ id: id });
  }
  async remove(id: string) {
    return await this.publicationsRepository.delete(id);
  }

  findOnePublication(id: string) {
    return this.publicationsRepository.find({
      where: { id },
      relations: { user: true },
    });
  }

  async findAllCategories() {
    const publications = await this.publicationsRepository.find();

    const category = publications.map(
      ({ category, ...publications }) => category,
    );
    const categoryReturn = [...new Set(category)];

    const location = publications.map(
      ({ location, ...publications }) => location,
    );
    const locationReturn = [...new Set(location)];

    return { categoryReturn, locationReturn };
  }

  async findAllPremium() {
    const publications = await this.publicationsRepository.find();
    const premium = publications.filter(
      (publications) => publications.premium === true,
    );
    return premium;
  }

  async listMe(id: string, userid: string) {
    const publication = await this.publicationsRepository.findOne({
      where: { id: id },
      relations: { user: true, usersList: true },
    });
    if (!publication) throw new NotFoundException(`not found publication`);

    const userFind = await this.userEntity.findOne({ where: { id: userid } });
    if (!userFind) throw new NotFoundException(`not found user`);

    if (publication.usersList.find((user) => user.id === userid))
      return `Already applied`;

    publication.usersList = [...publication.usersList, userFind];

    this.notificationService.postNotification(
      NotificationType.SEND_APPLY_REQUEST,
      publication.user,
    );

    const publicationUpdate =
      await this.publicationsRepository.save(publication);

    return publicationUpdate;
  }
}
