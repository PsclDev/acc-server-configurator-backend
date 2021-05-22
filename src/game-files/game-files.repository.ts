import { ParameterPermission } from 'src/game-files/parameter/parameter-permission.enum';
import { ParameterDto } from 'src/game-files/parameter/parameter.dto';
import { readFileSync, writeFileSync } from 'fs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GameFilesRepository {
  async getFileContentWithValues(
    jsonTemplate,
    filePath: string,
  ): Promise<ParameterDto[]> {
    let paramArr: ParameterDto[] = [];

    for (const idx in jsonTemplate) {
      const config = jsonTemplate[idx];

      const param: ParameterDto = {
        name: config.name,
        description: config.description,
        value: '',
        value_type: config.value_type,
        required_permissions: this.getParameterPermission(
          config.required_permissions,
        ),
      };

      paramArr.push(param);
    }

    paramArr = await this.insertValuesToArray(paramArr, filePath);

    return paramArr;
  }

  async insertValuesToArray(
    parameters: ParameterDto[],
    filePath: string,
  ): Promise<ParameterDto[]> {
    const fileData = readFileSync(filePath, 'utf-8');
    const jsonContent = JSON.parse(fileData);

    for (const attribute in jsonContent) {
      const idx = parameters.findIndex(
        (parameter) => parameter.name === attribute,
      );

      if (idx === -1) continue;

      const parameter = parameters[idx];
      parameter.value = jsonContent[attribute];

      parameters[idx] = parameter;
    }

    return parameters;
  }

  getParameterPermission(permission: string): ParameterPermission {
    if (permission.toLowerCase() === 'admin') return ParameterPermission.ADMIN;

    return ParameterPermission.USER;
  }

  async exportArrayToFile(
    parameters: ParameterDto[],
    filePath: string,
  ): Promise<string> {
    let jsonString = '{';
    const maxIdx = parameters.length - 1;

    for (const idx in parameters) {
      const parameter = parameters[idx];

      if (parameter.value === '') continue;

      if (parseInt(idx) === maxIdx)
        jsonString += `"${parameter.name}":"${parameter.value}"`;
      else jsonString += `"${parameter.name}":"${parameter.value}",`;
    }
    jsonString += '}';

    writeFileSync(filePath, jsonString);

    return 'successfully updated';
  }
}
