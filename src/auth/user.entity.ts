import * as bcrypt from 'bcrypt';
import { ParameterPermission } from 'src/game-files/parameter/parameter-permission.enum';

export class User {
  id: number;
  username: string;
  password: string;
  salt: string;
  permissions: ParameterPermission;

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);

    return hash === this.password;
  }
}
