import { Field, ObjectType, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class EstadoStatsType {
  @Field(() => Int)
  pendiente: number;

  @Field(() => Int)
  en_proceso: number;

  @Field(() => Int)
  resuelto: number;
}

@ObjectType()
export class TipoStatsType {
  @Field()
  tipo: string;

  @Field(() => Int)
  cantidad: number;
}

@ObjectType()
export class PrioridadStatsType {
  @Field(() => Int)
  baja: number;

  @Field(() => Int)
  media: number;

  @Field(() => Int)
  alta: number;

  @Field(() => Int)
  critica: number;
}

@ObjectType()
export class EstadisticasIncidentesType {
  @Field(() => Int)
  total: number;

  @Field(() => EstadoStatsType)
  porEstado: EstadoStatsType;

  @Field(() => [TipoStatsType])
  porTipo: TipoStatsType[];

  @Field(() => PrioridadStatsType)
  porPrioridad: PrioridadStatsType;

  @Field(() => Float, { nullable: true })
  tiempoPromedioRespuesta?: number;
}