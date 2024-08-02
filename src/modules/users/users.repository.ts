import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/database/entities/user.entity';
import * as data from '../../utils/mock-users.json';
import { Experience } from 'src/database/entities/experience.entity';
import { JwtService } from '@nestjs/jwt';
import { UploadApiResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(Experience)
    private experienceRepository: Repository<Experience>,
    @InjectRepository(User) private usersRepository: Repository<User>,
    private authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  async uploadImageUser(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        { resource_type: 'auto' },
        (error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(new Error(`Error uploading image`));
          }
        },
      );
      toStream(file.buffer).pipe(upload);
    });
  }

  async getAllBlocks() {
    const users = await this.usersRepository.find({
      where: { isBlocked: true },
    });
    return users;
  }

  async updateUser(id: string, UpdateUserDto: UpdateUserDto, res) {
    if (res && res.secure_url) {
      UpdateUserDto.imgPictureUrl = res.secure_url;
    }
    const userFounded = await this.usersRepository.findOneBy({ id: id });
    if (!userFounded) throw new NotFoundException(`No found user con id ${id}`);

    const user = await this.usersRepository.find();
    for (let i = 0; i < user.length; i++) {
      const dni = user[i].dni;
      if (UpdateUserDto.dni === dni)
        throw new BadRequestException(
          'Plis check dni entry. The "dni" must be unique',
        );
    }
    const updates = this.usersRepository.merge(userFounded, UpdateUserDto);
    await this.usersRepository.save(updates);
    return userFounded;
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: {
        experiences: true,
        educations: true,
        profesions: true,
        notifications: true,
        publicactions: {
          usersList: true,
        },
      },
    });

    if (!user) throw new NotFoundException(`No found user con id ${id}`);
    return user;
  }

  async gettoken(token: string) {
    const validate = await this.jwtService.verify(token);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const user_id = validate.user_id;
  }
  async createUsers(createUserDto) {
    try {
      const user = await this.usersRepository.create(createUserDto);

      return user;
    } catch (error) {}
  }

  async findAll() {
    const users = await this.usersRepository.find({
      relations: { experiences: true, educations: true, profesions: true },
    });

    const filteredUsers: User[] = [];
    users.map((element) => {
      if (element.isBlocked === false) {
        filteredUsers.push(element);
      }
    });
    return filteredUsers;
  }

  async blockUser(id) {
    const userFounded = await this.usersRepository.findOneBy({ id: id });

    if (!userFounded) throw new NotFoundException(`No found user con id ${id}`);
    const updates = this.usersRepository.merge(userFounded, {
      isBlocked: !userFounded.isBlocked,
    });
    await this.usersRepository.save(updates);
    return userFounded;
  }

  async findUsers(category: string, city: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const where: any = {};

    if (category && city) {
      where.profesions = { category: category };
      where.city = city;
    } else if (category) {
      where.profesions = { category: category };
    } else if (city) {
      where.city = city;
    }

    const [usersFind, count] = await this.usersRepository.findAndCount({
      relations: { profesions: true, experiences: true, educations: true },
      where,
      take: limit,
      skip: skip,
    });

    if (usersFind.length === 0)
      throw new NotFoundException(`No users were found whith those parameters`);

    return { usersFind, count };
  }

  async filterNewMembers() {
    const users = await this.usersRepository.find({
      relations: { experiences: true },
    });

    for (let i = 0; i < users.length; i++) {
      if (!(users[i].experiences.length === 0)) {
        await this.usersRepository.update(
          { id: users[i].id },
          { newMember: false },
        );
      }
    }
  }

  async averageRate() {
    const users = await this.usersRepository.find();

    for (let i = 0; i < users.length; i++) {
      const rates = users[i].professionalRate;

      const totalRate = rates.reduce(
        (accumulator, currentRate) => Number(accumulator) + Number(currentRate),
      );

      const average = totalRate / rates.length;
      users[i].professionalRate = [average];
      await this.usersRepository.save(users[i]);
    }
  }

  async calculateProfesionalRate() {
    const users = await this.usersRepository.find({
      relations: { experiences: { feedback: true } },
    });

    for (let i = 0; i < users.length; i++) {
      for (let j = 0; j < users[i].experiences.length; j++) {
        const experience = users[i].experiences[j];

        if (experience.feedback) {
          users[i].professionalRate.push(experience.feedback.rate);
          await this.usersRepository.save(users[i]);
        }
      }
    }
  }

  async seederUser() {
    const promises = data?.map(async (element) => {
      const user = new User();
      user.name = element.name;
      user.lastName = element.lastName;
      user.dni = element.dni;
      user.country = element.country;
      user.city = element.city;
      user.birthdate = element.birthdate;
      user.bio = element.bio;
      user.email = element.email;
      user.datecreateUser = new Date(element.datecreateUser);
      user.credential = await this.authService.simulateAuthFlow(element);

      await this.usersRepository
        .createQueryBuilder()
        .insert()
        .into(User)
        .values(user)
        .orUpdate(
          [
            'name',
            'lastName',
            'dni',
            'country',
            'city',
            'birthdate',
            'bio',
            'email',
          ],
          ['dni'],
        )
        .execute();
    });
    await Promise.all(promises);

    return {
      message: 'users was seeder successfully!',
    };
  }
}
