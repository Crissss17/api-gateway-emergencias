import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateIncidenteInput {
  @Field({ nullable: true })
  descripcion?: string;

  @Field({ nullable: true })
  estado?: string;

  @Field({ nullable: true })
  tipo?: string;

  @Field({ nullable: true })
  prioridad?: string;

  // Agrega más campos que se puedan actualizar
}