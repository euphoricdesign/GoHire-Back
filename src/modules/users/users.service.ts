import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UserRepository) {}

  findUsers(category: string, city: string, page: number, limit: number) {
    this.usersRepository.calculateProfesionalRate();
    setTimeout(async () => {
      await this.usersRepository.averageRate();
    }, 1000);

    return this.usersRepository.findUsers(category, city, page, limit);
  }

  getAllBlocks() {
    return this.usersRepository.getAllBlocks();
  }
  findAll() {
    return this.usersRepository.findAll();
  }

  async create(createUserDto: CreateUserDto) {
    return this.usersRepository.createUsers(createUserDto);
  }

  findOne(id: string) {
    return this.usersRepository.findOne(id);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    file?: Express.Multer.File,
  ) {
    let res = null;
    if (file) {
      res = await this.usersRepository.uploadImageUser(file);
    }
    return this.usersRepository.updateUser(id, updateUserDto, res);
  }

  blockUser(id: string) {
    return this.usersRepository.blockUser(id);
  }
}
