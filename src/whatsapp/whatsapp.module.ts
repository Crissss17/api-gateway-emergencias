import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios'; // <- ¡IMPORTANTE!
import { ConfigModule } from '@nestjs/config'; // <- Opcional pero recomendado
import { WhatsappService } from './whatsapp.service';

@Module({
  imports: [
    HttpModule,       // <-- ¡AGREGA ESTO!
    ConfigModule,     // <-- Opcional, si usas ConfigService en el servicio
  ],
  providers: [WhatsappService],
  exports: [WhatsappService],
})
export class WhatsappModule {}