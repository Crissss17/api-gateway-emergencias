import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { RecursosService } from './recursos.service';
import { Logger } from '@nestjs/common';

@Resolver('Recurso')
export class RecursosResolver {
  private readonly logger = new Logger(RecursosResolver.name);

  constructor(private readonly recursosService: RecursosService) {}

  @Query('recursos')
  async recursos(
    @Args('disponibles', { nullable: true }) disponibles?: boolean,
    @Args('tipo', { nullable: true }) tipo?: string,
  ) {
    this.logger.log(`Query recursos - Disponibles: ${disponibles}, Tipo: ${tipo}`);
    return this.recursosService.findAll(disponibles, tipo);
  }

  @Query('recurso')
  async recurso(@Args('id', { type: () => ID }) id: string) {
    this.logger.log(`Query recurso - ID: ${id}`);
    return this.recursosService.findOne(id);
  }
}