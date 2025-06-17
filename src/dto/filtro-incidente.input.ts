import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class FiltroIncidenteInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  estado?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  tipo?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  prioridad?: string;
}