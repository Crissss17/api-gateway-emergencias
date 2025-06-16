import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class IncidenteType {
  @Field(() => ID)
  id: string;

  @Field()
  descripcion: string;

  @Field({ nullable: true })
  estado?: string;

  @Field({ nullable: true })
  tipo?: string;

  @Field({ nullable: true })
  prioridad?: string;

  // Agrega aquí más campos según tu microservicio
}