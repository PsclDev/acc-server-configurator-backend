import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ResultsController } from './results.controller';
import { ResultsService } from './results.service';
import { ResultsRepository } from './results.repository';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule],
  controllers: [ResultsController],
  providers: [ResultsService, ResultsRepository],
})
export class ResultsModule {}
