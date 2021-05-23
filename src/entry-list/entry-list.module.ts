import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { EntryListController } from './entry-list.controller';
import { EntryListRepository } from './entry-list.repository';
import { EntryListService } from './entry-list.service';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule],
  controllers: [EntryListController],
  providers: [EntryListService, EntryListRepository],
})
export class EntryListModule {}
