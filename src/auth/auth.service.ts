import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthorizationRepository } from './auth.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private authRepo: AuthorizationRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    if (authCredentialsDto.invitationCode !== process.env.SIGNUP_SECRET)
      throw new UnauthorizedException('Invalid Invitation Code');

    await this.authRepo.signUp(authCredentialsDto);

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
