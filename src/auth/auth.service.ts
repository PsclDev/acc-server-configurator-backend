import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthorizationRepository } from './auth.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  private readonly logger;

  constructor(
    private authRepo: AuthorizationRepository,
    private jwtService: JwtService,
  ) {
    this.logger = new Logger('AuthService');
  }

  async signUp(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    this.logger.log('New SignUp Request');
    this.logger.debug(
      'Checking Invitation Code',
      authCredentialsDto.invitationCode,
    );
    if (authCredentialsDto.invitationCode !== process.env.SIGNUP_SECRET)
      throw new UnauthorizedException('Invalid Invitation Code');

    this.logger.debug('Await AuthRepo.SignUp');
    await this.authRepo.signUp(authCredentialsDto);

    this.logger.debug('Await AuthRepo.SignIn and return');
    return await this.signIn(authCredentialsDto);
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const user = await this.authRepo.validateUserPassword(authCredentialsDto);

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const username = user.username;
    const permissions = user.permissions;
    const payload: JwtPayload = { username, permissions };
    const accessToken = await this.jwtService.sign(payload);

    return { accessToken };
  }
}
