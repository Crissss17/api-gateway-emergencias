import { Module } from '@nestjs/common';
import { DashboardResolver } from './dashboard.resolver';
import { DashboardService } from './dashboard.service';
import { IncidentesModule } from '../incidentes/incidentes.module';
import { WhatsappModule } from '../whatsapp/whatsapp.module'; 

@Module({
  imports: [IncidentesModule, WhatsappModule], 
  providers: [DashboardResolver, DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}