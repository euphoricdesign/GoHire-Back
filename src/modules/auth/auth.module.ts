import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Credential } from 'src/database/entities/credentials.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Credential, User])],
  controllers: [AuthController],
  providers: [AuthService, AuthService, JwtService],
})
export class AuthModule {}
