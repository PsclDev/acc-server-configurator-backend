import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ResultsController } from './results.controller';
import { ResultsService } from './results.service';
import { ResultsRepository } from './results.repository';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [ResultsController],
  providers: [ResultsService, ResultsRepository],
})
export class ResultsModule {}
