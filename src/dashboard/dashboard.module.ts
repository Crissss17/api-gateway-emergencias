import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardResolver } from './dashboard.resolver';
import { IncidentesModule } from '../incidentes/incidentes.module';
import { RecursosModule } from '../recursos/recursos.module';

@Module({
  imports: [IncidentesModule, RecursosModule],
  providers: [DashboardService, DashboardResolver],
  exports: [DashboardService],
})
export class DashboardModule {}