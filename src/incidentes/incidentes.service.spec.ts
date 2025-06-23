import { Test, TestingModule } from '@nestjs/testing';
import { IncidentesService } from './incidentes.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of, throwError } from 'rxjs';

describe('IncidentesService', () => {
  let service: IncidentesService;
  let httpService: HttpService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IncidentesService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
            post: jest.fn(),
            patch: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('http://localhost:3001'),
          },
        },
      ],
    }).compile();

    service = module.get<IncidentesService>(IncidentesService);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should call findAll and map data', async () => {
    (httpService.get as jest.Mock).mockReturnValue(of({ data: [{ id: '1', descripcion: 'desc' }] }));
    const result = await service.findAll({}, 10, 0);
    expect(result).toEqual([{ id: '1', descripcion: 'desc' }]);
  });

  it('should handle findAll error', async () => {
    (httpService.get as jest.Mock).mockReturnValue(throwError(() => ({ isAxiosError: true, message: 'fail', response: { statusText: 'fail', data: {} } })));
    await expect(service.findAll({}, 10, 0)).rejects.toThrow();
  });

  it('should call findOne and map data', async () => {
    (httpService.get as jest.Mock).mockReturnValue(of({ data: { id: '1', descripcion: 'desc' } }));
    const result = await service.findOne('1');
    expect(result).toEqual({ id: '1', descripcion: 'desc' });
  });

  it('should handle findOne error', async () => {
    (httpService.get as jest.Mock).mockReturnValue(throwError(() => ({ isAxiosError: true, message: 'fail', response: { statusText: 'fail', data: {} } })));
    await expect(service.findOne('1')).rejects.toThrow();
  });

  it('should call create and map data', async () => {
    (httpService.post as jest.Mock).mockReturnValue(of({ data: { id: '1', descripcion: 'desc' } }));
    const result = await service.create({ foo: 'bar' });
    expect(result).toEqual({ id: '1', descripcion: 'desc' });
  });

  it('should call update and map data', async () => {
    (httpService.patch as jest.Mock).mockReturnValue(of({ data: { id: '1', descripcion: 'desc' } }));
    const result = await service.update('1', { foo: 'bar' });
    expect(result).toEqual({ id: '1', descripcion: 'desc' });
  });

  it('should call getEstadisticas', async () => {
    (httpService.get as jest.Mock).mockReturnValue(of({ data: { foo: 'bar' } }));
    const result = await service.getEstadisticas();
    expect(result).toEqual({ foo: 'bar' });
  });
});