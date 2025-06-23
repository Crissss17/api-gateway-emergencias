import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService } from './dashboard.service';
import { IncidentesService } from '../incidentes/incidentes.service';
import { WhatsappService } from '../whatsapp/whatsapp.service';

describe('DashboardService', () => {
  let service: DashboardService;
  let incidentesService: IncidentesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        {
          provide: IncidentesService,
          useValue: {
            getEstadisticas: jest.fn().mockResolvedValue({
              porEstado: { pendiente: 2, en_proceso: 1 },
              porPrioridad: { critica: 3 },
            }),
            findAll: jest.fn().mockResolvedValue([{ id: 1 }, { id: 2 }, { id: 3 }]),
          },
        },
        {
          provide: WhatsappService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
    incidentesService = module.get<IncidentesService>(IncidentesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return dashboard resumen with alertas', async () => {
    const result = await service.getDashboardResumen();
    expect(result.incidentesActivos).toBe(3);
    expect(result.incidentesCriticos).toBe(3);
    expect(result.ultimosIncidentes.length).toBe(3);
    expect(result.alertas.length).toBeGreaterThan(0);
  });

  it('should handle error and throw', async () => {
    jest.spyOn(incidentesService, 'getEstadisticas').mockRejectedValueOnce(new Error('fail'));
    await expect(service.getDashboardResumen()).rejects.toThrow('No se pudo generar el resumen del dashboard');
  });

  it('should return sistema_ok alerta if no criticos', () => {
    const alertas = (service as any).generarAlertas(0, []);
    expect(alertas[0].tipo).toBe('sistema_ok');
  });

  it('should return criticos alerta if criticos > 0', () => {
    const alertas = (service as any).generarAlertas(2, []);
    expect(alertas[0].tipo).toBe('incidentes_criticos');
  });
});