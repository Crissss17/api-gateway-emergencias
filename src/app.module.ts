import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { IncidentesModule } from './incidentes/incidentes.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { UsersModule } from './usuarios/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/graphql/schema.gql'),
      sortSchema: true,
      playground: true,
      introspection: true,
      context: ({ req }) => ({ headers: req.headers }),
      subscriptions: {
        'graphql-ws': true,
        'subscriptions-transport-ws': true,
      },
    }),
    ClientsModule.register([
      {
        name: 'USER_PACKAGE',
        transport: Transport.GRPC,
        options: {
          url: 'localhost:50051',
          package: 'user',
          protoPath: join(process.cwd(), 'proto/user.proto'),
        },
      },
    ]),
    IncidentesModule,
    DashboardModule,
    WhatsappModule,
    UsersModule, 
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}