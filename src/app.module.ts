import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameFilesModule } from './game-files/game-files.module';
import { EntryListModule } from './entry-list/entry-list.module';

@Module({
  imports: [GameFilesModule, EntryListModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
