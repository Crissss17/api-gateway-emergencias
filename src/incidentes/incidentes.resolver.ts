import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { IncidentesService } from './incidentes.service';
import { RecursosService } from '../recursos/recursos.service';
import { Logger } from '@nestjs/common';

@Resolver('Incidente')
export class IncidentesResolver {
  private readonly logger = new Logger(IncidentesResolver.name);

  constructor(
    private readonly incidentesService: IncidentesService,
    private readonly recursosService: RecursosService,
  ) {}

  /**
   * Query: Obtener todos los incidentes
   */
  @Query('incidentes')
  async incidentes(
    @Args('filtro', { nullable: true }) filtro?: any,
    @Args('limit', { nullable: true }) limit?: number,
    @Args('offset', { nullable: true }) offset?: number,
  ) {
    this.logger.log(`Query incidentes - Filtro: ${JSON.stringify(filtro)}`);
    return this.incidentesService.findAll(filtro, limit, offset);
  }

  /**
   * Query: Obtener un incidente por ID
   */
  @Query('incidente')
  async incidente(@Args('id', { type: () => ID }) id: string) {
    this.logger.log(`Query incidente - ID: ${id}`);
    return this.incidentesService.findOne(id);
  }

  /**
   * Query: Obtener estadísticas de incidentes
   */
  @Query('estadisticasIncidentes')
  async estadisticasIncidentes() {
    this.logger.log('Query estadisticasIncidentes');
    const stats = await this.incidentesService.getEstadisticas();
    
    // Transformar el formato de estadísticas del servicio al esperado por GraphQL
    return {
      total: stats.total,
      porEstado: {
        pendiente: stats.porEstado.pendiente,
        en_proceso: stats.porEstado.en_proceso,
        resuelto: stats.porEstado.resuelto,
      },
      porTipo: Object.entries(stats.porTipo).map(([tipo, cantidad]) => ({
        tipo,
        cantidad,
      })),
      porPrioridad: {
        baja: stats.porPrioridad.baja,
        media: stats.porPrioridad.media,
        alta: stats.porPrioridad.alta,
        critica: stats.porPrioridad.critica,
      },
      tiempoPromedioRespuesta: stats.tiempoPromedioRespuesta || null,
    };
  }

  /**
   * Mutation: Crear un nuevo incidente
   */
  @Mutation('crearIncidente')
  async crearIncidente(@Args('input') createIncidenteInput: any) {
    this.logger.log(`Mutation crearIncidente - Input: ${JSON.stringify(createIncidenteInput)}`);
    return this.incidentesService.create(createIncidenteInput);
  }

  /**
   * Mutation: Actualizar un incidente
   */
  @Mutation('actualizarIncidente')
  async actualizarIncidente(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') updateIncidenteInput: any,
  ) {
    this.logger.log(`Mutation actualizarIncidente - ID: ${id}, Input: ${JSON.stringify(updateIncidenteInput)}`);
    return this.incidentesService.update(id, updateIncidenteInput);
  }

  /**
   * ResolveField: Obtener recursos asignados a un incidente
   * Este campo se resuelve dinámicamente cuando se solicita
   */
  @Query('incidente')
  async recursosAsignados(@Args('id') incidenteId: string) {
    try {
      // Obtener recursos del servicio de recursos filtrando por incidente
      const recursos = await this.recursosService.findByIncidente(incidenteId);
      return recursos || [];
    } catch (error) {
      this.logger.error(`Error obteniendo recursos del incidente ${incidenteId}:`, error);
      return [];
    }
  }
}