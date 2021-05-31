import { Body, Controller, Logger, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  private readonly logger;

  constructor(private authService: AuthService) {
    this.logger = new Logger('AuthController');
  }

  @Post('/signup')
  async signUp(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    this.logger.log('New SignUp Request');
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('/signin')
  async signIn(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    this.logger.log('New SignIn Request');
    return this.authService.signIn(authCredentialsDto);
  }
}
