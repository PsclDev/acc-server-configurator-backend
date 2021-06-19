import { Injectable } from '@nestjs/common';
import { readFileSync, readdirSync } from 'fs';

@Injectable()
export class ResultsRepository {
  async getAllResults(dirPath: string): Promise<any[]> {
    const results = [];
    const files = readdirSync(dirPath);
    for (const idx in files) {
      const fileName = files[idx];
      const filePath = `${dirPath}/${fileName}`;
      const fileData = readFileSync(filePath, 'utf-8');
      const cleanedJson = await this.correctJsonFile(fileData);
      const json = JSON.parse(cleanedJson);
      results.push({ name: fileName, data: json });
    }

    return results;
  }

  async getSingleResult(dirPath: string, fileName: string): Promise<any> {
    const files = readdirSync(dirPath);
    console.log(files);
    const file = files.filter((x) => x === fileName);

    const fileData = readFileSync(`${dirPath}/${file}`, 'utf-8');
    const cleanedJson = await this.correctJsonFile(fileData);
    const json = JSON.parse(cleanedJson);
    return { name: fileName, data: json };
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
