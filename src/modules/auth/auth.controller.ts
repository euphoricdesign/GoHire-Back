import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators/is-public.decorator';
import { RegisterDto } from './dto/register.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('signIn')
  async signIn(@Body() credentials: any) {
    return await this.authService.signIn(credentials);
  }

  @Public()
  @Post('signInTest')
  async signInTest(@Body() credentials: RegisterDto) {
    return this.authService.signInTest(credentials);
  }
}
