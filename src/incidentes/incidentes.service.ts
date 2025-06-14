import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class IncidentesService {
  private readonly logger = new Logger(IncidentesService.name);
  private readonly incidentesServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.incidentesServiceUrl = this.configService.get<string>(
      'INCIDENTES_SERVICE_URL',
      'http://localhost:3001'
    );
  }

  /**
   * Obtener todos los incidentes con filtros opcionales
   */
  async findAll(filtro?: any, limit?: number, offset?: number): Promise<any[]> {
    try {
      const params = new URLSearchParams();
      
      if (filtro?.estado) params.append('estado', filtro.estado);
      if (filtro?.tipo) params.append('tipo', filtro.tipo);
      if (limit) params.append('limit', limit.toString());
      if (offset) params.append('offset', offset.toString());

      const response = await firstValueFrom(
        this.httpService.get(`${this.incidentesServiceUrl}/incidentes?${params}`)
      );

      return response.data;
    } catch (error) {
      this.handleError('findAll', error);
    }
  }

  /**
   * Obtener un incidente por ID
   */
  async findOne(id: string): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.incidentesServiceUrl}/incidentes/${id}`)
      );

      return response.data;
    } catch (error) {
      this.handleError('findOne', error);
    }
  }

  /**
   * Crear un nuevo incidente
   */
  async create(createIncidenteInput: any): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.incidentesServiceUrl}/incidentes`,
          createIncidenteInput
        )
      );

      return response.data;
    } catch (error) {
      this.handleError('create', error);
    }
  }

  /**
   * Actualizar un incidente
   */
  async update(id: string, updateIncidenteInput: any): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.patch(
          `${this.incidentesServiceUrl}/incidentes/${id}`,
          updateIncidenteInput
        )
      );

      return response.data;
    } catch (error) {
      this.handleError('update', error);
    }
  }

  /**
   * Obtener estadísticas de incidentes
   */
  async getEstadisticas(): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.incidentesServiceUrl}/incidentes/stats/resumen`)
      );

      return response.data;
    } catch (error) {
      this.handleError('getEstadisticas', error);
    }
  }

  /**
   * Manejo centralizado de errores
   */
  private handleError(operation: string, error: any): never {
    if (error.isAxiosError) {
      const axiosError = error as AxiosError;
      this.logger.error(
        `Error en ${operation}: ${axiosError.message}`,
        axiosError.response?.data
      );
      
      throw new Error(
        `Error comunicándose con el servicio de incidentes: ${
          axiosError.response?.statusText || axiosError.message
        }`
      );
    }

    this.logger.error(`Error en ${operation}:`, error);
    throw error;
  }
}