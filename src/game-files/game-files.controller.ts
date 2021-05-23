import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ParameterDto } from 'src/game-files/parameter/parameter.dto';
import { GameFilesService } from './game-files.service';

@Controller('game-files')
@UseGuards(AuthGuard())
export class GameFilesController {
  constructor(private gameFilesService: GameFilesService) {}

  @Get('/assistRules')
  async getAssistRules(): Promise<ParameterDto[]> {
    return await this.gameFilesService.getAssistRules();
  }

  @Patch('/assistRules')
  async patchAssistRules(@Body() parameters: ParameterDto[]): Promise<string> {
    return await this.gameFilesService.patchAssistRules(parameters);
  }

  @Get('/configuration')
  async getConfiguration(): Promise<ParameterDto[]> {
    return await this.gameFilesService.getConfiguration();
  }

  @Patch('/configuration')
  async patchConfiguration(
    @Body() parameters: ParameterDto[],
  ): Promise<string> {
    return await this.gameFilesService.patchConfiguration(parameters);
  }

  @Get('/event')
  async getEvent(): Promise<ParameterDto[]> {
    return await this.gameFilesService.getEvent();
  }

  @Patch('/event')
  async patchEvent(@Body() parameters: ParameterDto[]): Promise<string> {
    return await this.gameFilesService.patchEvent(parameters);
  }

  @Get('/eventRules')
  async getEventRules(): Promise<ParameterDto[]> {
    return await this.gameFilesService.getEventRules();
  }

  @Patch('/eventRules')
  async patchEventRules(@Body() parameters: ParameterDto[]): Promise<string> {
    return await this.gameFilesService.patchEventRules(parameters);
  }

  @Get('/settings')
  async getSettings(): Promise<ParameterDto[]> {
    return await this.gameFilesService.getSettings();
  }

  @Patch('/settings')
  async patchSettings(@Body() parameters: ParameterDto[]): Promise<string> {
    return await this.gameFilesService.patchSettings(parameters);
  }
}
