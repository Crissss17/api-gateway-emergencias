import { Injectable, Logger } from '@nestjs/common';
import { IncidentesService } from '../incidentes/incidentes.service';
import { RecursosService } from '../recursos/recursos.service';
import { WhatsappService } from '../whatsapp/whatsapp.service';

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);

  constructor(
    private readonly incidentesService: IncidentesService,
    private readonly recursosService: RecursosService,
    private readonly whatsappService: WhatsappService,
  ) {}

  async getDashboardResumen(): Promise<any> {
    try {
      this.logger.log('Generando resumen del dashboard...');

      const [
        estadisticasIncidentes,
        estadisticasRecursos,
        incidentes,
        recursos,
      ] = await Promise.all([
        this.incidentesService.getEstadisticas(),
        this.recursosService.getEstadisticas(),
        this.incidentesService.findAll({ estado: 'pendiente' }, 10),
        this.recursosService.findAll(),
      ]);

      const incidentesActivos = estadisticasIncidentes.porEstado.pendiente + 
                               estadisticasIncidentes.porEstado.en_proceso;
      
      const incidentesCriticos = estadisticasIncidentes.porPrioridad.critica || 0;
      
      const recursosDisponibles = recursos.filter(r => r.disponible).length;
      const recursosEnUso = recursos.filter(r => !r.disponible).length;

      const alertas = this.generarAlertas(
        incidentesCriticos,
        recursosDisponibles,
        incidentes
      );

      const resumen = {
        incidentesActivos,
        incidentesCriticos,
        recursosDisponibles,
        recursosEnUso,
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
    recursosDisponibles: number,
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

    if (recursosDisponibles < 3) {
      alertas.push({
        id: `recursos-${Date.now()}`,
        tipo: 'recursos_limitados',
        mensaje: `Solo quedan ${recursosDisponibles} recursos disponibles`,
        timestamp: ahora,
        nivel: recursosDisponibles === 0 ? 'critico' : 'alto',
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