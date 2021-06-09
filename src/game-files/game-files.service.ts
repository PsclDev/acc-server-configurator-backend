import { Injectable } from '@nestjs/common';
import { ParameterDto } from 'src/game-files/parameter/parameter.dto';
import { assistRules } from '../../data/game-files/assistRules.json';
import { configuration } from '../../data/game-files/configuration.json';
import { event } from '../../data/game-files/event.json';
import { eventRules } from '../../data/game-files/eventRules.json';
import { eventSession } from '../../data/game-files/eventSession.json';
import { settings } from '../../data/game-files/settings.json';
import { GameFilesRepository } from './game-files.repository';

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
    const eventPath = `${this.baseServerSettigsPath}/event.json`;

    const list = await this.gameFilesRepo.getFileContentWithValues(
      event,
      eventPath,
    );

    const practiceList = await this.gameFilesRepo.getFileContentWithValues(
      eventSession,
      eventPath,
      true,
      'P',
    );

    const qualifyList = await this.gameFilesRepo.getFileContentWithValues(
      eventSession,
      eventPath,
      true,
      'Q',
    );

    const raceList = await this.gameFilesRepo.getFileContentWithValues(
      eventSession,
      eventPath,
      true,
      'R',
    );

    return list.concat(practiceList, qualifyList, raceList);
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
