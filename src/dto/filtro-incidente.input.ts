import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class FiltroIncidenteInput {
  @Field({ nullable: true })
  estado?: string;

  @Field({ nullable: true })
  tipo?: string;

  @Field({ nullable: true })
  prioridad?: string;
}