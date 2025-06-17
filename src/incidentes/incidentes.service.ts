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

  async findAll(filtro?: any, limit?: number, offset?: number): Promise<any[]> {
    try {
      filtro = filtro || {};
      this.logger.log(`findAll - Filtro recibido: ${JSON.stringify(filtro)}`);

      const params = new URLSearchParams();
      if (filtro.estado) params.append('estado', filtro.estado);
      if (filtro.tipo) params.append('tipo', filtro.tipo);
      if (filtro.prioridad) params.append('prioridad', filtro.prioridad);
      if (limit !== undefined && limit !== null) params.append('limit', limit.toString());
      if (offset !== undefined && offset !== null) params.append('offset', offset.toString());

      const url =
        params.toString().length > 0
          ? `${this.incidentesServiceUrl}/incidentes?${params}`
          : `${this.incidentesServiceUrl}/incidentes`;

      this.logger.log(`findAll - URL generada: ${url}`);

      const response = await firstValueFrom(
        this.httpService.get(url)
      );

      const data = Array.isArray(response.data) ? response.data : (response.data?.incidentes ?? []);
      this.logger.log(`findAll - Respuesta recibida: ${JSON.stringify(data)}`);
      return data.map((incidente: any) => ({
        ...incidente,
        id: incidente.id ?? incidente._id ?? incidente.uuid ?? "",
        descripcion: incidente.descripcion ?? incidente.description ?? incidente.desc ?? "",
      }));
    } catch (error) {
      this.handleError('findAll', error);
    }
  }

  async findOne(id: string): Promise<any> {
    try {
      this.logger.log(`findOne - Solicitando incidente con id: ${id}`);
      const response = await firstValueFrom(
        this.httpService.get(`${this.incidentesServiceUrl}/incidentes/${id}`)
      );
      const incidente = response.data;
      this.logger.log(`findOne - Respuesta: ${JSON.stringify(incidente)}`);
      return {
        ...incidente,
        id: incidente.id ?? incidente._id ?? incidente.uuid ?? "",
        descripcion: incidente.descripcion ?? incidente.description ?? incidente.desc ?? "",
      };
    } catch (error) {
      this.handleError('findOne', error);
    }
  }

  async create(createIncidenteInput: any): Promise<any> {
    try {
      this.logger.log(`create - Payload enviado a ms-incidentes: ${JSON.stringify(createIncidenteInput)}`);
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.incidentesServiceUrl}/incidentes`,
          createIncidenteInput
        )
      );
      const incidente = response.data;
      this.logger.log(`create - Respuesta recibida: ${JSON.stringify(incidente)}`);
      return {
        ...incidente,
        id: incidente.id ?? incidente._id ?? incidente.uuid ?? "",
        descripcion: incidente.descripcion ?? incidente.description ?? incidente.desc ?? "",
      };
    } catch (error) {
      this.handleError('create', error);
    }
  }

  async update(id: string, updateIncidenteInput: any): Promise<any> {
    this.logger.log('updateIncidenteInput keys: ' + Object.keys(updateIncidenteInput));
    this.logger.log('updateIncidenteInput raw: ' + JSON.stringify(updateIncidenteInput));
    
    // CORRECCIÓN: convertir a objeto plano
    const plainPayload = { ...updateIncidenteInput };
    this.logger.log('Payload enviado al microservicio: ' + JSON.stringify(plainPayload));

    try {
      this.logger.log(`update - id: ${id}, payload: ${JSON.stringify(plainPayload)}`);
      const response = await firstValueFrom(
        this.httpService.patch(
          `${this.incidentesServiceUrl}/incidentes/${id}`,
          plainPayload
        )
      );
      const incidente = response.data;
      this.logger.log(`update - Respuesta: ${JSON.stringify(incidente)}`);
      return {
        ...incidente,
        id: incidente.id ?? incidente._id ?? incidente.uuid ?? "",
        descripcion: incidente.descripcion ?? incidente.description ?? incidente.desc ?? "",
      };
    } catch (error) {
      this.handleError('update', error);
    }
  }

  async getEstadisticas(): Promise<any> {
    try {
      this.logger.log(`getEstadisticas - Solicitando estadísticas`);
      const response = await firstValueFrom(
        this.httpService.get(`${this.incidentesServiceUrl}/incidentes/stats/resumen`)
      );
      this.logger.log(`getEstadisticas - Respuesta: ${JSON.stringify(response.data)}`);
      return response.data;
    } catch (error) {
      this.handleError('getEstadisticas', error);
    }
  }

  private handleError(operation: string, error: any): never {
    if ((error as AxiosError).isAxiosError) {
      const axiosError = error as AxiosError;
      this.logger.error(
        `Error en ${operation}: ${axiosError.message}`,
        `Respuesta del servicio: ${JSON.stringify(axiosError.response?.data || '')}`
      );
      throw new Error(
        `Error comunicándose con el servicio de incidentes: ${
          axiosError.response?.statusText || axiosError.message
        } - Detalle: ${JSON.stringify(axiosError.response?.data)}`
      );
    }
    this.logger.error(`Error en ${operation}:`, error);
    throw error;
  }
}