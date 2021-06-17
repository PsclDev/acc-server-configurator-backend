import { Injectable } from '@nestjs/common';
import { readFileSync, readdirSync } from 'fs';

@Injectable()
export class ResultsRepository {
  async getResults(dirPath: string): Promise<any[]> {
    const results = [];
    const files = readdirSync(dirPath);
    const fileName = files[0];
    const filePath = `${dirPath}/${fileName}`;
    const fileData = readFileSync(filePath, 'utf-8');
    const cleanedJson = await this.correctJsonFile(fileData);
    const json = JSON.parse(cleanedJson);
    results.push({ name: fileName, data: json });

    return results;
  }

  private async correctJsonFile(fileData: string): Promise<string> {
    if (fileData.includes('FP'))
      return fileData.replace('{\n    "sessionType": "FP",', '{');
    if (fileData.includes('Q'))
      return fileData.replace('{\n    "sessionType": "Q",', '{');
    if (fileData.includes('R'))
      return fileData.replace('{\n    "sessionType": "R",', '{');
  }
}
