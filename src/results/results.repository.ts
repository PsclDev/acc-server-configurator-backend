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

      const cleanedJson = await this.correctJsonFile(fileName, fileData);
      const json = JSON.parse(cleanedJson);

      results.push({ name: fileName, data: json });
    }

    return results;
  }

  private async correctJsonFile(
    session: string,
    content: string,
  ): Promise<string> {
    if (session.includes('FP'))
      return content.replace('{\n    "sessionType": "FP",', '{');
    if (session.includes('Q'))
      return content.replace('{\n    "sessionType": "Q",', '{');
    if (session.includes('R'))
      return content.replace('{\n    "sessionType": "R",', '{');
  }
}
