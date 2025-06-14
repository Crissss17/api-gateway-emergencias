import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { IncidentesService } from './incidentes.service';
import { IncidentesResolver } from './incidentes.resolver';
import { RecursosModule } from '../recursos/recursos.module';

@Module({
  imports: [
    HttpModule,
    RecursosModule, // Para poder resolver recursos_asignados
  ],
  providers: [IncidentesService, IncidentesResolver],
  exports: [IncidentesService],
})
export class IncidentesModule {}