import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'user',
          protoPath: join(process.cwd(), 'proto/user.proto'), // Usa process.cwd() para ruta absoluta al ejecutar con ts-node o node dist
          url: 'localhost:50051',
        },
      },
    ]),
  ],
  providers: [UsersResolver, UsersService],
  exports: [UsersService], // <-- agrega esto si lo necesitas en otros módulos
})
export class UsersModule {}