import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateIncidenteInput {
  @Field()
  descripcion: string;

  @Field()
  from: string;

  @Field()
  message_id: string;

  @Field()
  name: string;

  @Field()
  prioridad: string;

  @Field()
  text: string;

  @Field()
  timestamp: string;

  @Field()
  tipo: string;

  @Field()
  wa_id: string;
}