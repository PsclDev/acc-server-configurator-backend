import { Injectable } from '@nestjs/common';
import { ResultsRepository } from './results.repository';

@Injectable()
export class ResultsService {
  constructor(private resultsRepo: ResultsRepository) {}

  private dirPath = process.env.SERVER_RESULTS_PATH;

  async getResults(): Promise<any[]> {
    return await this.resultsRepo.getResults(this.dirPath);
  }
}
