import { Test, TestingModule } from '@nestjs/testing';
import { DashboardResolver } from './dashboard.resolver';
import { DashboardService } from './dashboard.service';

describe('DashboardResolver', () => {
  let resolver: DashboardResolver;
  let service: DashboardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardResolver,
        {
          provide: DashboardService,
          useValue: {
            getDashboardResumen: jest.fn().mockResolvedValue({ resumen: 'mock' }),
          },
        },
      ],
    }).compile();

    resolver = module.get<DashboardResolver>(DashboardResolver);
    service = module.get<DashboardService>(DashboardService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should call dashboardService.getDashboardResumen', async () => {
    await resolver.dashboardResumen();
    expect(service.getDashboardResumen).toHaveBeenCalled();
  });

  it('should return the dashboard resumen', async () => {
    const result = { resumen: 'mock' };
    (service.getDashboardResumen as jest.Mock).mockResolvedValueOnce(result);
    expect(await resolver.dashboardResumen()).toEqual(result);
  });
});