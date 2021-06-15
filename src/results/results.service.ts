import { Injectable } from '@nestjs/common';
import { ResultsRepository } from './results.repository';

@Injectable()
export class ResultsService {
  constructor(private resultsRepo: ResultsRepository) {}

  private dirPath = process.env.SERVER_RESULTS_PATH;

  async getResults(): Promise<any[]> {
    const results = [];
    const resultsData = await this.resultsRepo.getResults(this.dirPath);

    for (const idx in resultsData) {
      const unformattedResult = resultsData[idx];
      const unformattedData = unformattedResult.data;

      const result = {
        name: await this.getTitle(
          unformattedResult.name,
          unformattedData.trackName,
        ),
        isWeatherWet: unformattedData.sessionResult.isWetSession,
        bestLap: await this.getTimeValueAsString(
          String(unformattedData.sessionResult.bestlap),
        ),
        bestSplits: {
          sectorOne: await this.getTimeValueAsString(
            String(unformattedData.sessionResult.bestSplits[0]),
          ),
          sectorTwo: await this.getTimeValueAsString(
            String(unformattedData.sessionResult.bestSplits[1]),
          ),
          sectorThree: await this.getTimeValueAsString(
            String(unformattedData.sessionResult.bestSplits[2]),
          ),
        },
        cars: [
          {
            car: {
              raceNumber: 0,
              name: 'Porsche',
              teamName: '',
              bestLap: 111948,
              bestSplits: {
                sectorOne: 35565,
                sectorTwo: 39957,
                sectorThree: 36426,
              },
              totalTime: 407894,
              lapCount: 3,
              missingMandatoryPitstop: -1,
              drivers: [
                {
                  driver: {
                    name: 'Max Mustermann',
                    shortname: 'MM',
                  },
                },
              ],
              laps: [
                {
                  lap: {
                    driver: 'Max Mustermann',
                    laptime: 109446,
                    isValidForBest: false,
                    splits: {
                      sectorOne: 35565,
                      sectorTwo: 39957,
                      sectorThree: 36426,
                    },
                  },
                },
              ],
              penalties: [
                {
                  penaltie: {
                    driver: 'Max Mustermann',
                    reason: 'Cutting',
                    penalty: 'Drive Through',
                    violationInLap: 7,
                    clearedInLap: 9,
                  },
                },
              ],
            },
          },
        ],
      };

      console.log(result);
      results.push(result);
    }

    return [];
    //return results;
  }

  private async getTitle(filename: string, trackName: string): Promise<string> {
    const splitted = filename.split('_');
    const date = splitted[0]
      .match(/.{1,2}/g)
      .reverse()
      .join('.');

    const time = splitted[1]
      .match(/.{1,2}/g)
      .splice(0, 2)
      .join(':');

    let raceType = '';
    trackName = await this.formatTrackname(trackName);

    if (splitted[2].includes('FP')) raceType = 'Practice';
    if (splitted[2].includes('Q')) raceType = 'Qualifying';
    if (splitted[2].includes('R')) raceType = 'Race';

    return `${date} ${time} - ${raceType} ${trackName}`;
  }

  private async formatTrackname(trackname: string): Promise<string> {
    const arr = trackname.split('_');

    for (let i = 0; i < arr.length; i++) {
      if (!arr[i].startsWith('2')) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].substr(1);
      }
    }

    return arr.join(' ');
  }

  private async formatData(json: any): Promise<any> {
    json.sessionResult.bestlap = await this.getTimeValueAsString(
      String(json.sessionResult.bestlap),
    );

    json.sessionResult.bestSplits[0] = await this.getTimeValueAsString(
      String(json.sessionResult.bestSplits[0]),
    );

    json.sessionResult.bestSplits[1] = await this.getTimeValueAsString(
      String(json.sessionResult.bestSplits[1]),
    );

    json.sessionResult.bestSplits[2] = await this.getTimeValueAsString(
      String(json.sessionResult.bestSplits[2]),
    );

    return json;
  }

  private async getTimeValueAsString(value: string): Promise<string> {
    const ms = value.substring(value.length - 3, value.length);
    let time = value.replace(ms, '');

    let timeArr = [];
    timeArr.push(ms);

    while (time.length > 2) {
      const subStr = time.substring(time.length - 2, time.length);
      time = time.replace(subStr, '');
      timeArr.push(subStr);
    }

    timeArr.push(time);

    if (timeArr.length === 2) timeArr.push('00');
    timeArr = timeArr.reverse();

    let formattedString = '';
    for (const idx in timeArr) {
      const timePart = timeArr[idx];
      if (parseInt(idx) === timeArr.length - 1) formattedString += timePart;
      else formattedString += timePart + ':';
    }

    return formattedString;
  }
}
