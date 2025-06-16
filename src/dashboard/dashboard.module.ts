import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { IncidentesService } from 'src/incidentes/incidentes.service';
import { WhatsappModule } from '../whatsapp/whatsapp.module';
import { HttpModule } from '@nestjs/axios'; // <-- ¡IMPORTANTE!

@Module({
  imports: [
    WhatsappModule,
    HttpModule, // <-- ¡AGREGA ESTO!
  ],
  providers: [DashboardService, IncidentesService],
})
export class DashboardModule {}