import { Injectable } from '@nestjs/common';
import { readFileSync, writeFileSync } from 'fs';
import got from 'got';
import { DriverDto } from './driver.dto';

@Injectable()
export class EntryListRepository {
  async getEntryList(filePath: string): Promise<DriverDto[]> {
    const driverArr: DriverDto[] = [];
    const fileData = readFileSync(filePath, 'utf-8');
    const jsonContent = JSON.parse(fileData);

    for (const idx in jsonContent.entries) {
      const driverEntry = jsonContent.entries[idx];

      const driver: DriverDto = new DriverDto();

      for (const arrIdx in driverEntry.drivers) {
        const driverInArr = driverEntry.drivers[arrIdx];
        driver.playerID.push(driverInArr.playerID);
      }

      if (driverEntry.raceNumber !== undefined)
        driver.raceNumber = driverEntry.raceNumber;
      if (driverEntry.isServerAdmin !== undefined)
        driver.isServerAdmin = driverEntry.isServerAdmin === 1 ? true : false;

      driver.username = await this.getSteamInfo(
        driver.playerID[0].substring(1),
      );

      driverArr.push(driver);
    }

    return driverArr;
  }

  private async getSteamInfo(steamId: string): Promise<string> {
    const steamKey = process.env.STEAM_API_KEY;
    const url = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${steamKey}&steamids=${steamId}`;
    const response = await got(url);
    const jsonBody = JSON.parse(response.body);
    return jsonBody.response.players[0].personaname;
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
        jsonString += `{"playerID": "${driverId}"}`;
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
