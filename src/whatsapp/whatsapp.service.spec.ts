import { Test, TestingModule } from '@nestjs/testing';
import { WhatsappService } from './whatsapp.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of, throwError } from 'rxjs';

describe('WhatsappService', () => {
  let service: WhatsappService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WhatsappService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('http://localhost:3002'),
          },
        },
      ],
    }).compile();

    service = module.get<WhatsappService>(WhatsappService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should return all mensajes', async () => {
    (httpService.get as jest.Mock).mockReturnValue(of({ data: [{ id: '1' }] }));
    const result = await service.findAllMensajes('tipo');
    expect(result).toEqual([{ id: '1' }]);
  });

  it('should handle error in findAllMensajes', async () => {
    (httpService.get as jest.Mock).mockReturnValue(throwError(() => ({ isAxiosError: true, message: 'fail', response: { statusText: 'fail', data: {} } })));
    await expect(service.findAllMensajes('tipo')).rejects.toThrow();
  });

  it('should return mensaje by id', async () => {
    (httpService.get as jest.Mock).mockReturnValue(of({ data: { id: '1' } }));
    const result = await service.findMensajeById('1');
    expect(result).toEqual({ id: '1' });
  });

  it('should handle error in findMensajeById', async () => {
    (httpService.get as jest.Mock).mockReturnValue(throwError(() => ({ isAxiosError: true, message: 'fail', response: { statusText: 'fail', data: {} } })));
    await expect(service.findMensajeById('1')).rejects.toThrow();
  });
});