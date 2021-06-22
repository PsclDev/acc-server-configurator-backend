import { Injectable } from '@nestjs/common';
import { ResultsRepository } from './results.repository';
import { carList } from 'data/game-files/carModelList.json';

@Injectable()
export class ResultsService {
  constructor(private resultsRepo: ResultsRepository) {}

  private dirPath = process.env.SERVER_RESULTS_PATH;

  async getAllResults(): Promise<any[]> {
    const results = [];
    const resultsData = await this.resultsRepo.getAllResults(this.dirPath);
    for (const idx in resultsData) {
      const unformattedResult = resultsData[idx];
      const unformattedData = unformattedResult.data;
      const unformattedSessionResult = unformattedData.sessionResult;

      const result = {
        id: unformattedResult.name,
        name: await this.getTitle(
          unformattedResult.name,
          unformattedData.trackName,
        ),
        isWeatherWet: unformattedSessionResult.isWetSession,
        bestLap: await this.getTimeValueAsString(
          String(unformattedSessionResult.bestlap),
        ),
        bestSplits: {
          sectorOne: await this.getTimeValueAsString(
            String(unformattedSessionResult.bestSplits[0]),
          ),
          sectorTwo: await this.getTimeValueAsString(
            String(unformattedSessionResult.bestSplits[1]),
          ),
          sectorThree: await this.getTimeValueAsString(
            String(unformattedSessionResult.bestSplits[2]),
          ),
        },
      };

      results.push(result);
    }

    return results;
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

  private async getTimeValueAsString(value: string): Promise<string> {
    value = value.toString();
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

  public async getCarsArray(sessionName: string): Promise<any[]> {
    const carArr = [];

    const resultData = await this.resultsRepo.getSingleResult(
      this.dirPath,
      sessionName,
    );
    const unformattedData = resultData.data;
    const sessionLeaderboard = unformattedData.sessionResult.leaderBoardLines;

    for (const carIdx in sessionLeaderboard) {
      const carObj = sessionLeaderboard[carIdx];
      const carDetails = carObj.car;
      const carTiming = carObj.timing;
      const carDrivers = carDetails.drivers;

      const car = {
        id: carDetails.carId,
        raceNumber: carDetails.raceNumber,
        name: await this.getCarModelByIndex(carDetails.carModel),
        teamName: carDetails.teamName,
        bestLap: await this.getTimeValueAsString(carTiming.bestLap),
        bestSplits: {
          sectorOne: await this.getTimeValueAsString(carTiming.bestSplits[0]),
          sectorTwo: await this.getTimeValueAsString(carTiming.bestSplits[1]),
          sectorThree: await this.getTimeValueAsString(carTiming.bestSplits[2]),
        },
        totalTime: await this.getTimeValueAsString(carTiming.totalTime),
        lapCount: carTiming.lapCount,
        missingMandatoryPitstop: carObj.missingMandatoryPitstop,
        drivers: await this.getDriversArray(carDrivers),
        laps: [],
        penalties: [],
      };

      carArr.push(car);
    }

    return carArr;
  }

  private async getCarModelByIndex(index: number): Promise<string> {
    const car = carList.filter((car) => car.value === index);
    return car[0].name;
  }

  private async getDriversArray(drivers: any): Promise<any[]> {
    const driverArr = [];
    let itemIndex = 0;

    for (const driverIdx in drivers) {
      const driverJson = drivers[driverIdx];
      const driver = {
        id: itemIndex,
        name: `${driverJson.firstName} ${driverJson.lastName}`,
        shortName: `${driverJson.shortName}`,
      };

      driverArr.push(driver);
      itemIndex++;
    }

    return driverArr;
  }

  public async getLapsArray(
    sessionName: string,
    carId: number,
  ): Promise<any[]> {
    const lapsArr = [];

    const resultData = await this.resultsRepo.getSingleResult(
      this.dirPath,
      sessionName,
    );
    const laps = resultData.data.laps.filter((lap) => lap.carId === carId);

    for (const lapIdx in laps) {
      const lapJson = laps[lapIdx];

      const lap = {
        driverIndex: lapJson.driverIndex,
        isValidForBest: lapJson.isValidForBest,
        laptime: await this.getTimeValueAsString(lapJson.laptime),
        splits: {
          sectorOne: await this.getTimeValueAsString(lapJson.splits[0]),
          sectorTwo: await this.getTimeValueAsString(lapJson.splits[1]),
          sectorThree: await this.getTimeValueAsString(lapJson.splits[2]),
        },
      };

      lapsArr.push(lap);
    }

    return lapsArr;
  }

  public async getPenaltyArray(
    sessionName: string,
    carId: number,
  ): Promise<any[]> {
    const penaltyArr = [];

    const resultData = await this.resultsRepo.getSingleResult(
      this.dirPath,
      sessionName,
    );
    const penalties = resultData.data.penalties.filter(
      (penalty) => penalty.carId === carId,
    );

    for (const penaltyIdx in penalties) {
      const penaltyJson = penalties[penaltyIdx];

      const penalty = {
        driverIndex: penaltyJson.driverIndex,
        reason: penaltyJson.reason,
        penalty: penaltyJson.penalty,
        violationInLap: penaltyJson.violationInLap,
        clearedInLap: penaltyJson.clearedInLap,
      };

      penaltyArr.push(penalty);
    }

    return penaltyArr;
  }
}
