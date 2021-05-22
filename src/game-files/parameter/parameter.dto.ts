import { ParameterPermission } from 'src/game-files/parameter/parameter-permission.enum';

export class ParameterDto {
  name: string;
  description: string;
  value: any;
  value_type: string;
  required_permissions: ParameterPermission;
}
