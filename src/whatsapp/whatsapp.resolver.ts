import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { WhatsappService } from './whatsapp.service';

@Resolver('Mensaje')
export class WhatsappResolver {
  constructor(private readonly whatsappService: WhatsappService) {}

  @Query('mensajes')
  async mensajes(@Args('tipo') tipo?: string) {
    return this.whatsappService.findAllMensajes(tipo);
  }

  @Query('mensaje')
  async mensaje(@Args('id', { type: () => ID }) id: string) {
    return this.whatsappService.findMensajeById(id);
  }
}