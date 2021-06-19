import { Controller, Get, UseGuards } from '@nestjs/common';
import { ResultsService } from './results.service';
import { AuthGuard } from '@nestjs/passport';
import { Param } from '@nestjs/common';

@Controller('results')
@UseGuards(AuthGuard())
export class ResultsController {
  constructor(private resultsService: ResultsService) {}

  @Get()
  async getAllResults(): Promise<any[]> {
    return await this.resultsService.getAllResults();
  }

  @Get('/:sessionName/cars')
  async getResultCars(
    @Param('sessionName') sessionName: string,
  ): Promise<any[]> {
    console.log(sessionName);
    return [];
  }

  @Get('/:sessionName/laps')
  async getResultLaps(
    @Param('sessionName') sessionName: string,
  ): Promise<any[]> {
    console.log(sessionName);
    return [];
  }

  @Get('/:sessionName/penalties')
  async getResultPenalties(
    @Param('sessionName') sessionName: string,
  ): Promise<any[]> {
    console.log(sessionName);
    return [];
  }
}
