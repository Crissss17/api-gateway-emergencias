import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { WhatsappService } from './whatsapp.service';
import { WhatsappResolver } from './whatsapp.resolver';

@Module({
  imports: [HttpModule],
  providers: [WhatsappService, WhatsappResolver],
  exports: [WhatsappService],
})
export class WhatsappModule {}