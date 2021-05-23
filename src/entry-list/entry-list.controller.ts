import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DriverDto } from './driver.dto';
import { EntryListService } from './entry-list.service';

@Controller('entrylist')
@UseGuards(AuthGuard())
export class EntryListController {
  constructor(private entryListService: EntryListService) {}

  @Get()
  async getEntryList(): Promise<DriverDto[]> {
    return await this.entryListService.getEntryList();
  }

  @Patch()
  async updateEntryList(@Body() entryList: DriverDto[]): Promise<string> {
    return await this.entryListService.updateEntryList(entryList);
  }
}
