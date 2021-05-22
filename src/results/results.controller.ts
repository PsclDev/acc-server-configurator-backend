import { Controller, Get } from '@nestjs/common';
import { ResultsService } from './results.service';

@Controller('results')
export class ResultsController {
  constructor(private resultsService: ResultsService) {}

  @Get()
  async getResults(): Promise<any[]> {
    return await this.resultsService.getResults();
  }
}
