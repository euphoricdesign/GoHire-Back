import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { Repository } from 'typeorm';
import { User } from 'src/database/entities/user.entity';
import { Request as NestRequest } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PopulateUserMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async use(@NestRequest() req: any, res: Response, next: NextFunction) {
    const userToken = req.headers.authorization?.split(' ')[0];

    if (userToken) {
      try {
        const decoded = jwt.verify(userToken, process.env.JWT_SECRET) as any;
        const email = decoded.email;
        const user = await this.userRepository.findOne({
          where: { email: email },
        });
        if (user) {
          req.currentUser = user;
        } else {
          throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
        }
      } catch (error) {
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
      }
    }
    next();
  }
}
