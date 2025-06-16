import { Injectable, Logger } from '@nestjs/common';
import { IncidentesService } from 'src/incidentes/incidentes.service';
import { WhatsappService } from '../whatsapp/whatsapp.service';

@Injectable()
export class DashboardService {
  constructor(
    private readonly incidentesService: IncidentesService,
    private readonly whatsappService: WhatsappService, // <-- aquí
  ) {}

  private readonly logger = new Logger(DashboardService.name);
  async getDashboardResumen(): Promise<any> {
    try {
      this.logger.log('Generando resumen del dashboard...');

      const [
        estadisticasIncidentes,
        incidentes,
      ] = await Promise.all([
        this.incidentesService.getEstadisticas(),
        this.incidentesService.findAll({ estado: 'pendiente' }, 10),
      ]);

      const incidentesActivos = estadisticasIncidentes.porEstado.pendiente + 
                               estadisticasIncidentes.porEstado.en_proceso;
      
      const incidentesCriticos = estadisticasIncidentes.porPrioridad.critica || 0;

      // Si quieres mostrar recursos_asignados, obténlos del propio incidente, pero ya NO hay recursos globales

      const alertas = this.generarAlertas(
        incidentesCriticos,
        incidentes
      );

      const resumen = {
        incidentesActivos,
        incidentesCriticos,
        ultimosIncidentes: incidentes.slice(0, 5),
        alertas,
      };

      this.logger.log(`Dashboard generado: ${incidentesActivos} activos, ${incidentesCriticos} críticos`);
      
      return resumen;
    } catch (error) {
      this.logger.error('Error generando dashboard:', error);
      throw new Error('No se pudo generar el resumen del dashboard');
    }
  }

  private generarAlertas(
    incidentesCriticos: number,
    incidentes: any[]
  ): any[] {
    const alertas: any[] = [];
    const ahora = new Date();

    if (incidentesCriticos > 0) {
      alertas.push({
        id: `criticos-${Date.now()}`,
        tipo: 'incidentes_criticos',
        mensaje: `Hay ${incidentesCriticos} incidente(s) crítico(s) que requieren atención inmediata`,
        timestamp: ahora,
        nivel: 'critico',
      });
    }

    if (alertas.length === 0) {
      alertas.push({
        id: `ok-${Date.now()}`,
        tipo: 'sistema_ok',
        mensaje: 'Todos los sistemas funcionan correctamente',
        timestamp: ahora,
        nivel: 'info',
      });
    }

    return alertas;
  }
}