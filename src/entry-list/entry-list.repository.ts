import { Injectable } from '@nestjs/common';
import { readFileSync, writeFileSync } from 'fs';
import got from 'got';
import { DriverDto } from './driver.dto';

@Injectable()
export class EntryListRepository {
  async getEntryList(filePath: string): Promise<DriverDto[]> {
    let driverArr: DriverDto[] = [];
    const fileData = readFileSync(filePath, 'utf-8');
    const jsonContent = JSON.parse(fileData);

    for (const idx in jsonContent.entries) {
      const driverEntry = jsonContent.entries[idx];

      const driver: DriverDto = new DriverDto();

      for (const arrIdx in driverEntry.drivers) {
        const driverInArr = driverEntry.drivers[arrIdx];
        driver.playerID.push(driverInArr.playerID.substring(1));
      }

      if (driverEntry.raceNumber !== undefined)
        driver.raceNumber = driverEntry.raceNumber;
      if (driverEntry.isServerAdmin !== undefined)
        driver.isServerAdmin = driverEntry.isServerAdmin === 1 ? true : false;

      driverArr.push(driver);
    }

    driverArr = await this.getSteamInfo(driverArr);

    return driverArr;
  }

  private async getSteamInfo(driverArr: DriverDto[]): Promise<DriverDto[]> {
    const tmpArr: DriverDto[] = [];
    const steamKey = process.env.STEAM_API_KEY;
    let steamIdsString;
    driverArr.forEach((driver) => (steamIdsString += `${driver.playerID},`));

    const url = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${steamKey}&steamids=${steamIdsString}`;
    const response = await got(url);
    const jsonBody = JSON.parse(response.body);

    for (const idx in driverArr) {
      const driver = driverArr[idx];
      const responseIdx = jsonBody.response.players.findIndex(
        (data) => data.steamid === driver.playerID[0],
      );

      if (responseIdx > -1) {
        driver.username = jsonBody.response.players[responseIdx].personaname;
        console.log('found');
      }

      tmpArr.push(driver);
    }

    return tmpArr;
  }

  async exportToFile(
    entryList: DriverDto[],
    filePath: string,
  ): Promise<string> {
    const maxIdx = entryList.length - 1;
    let jsonString = '{	"entries": [';

    for (const idx in entryList) {
      const driver = entryList[idx];
      jsonString += '{ "drivers": [';

      for (const driverIdx in driver.playerID) {
        const driverId = driver.playerID[driverIdx];
        jsonString += `{"playerID": "S${driverId}"}`;
      }

      jsonString += '],';

      if (driver.raceNumber !== undefined)
        jsonString += `"raceNumber": ${driver.raceNumber}`;

      if (driver.isServerAdmin !== undefined)
        jsonString += `,"isServerAdmin": ${driver.isServerAdmin ? 1 : 0}`;

      if (parseInt(idx) === maxIdx) jsonString += '}';
      else jsonString += '},';
    }

    jsonString += '], "forceEntryList": 0}';

    writeFileSync(filePath, jsonString);
    return 'successfully updated entrylist';
  }
}
