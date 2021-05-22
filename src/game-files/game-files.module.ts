import { Module } from '@nestjs/common';
import { GameFilesController } from './game-files.controller';
import { GameFilesService } from './game-files.service';
import { ConfigModule } from '@nestjs/config';
import { GameFilesRepository } from './game-files.repository';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [GameFilesController],
  providers: [GameFilesService, GameFilesRepository],
})
export class GameFilesModule {}
