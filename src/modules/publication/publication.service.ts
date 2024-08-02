import { Injectable } from '@nestjs/common';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { PublicationsRepository } from './publication.repository';
import { createCategoryDto } from './dto/create-category.dto';

@Injectable()
export class PublicationService {
  async createCategory(categoryId: createCategoryDto) {
    return await this.publicationRepository.createCategory(categoryId);
  }
  constructor(private readonly publicationRepository: PublicationsRepository) {}

  findAll() {
    return this.publicationRepository.findAll();
  }
  async findAllId(userid: any) {
    return await this.publicationRepository.findAllId(userid);
  }

  findPrublications(
    category: string,
    city: string,
    page: number,
    limit: number,
  ) {
    return this.publicationRepository.findPrublications(
      category,
      city,
      page,
      limit,
    );
  }

  findAllPremium() {
    return this.publicationRepository.findAllPremium();
  }

  findAllCategories() {
    return this.publicationRepository.findAllCategories();
  }

  findAllPublications() {
    return this.publicationRepository.findAllPublications();
  }

  findOnePublication(id: string) {
    return this.publicationRepository.findOnePublication(id);
  }

  listMe(id: string, userid: string) {
    return this.publicationRepository.listMe(id, userid);
  }

  async create(
    createPublicationDto: CreatePublicationDto,
    file?: Express.Multer.File,
    userid?: any,
  ) {
    let res = null;
    if (file) {
      res = await this.publicationRepository.uploadImage(file);
    }
    // const publication = await this.publicationRepository.create({
    //   ...createPublicationDto,
    //   imgUrl: res.secure_url,
    //   user:userid,
    // });
    return this.publicationRepository.create(createPublicationDto, res, userid);
  }

  async update(id: string, updatePublicationDto: UpdatePublicationDto) {
    return await this.publicationRepository.update(id, updatePublicationDto);
  }

  remove(id: string) {
    return this.publicationRepository.remove(id);
  }
}
