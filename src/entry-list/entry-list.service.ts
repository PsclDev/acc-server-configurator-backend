import { Injectable } from '@nestjs/common';
import { DriverDto } from './driver.dto';
import { EntryListRepository } from './entry-list.repository';

@Injectable()
export class EntryListService {
  constructor(private entryListRepo: EntryListRepository) {}

  private baseServerSettigsPath = process.env.SERVER_CONFIG_FILES_PATH;

  async getEntryList(): Promise<DriverDto[]> {
    return await this.entryListRepo.getEntryList(
      `${this.baseServerSettigsPath}/entrylist.json`,
    );
  }

  async updateEntryList(entryList: DriverDto[]): Promise<string> {
    return await this.entryListRepo.exportToFile(
      entryList,
      `${this.baseServerSettigsPath}/entrylistTEST.json`,
    );
  }
}
