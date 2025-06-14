import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);
  private readonly whatsappServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.whatsappServiceUrl = this.configService.get<string>(
      'WHATSAPP_SERVICE_URL',
      'http://localhost:3002'
    );
  }

  async findAllMensajes(tipo?: string): Promise<any[]> {
    try {
      const params = new URLSearchParams();
      if (tipo) params.append('tipo', tipo);

      const response = await firstValueFrom(
        this.httpService.get(`${this.whatsappServiceUrl}/webhook/whatsapp/mensajes?${params}`)
      );

      return response.data;
    } catch (error) {
      this.handleError('findAllMensajes', error);
    }
  }

  async findMensajeById(id: string): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.whatsappServiceUrl}/webhook/whatsapp/mensajes/${id}`)
      );

      return response.data;
    } catch (error) {
      this.handleError('findMensajeById', error);
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
        `Error comunicándose con el servicio de WhatsApp: ${
          axiosError.response?.statusText || axiosError.message
        }`
      );
    }

    this.logger.error(`Error en ${operation}:`, error);
    throw error;
  }
}