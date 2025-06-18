import { ObjectType, Field, Int } from '@nestjs/graphql';
import { IncidenteType } from 'src/dto/incidente.type';

@ObjectType()
export class AlertaType {
  @Field()
  id: string;

  @Field()
  tipo: string;

  @Field()
  mensaje: string;

  @Field()
  nivel: string;

  @Field()
  timestamp: Date;
}

@ObjectType()
export class DashboardResumenType {
  @Field(() => Int)
  incidentesActivos: number;

  @Field(() => Int)
  incidentesCriticos: number;

  @Field(() => [IncidenteType])
  ultimosIncidentes: IncidenteType[];

  @Field(() => [AlertaType])
  alertas: AlertaType[];
}