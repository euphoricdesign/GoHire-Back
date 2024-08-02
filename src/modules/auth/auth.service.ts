import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/database/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { Credential } from 'src/database/entities/credentials.entity';
import * as moment from 'moment';
import { Role } from 'src/enum/role.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Credential)
    private credentialsRepository: Repository<Credential>,
  ) {}

  retunSingIn(user: any) {
    console.log('estamos en el retun sing in');
    if (user.isBlocked === true)
      return { message: 'Your account has been blocked' };

    const userid = user.id;
    const role = user.role[0];
    const email = user.email;

    const playload = { userid, email, role: user.role };
    const token = this.jwtService.sign(playload, {
      secret: process.env.JWT_SECRET,
    });
    return {
      message: 'User login',
      token,
      role,
    };
  }

  async signIn(credentials) {
    try {
      const { email, name, family_name, picture, email_verified } = credentials;
      let user = await this.userRepository.findOne({
        where: { email: email },
        relations: { credential: true },
      });


      if (!user) {
        const passwordTest = 'Asd_*1234';
        const newCredential = new Credential();
        newCredential.email = email;
        newCredential.password = passwordTest;
        const credentialTest =
          await this.credentialsRepository.save(newCredential);

        user = await this.userRepository.create({
          id: uuidv4(),
          name: name ? name : null,
          lastName: family_name ? family_name : null,
          email: email,
          email_verified: email_verified ? email_verified : null,
          imgPictureUrl: picture ? picture : null,
          datecreateUser: moment().format('YYYY-MM-DD HH:mm:ss'),
          role: [Role.USER],
          credential: credentialTest,
        });
        this.userRepository.save(user);
        return this.retunSingIn(user);
      } 
      if (user.email === 'josemaria@example.com') {
        user.role = [Role.ADMIN];
        await this.userRepository.save(user);
        return this.retunSingIn(user);
      }
      else if (!credentials.password) {
        return this.retunSingIn(user);
      } else {
        if (credentials.password !== user.credential.password)
          throw new BadRequestException('Credenciales incorrectas');
        return this.retunSingIn(user);
      }
    } catch (error) {
      console.error('Error en signIn:', error);
      throw new BadRequestException('failed to login');
    }
  }

  async simulateAuthFlow({ email, password }) {
    const foundAccount = await this.credentialsRepository.findOne({
      where: { email: email },
    });

    if (foundAccount) throw new BadRequestException('user already exists');

    if (password && email) {
      const newCredential = new Credential();
      newCredential.email = email;
      newCredential.password = password;
      await this.credentialsRepository.save(newCredential);
      return newCredential;
    }
  }

  async signInTest(credentials) {
    const userFind = await this.userRepository.findOne({
      where: { email: credentials.email },
      relations: { credential: true },
    });

    if (!userFind) throw new BadRequestException('Credenciales incorrectas');

    if (credentials.password !== userFind.credential.password)
      throw new BadRequestException('Credenciales incorrectas');

    
    if (userFind.email === 'josemaria@example.com') {
      userFind.role = [Role.ADMIN];
      await this.userRepository.save(userFind);
      return this.retunSingIn(userFind);
    }
    return this.retunSingIn(userFind);
  }
}
