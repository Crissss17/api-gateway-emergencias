import { ObjectType, Field, ID, Float } from '@nestjs/graphql';

@ObjectType()
export class IncidenteType {
  @Field(() => ID)
  id: string;

  @Field()
  descripcion: string;

  @Field({ nullable: true })
  estado?: string;

  @Field({ nullable: true })
  prioridad?: string;

  @Field({ nullable: true })
  tipo?: string;

  @Field({ nullable: true })
  from?: string;

  @Field({ nullable: true })
  wa_id?: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  message_id?: string;

  @Field({ nullable: true })
  timestamp?: string;

  @Field({ nullable: true })
  text?: string;

  @Field(() => Float, { nullable: true })
  latitude?: number;

  @Field(() => Float, { nullable: true })
  longitude?: number;

  @Field(() => [String], { nullable: true })
  recursos_asignados?: string[];

  @Field({ nullable: true })
  observaciones?: string;

  @Field({ nullable: true })
  score_clasificacion?: number;

  @Field(() => [String], { nullable: true })
  factores_aplicados?: string[];

  @Field({ nullable: true })
  tiempo_respuesta_sugerido?: string;

  @Field({ nullable: true })
  createdAt?: string;

  @Field({ nullable: true })
  updatedAt?: string;
}