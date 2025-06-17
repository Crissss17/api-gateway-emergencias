import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateIncidenteInput {
  @Field({ nullable: true })
  descripcion?: string;

  @Field({ nullable: true })
  estado?: string;

  @Field({ nullable: true })
  prioridad?: string;

  @Field({ nullable: true })
  tipo?: string;
}