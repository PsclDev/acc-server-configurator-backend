import { Controller, Get, ParseIntPipe, UseGuards } from '@nestjs/common';
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
    return await this.resultsService.getCarsArray(sessionName);
  }

  @Get('/:sessionName/:carId/laps')
  async getResultLaps(
    @Param('sessionName') sessionName: string,
    @Param('carId', ParseIntPipe) carId: number,
  ): Promise<any[]> {
    return await this.resultsService.getLapsArray(sessionName, carId);
  }

  @Get('/:sessionName/:carId/penalties')
  async getResultPenalties(
    @Param('sessionName') sessionName: string,
    @Param('carId', ParseIntPipe) carId: number,
  ): Promise<any[]> {
    return await this.resultsService.getPenaltyArray(sessionName, carId);
  }
}
