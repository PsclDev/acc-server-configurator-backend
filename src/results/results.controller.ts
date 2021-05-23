import { Controller, Get, UseGuards } from '@nestjs/common';
import { ResultsService } from './results.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('results')
@UseGuards(AuthGuard())
export class ResultsController {
  constructor(private resultsService: ResultsService) {}

  @Get()
  async getResults(): Promise<any[]> {
    return await this.resultsService.getResults();
  }
}
