import { Test, TestingModule } from '@nestjs/testing';
import { IncidentesResolver } from './incidentes.resolver';
import { IncidentesService } from './incidentes.service';

describe('IncidentesResolver', () => {
  let resolver: IncidentesResolver;
  let service: IncidentesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IncidentesResolver,
        {
          provide: IncidentesService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([{ id: '1' }]),
            findOne: jest.fn().mockResolvedValue({ id: '1' }),
            create: jest.fn().mockResolvedValue({ id: '1' }),
            update: jest.fn().mockResolvedValue({ id: '1' }),
          },
        },
      ],
    }).compile();

    resolver = module.get<IncidentesResolver>(IncidentesResolver);
    service = module.get<IncidentesService>(IncidentesService);
  });

  it('should call findAll', async () => {
    expect(await resolver.incidentes({}, 10, 0)).toEqual([{ id: '1' }]);
    expect(service.findAll).toHaveBeenCalledWith({}, 10, 0);
  });

  it('should call findOne', async () => {
    expect(await resolver.incidente('1')).toEqual({ id: '1' });
    expect(service.findOne).toHaveBeenCalledWith('1');
  });

});