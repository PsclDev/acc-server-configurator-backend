import { Injectable } from '@nestjs/common';
import { readFileSync, readdirSync } from 'fs';

@Injectable()
export class ResultsRepository {
  async getResults(dirPath: string): Promise<any[]> {
    const results = [];
    const files = readdirSync(dirPath);

    for (const fileIdx in files) {
      const fileName = files[fileIdx];
      const fileData = readFileSync(`${dirPath}/${fileName}`, 'utf-8');
      const json = JSON.parse(fileData);
      results.push({ name: fileName, data: json });
    }

    return results;
  }
}
