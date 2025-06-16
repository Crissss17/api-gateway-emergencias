import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateIncidenteInput {
  @Field()
  descripcion: string;

  @Field()
  tipo: string;

  @Field()
  prioridad: string;

  // Agrega más campos requeridos para crear un incidente
}