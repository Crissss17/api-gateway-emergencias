import { Test, TestingModule } from '@nestjs/testing';
import { WhatsappResolver } from './whatsapp.resolver';
import { WhatsappService } from './whatsapp.service';

describe('WhatsappResolver', () => {
  let resolver: WhatsappResolver;
  let service: WhatsappService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WhatsappResolver,
        {
          provide: WhatsappService,
          useValue: {
            findAllMensajes: jest.fn().mockResolvedValue([{ id: '1' }]),
            findMensajeById: jest.fn().mockResolvedValue({ id: '1' }),
          },
        },
      ],
    }).compile();

    resolver = module.get<WhatsappResolver>(WhatsappResolver);
    service = module.get<WhatsappService>(WhatsappService);
  });

  it('should return mensajes', async () => {
    expect(await resolver.mensajes('tipo')).toEqual([{ id: '1' }]);
    expect(service.findAllMensajes).toHaveBeenCalledWith('tipo');
  });

  it('should return mensaje by id', async () => {
    expect(await resolver.mensaje('1')).toEqual({ id: '1' });
    expect(service.findMensajeById).toHaveBeenCalledWith('1');
  });
});