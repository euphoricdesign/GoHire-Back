import { InjectRepository } from '@nestjs/typeorm';
import { Profesion } from 'src/database/entities/profesion.entity';
import { Repository } from 'typeorm';
import { CreateProfesionDto } from './dto/create-profesion.dto';
import { UpdateProfesionDto } from './dto/update-profesion.dto';
import * as data from '../../utils/mock-professions.json';
import { UserRepository } from 'src/modules/users/users.repository';
import { BadRequestException, NotFoundException, Body } from '@nestjs/common';
import { User } from 'src/database/entities/user.entity';

export class ProfesionsRepository {
  constructor(
    @InjectRepository(Profesion)
    private profesionsRepository: Repository<Profesion>,
    private userRepository: UserRepository,
    @InjectRepository(User) private userEntity: Repository<User>,
  ) {}

  async seederProfesions() {
    const users = await this.userRepository.findAll();
    data?.map(async (element) => {
      const profession = new Profesion();
      profession.category = element.category;
      profession.user = users[Math.round(Math.random() * 30)];

      await this.profesionsRepository.save(profession);
    });
  }

  async create(createProfesionDto: CreateProfesionDto, userid) {
    const newProfession = await this.profesionsRepository.create({
      category: createProfesionDto.category,
      user: userid,
    });
    return await this.profesionsRepository.save(newProfession);
  }

  async findMe(userid: any) {
    const user = await this.profesionsRepository.find({
      where: { user: { id: userid } },
    });
    if (!user) throw new NotFoundException(`User ${userid} not found`);
    return user;
  }

  async remove(id: string) {
    const result = await this.profesionsRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException(`Profesion with ID ${id} not found`);
    }
    return { message: `Profesion with ID ${id} deleted successfully` };
  }

  async update(id: string, UpdateUserDto: UpdateProfesionDto) {
    await this.profesionsRepository.update(id, UpdateUserDto);
    const updateProfesions = await this.profesionsRepository.findOneBy({ id });
    return updateProfesions;
  }

  async findProfesions() {
    const ProfesionsFind = await this.profesionsRepository.find();
    return ProfesionsFind;
  }

  async getAllProfessions() {
    return await this.profesionsRepository.find({ relations: { user: true } });
  }

  async meProfesion(userid: string, body) {
    const userFind = await this.userRepository.findOne(userid);

    const newProfesion = await this.profesionsRepository.findOneBy({
      category: body.category,
    });

    if (!newProfesion) throw new NotFoundException(`Profesion not found`);

    userFind.profesions.find((element) => {
      if (element.category === newProfesion.category) {
        throw new BadRequestException(`Profesion already exist`);
      }
    });

    let userUpdate = new User();
    userUpdate = userFind;
    userUpdate.profesions = [...userFind.profesions, newProfesion];

    const userFinal = await this.userEntity.save(userUpdate);

    return userFinal;
  }

  async removeProfesion(req, categoryName) {
    const userFind = await this.userEntity.findOne({
      where: { id: req.currentUser.id },
      relations: { profesions: true },
    });
    const profesionFind = await this.profesionsRepository.findOneBy({
      category: categoryName,
    });

    if (!profesionFind) throw new NotFoundException(`Profesion not found`);

    for (let i = 0; i < userFind.profesions.length; i++) {
      if (userFind.profesions[i].category === profesionFind.category) {
        userFind.profesions.splice(i, 1);
      }
    }
    const userFinal = await this.userEntity.save(userFind);
    return userFinal;
  }
}
