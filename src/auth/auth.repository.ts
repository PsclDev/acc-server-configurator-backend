import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import * as bcrypt from 'bcrypt';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import { v4 as uuid } from 'uuid';
import { ParameterPermission } from 'src/game-files/parameter/parameter-permission.enum';

@Injectable()
export class AuthorizationRepository {
  private readonly logger;
  private users: User[] = [];
  private authPath = './data/auth.json';

  constructor() {
    this.logger = new Logger('AuthRepository');
  }

  async loadUsers(): Promise<void> {
    this.logger.debug('Load Users');
    const filePath = this.authPath;

    if (!existsSync(filePath)) return;

    const data = readFileSync(filePath, 'utf-8');
    const jsonContent = JSON.parse(data);

    this.logger.debug('Read user file', jsonContent);
    const userlist = jsonContent.users;

    for (const idx in userlist) {
      const jsonUser = userlist[idx].user;
      this.logger.debug('Current Json User', jsonUser);

      const user = new User();
      user.id = jsonUser.id;
      user.username = jsonUser.username;
      user.salt = jsonUser.salt;
      user.password = jsonUser.password;
      user.permissions = await this.setPermissions(jsonUser.permissions);

      this.users.push(user);
    }

    this.logger.debug('All Users Array', this.users);
  }

  async exportUsers(): Promise<void> {
    this.logger.debug('Export User');
    const maxIdx = this.users.length - 1;
    let jsonString = '{ "users": [';

    for (const idx in this.users) {
      const user = this.users[idx];

      jsonString += `{
          "user": {
              "id": "${user.id}",
              "username": "${user.username}",
              "salt": "${user.salt}",
              "password": "${user.password}",
              "permissions": "${user.permissions}"
          }
      }`;

      if (parseInt(idx) !== maxIdx) jsonString += ',';
    }

    jsonString += ']}';

    this.logger.debug('Export File Content', jsonString);
    await writeFileSync(this.authPath, jsonString);
    return;
  }

  async findUser(username: string): Promise<User> {
    this.logger.debug('Find User');
    if (this.users.length === 0) await this.loadUsers();

    const idx = this.users.findIndex(
      (user) => user.username.toLowerCase() === username,
    );

    if (idx !== -1) return this.users[idx];

    return null;
  }

  async createUser(user: User): Promise<void> {
    this.logger.debug('Create User');
    if (this.users.length === 0) await this.loadUsers();

    const userFound = await this.findUser(user.username);

    if (userFound) throw new ConflictException('Username already in use');

    this.users.push(user);

    await this.exportUsers();
  }

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    this.logger.debug('Sign Up');
    const { username, password } = authCredentialsDto;

    const user = new User();
    user.id = uuid();
    user.username = username;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);
    user.permissions = await this.setPermissions('user');

    await this.createUser(user);
  }

  async setPermissions(permission: string): Promise<ParameterPermission> {
    this.logger.debug('Set Permissions');
    if (permission.toLowerCase() === 'admin') return ParameterPermission.ADMIN;
    return ParameterPermission.USER;
  }

  async validateUserPassword(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<User> {
    this.logger.debug('Validate User Password');
    const { username, password } = authCredentialsDto;

    const user = await this.findUser(username);

    if (!user) return null;

    const validPassword = await user.validatePassword(password);

    if (!validPassword) return null;

    return user;
  }

  async hashPassword(password: string, salt: string): Promise<string> {
    this.logger.debug('Hash Password');
    return bcrypt.hash(password, salt);
  }
}
