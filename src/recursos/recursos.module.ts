import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RecursosService } from './recursos.service';
import { RecursosResolver } from './recursos.resolver';

@Module({
  imports: [HttpModule],
  providers: [RecursosService, RecursosResolver],
  exports: [RecursosService],
})
export class RecursosModule {}