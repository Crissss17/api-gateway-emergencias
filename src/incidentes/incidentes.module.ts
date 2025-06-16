import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { IncidentesService } from './incidentes.service';
import { IncidentesResolver } from './incidentes.resolver';

@Module({
  imports: [
    HttpModule,
  ],
  providers: [IncidentesService, IncidentesResolver],
  exports: [IncidentesService],
})
export class IncidentesModule {}