import { Injectable } from '@nestjs/common';
import { ParameterDto } from 'src/game-files/parameter/parameter.dto';
import { assistRules } from '../../data/game-files/assistRules.json';
import { configuration } from '../../data/game-files/configuration.json';
import { event } from '../../data/game-files/event.json';
import { eventRules } from '../../data/game-files/eventRules.json';
import { settings } from '../../data/game-files/settings.json';
import { GameFilesRepository } from './game-files.repository';
import { ParameterPermission } from './parameter/parameter-permission.enum';

@Injectable()
export class GameFilesService {
  constructor(private gameFilesRepo: GameFilesRepository) {}

  private baseServerSettigsPath = process.env.SERVER_CONFIG_FILES_PATH;

  async getAssistRules(): Promise<ParameterDto[]> {
    return await this.gameFilesRepo.getFileContentWithValues(
      assistRules,
      `${this.baseServerSettigsPath}/assistRules.json`,
    );
  }

  async patchAssistRules(parameters: ParameterDto[]): Promise<string> {
    return await this.gameFilesRepo.exportArrayToFile(
      parameters,
      `${this.baseServerSettigsPath}/assistRules.json`,
    );
  }

  async getConfiguration(): Promise<ParameterDto[]> {
    return await this.gameFilesRepo.getFileContentWithValues(
      configuration,
      `${this.baseServerSettigsPath}/configuration.json`,
    );
  }

  async patchConfiguration(parameters: ParameterDto[]): Promise<string> {
    return await this.gameFilesRepo.exportArrayToFile(
      parameters,
      `${this.baseServerSettigsPath}/configuration.json`,
    );
  }

  async getEvent(): Promise<ParameterDto[]> {
    const list = await this.gameFilesRepo.getFileContentWithValues(
      event,
      `${this.baseServerSettigsPath}/event.json`,
    );

    return await this.correctSessionArrayToSingleValues(list);
  }

  private async correctSessionArrayToSingleValues(list) {
    const sessionsIndex = list.findIndex((entry) => entry.name === 'sessions');
    const sessions = list[sessionsIndex];
    list.splice(sessionsIndex, 1);
    const sessionsValue = JSON.parse(sessions.value);

    //TODO REFACTOR WITH NEW FILE AND CREATE FAKE "SETTING"
    for (const idx in sessionsValue) {
      const config = sessionsValue[idx];
      const keys = Object.keys(config);
      const keyIdxSessionType = keys.findIndex(
        (entry) => entry === 'sessionType',
      );

      const values = Object.values(config);
      const sessionName = await this.getNameFromSessionType(
        values[keyIdxSessionType],
      );

      keys.splice(keyIdxSessionType);
      values.splice(keyIdxSessionType);

      for (const innerIdx in keys) {
        const param: ParameterDto = {
          name: `${sessionName} - ${keys[innerIdx]}`,
          description: '',
          value: values[innerIdx],
          value_type: 'number',
          required_permissions: ParameterPermission.USER,
        };

        list.push(param);
      }
    }

    return list;
  }

  private async getNameFromSessionType(sessionType): Promise<string> {
    switch (sessionType) {
      case 'P':
        return 'Practice';

      case 'Q':
        return 'Qualifying';

      case 'R':
        return 'Race';
    }
  }

  async patchEvent(parameters: ParameterDto[]): Promise<string> {
    return await this.gameFilesRepo.exportArrayToFile(
      parameters,
      `${this.baseServerSettigsPath}/eventTEST.json`,
    );
  }

  async getEventRules(): Promise<ParameterDto[]> {
    return await this.gameFilesRepo.getFileContentWithValues(
      eventRules,
      `${this.baseServerSettigsPath}/eventRules.json`,
    );
  }

  async patchEventRules(parameters: ParameterDto[]): Promise<string> {
    return await this.gameFilesRepo.exportArrayToFile(
      parameters,
      `${this.baseServerSettigsPath}/eventRules.json`,
    );
  }

  async getSettings(): Promise<ParameterDto[]> {
    return await this.gameFilesRepo.getFileContentWithValues(
      settings,
      `${this.baseServerSettigsPath}/settings.json`,
    );
  }

  async patchSettings(parameters: ParameterDto[]): Promise<string> {
    return await this.gameFilesRepo.exportArrayToFile(
      parameters,
      `${this.baseServerSettigsPath}/settings.json`,
    );
  }
}
