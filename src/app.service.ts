import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World! I am a REST-API build on nestJS. Build by github.com/UnRunDead';
  }
}
