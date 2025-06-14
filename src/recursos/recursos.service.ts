import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class RecursosService {
  private readonly logger = new Logger(RecursosService.name);
  private readonly recursosServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.recursosServiceUrl = this.configService.get<string>(
      'RECURSOS_SERVICE_URL',
      'http://localhost:8000'
    );
  }

  async findAll(disponibles?: boolean, tipo?: string): Promise<any[]> {
    try {
      const params = new URLSearchParams();
      
      if (disponibles !== undefined) params.append('disponibles', disponibles.toString());
      if (tipo) params.append('tipo', tipo);

      const response = await firstValueFrom(
        this.httpService.get(`${this.recursosServiceUrl}/recursos?${params}`)
      );

      return response.data;
    } catch (error) {
      this.handleError('findAll', error);
    }
  }

  async findOne(id: string): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.recursosServiceUrl}/recursos/${id}`)
      );

      return response.data;
    } catch (error) {
      this.handleError('findOne', error);
    }
  }

  async findByIncidente(incidenteId: string): Promise<any[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.recursosServiceUrl}/recursos/incidente/${incidenteId}`)
      );

      return response.data || [];
    } catch (error) {
      this.logger.warn(`No se encontraron recursos para el incidente ${incidenteId}`);
      return [];
    }
  }

  async getEstadisticas(): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.recursosServiceUrl}/recursos/stats`)
      );

      return response.data;
    } catch (error) {
      this.handleError('getEstadisticas', error);
    }
  }

  private handleError(operation: string, error: any): never {
    if (error.isAxiosError) {
      const axiosError = error as AxiosError;
      this.logger.error(
        `Error en ${operation}: ${axiosError.message}`,
        axiosError.response?.data
      );
      
      throw new Error(
        `Error comunicándose con el servicio de recursos: ${
          axiosError.response?.statusText || axiosError.message
        }`
      );
    }

    this.logger.error(`Error en ${operation}:`, error);
    throw error;
  }
}