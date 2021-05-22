import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EntryListController } from './entry-list.controller';
import { EntryListRepository } from './entry-list.repository';
import { EntryListService } from './entry-list.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [EntryListController],
  providers: [EntryListService, EntryListRepository],
})
export class EntryListModule {}
