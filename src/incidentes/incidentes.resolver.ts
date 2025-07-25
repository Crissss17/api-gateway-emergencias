import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { IncidentesService } from './incidentes.service';
import { Logger } from '@nestjs/common';
import { UpdateIncidenteInput } from '../dto/update-incidente.input';
import { FiltroIncidenteInput } from '../dto/filtro-incidente.input';
import { IncidenteType } from '../dto/incidente.type';
import { CreateIncidenteInput } from '../dto/create-incidente.input';

@Resolver(() => IncidenteType)
export class IncidentesResolver {
  private readonly logger = new Logger(IncidentesResolver.name);

  constructor(
    private readonly incidentesService: IncidentesService,
  ) {}

  @Query(() => [IncidenteType], { name: 'incidentes' })
  async incidentes(
    @Args('filtro', { type: () => FiltroIncidenteInput, nullable: true }) filtro?: FiltroIncidenteInput,
    @Args('limit', { nullable: true }) limit?: number,
    @Args('offset', { nullable: true }) offset?: number,
  ): Promise<IncidenteType[]> {
    this.logger.log(`Query incidentes - Filtro recibido: ${JSON.stringify(filtro)}`);
    return this.incidentesService.findAll(filtro, limit, offset);
  }

  @Query(() => IncidenteType, { name: 'incidente' })
  async incidente(@Args('id', { type: () => ID }) id: string): Promise<IncidenteType> {
    this.logger.log(`Query incidente - ID: ${id}`);
    return this.incidentesService.findOne(id);
  }

  @Mutation(() => IncidenteType, { name: 'crearIncidente' })
  async crearIncidente(
    @Args('input', { type: () => CreateIncidenteInput }) createIncidenteInput: CreateIncidenteInput,
  ): Promise<IncidenteType> {
    this.logger.log(`Mutation crearIncidente - Input: ${JSON.stringify(createIncidenteInput)}`);
    return this.incidentesService.create(createIncidenteInput);
  }

  @Mutation(() => IncidenteType, { name: 'actualizarIncidente' })
  async actualizarIncidente(
    @Args('id') id: string,
    @Args('input', { type: () => UpdateIncidenteInput }) updateIncidenteInput: UpdateIncidenteInput,
  ): Promise<IncidenteType> {
    this.logger.log(`Input recibido en resolver: ${JSON.stringify(updateIncidenteInput)}`);
    return this.incidentesService.update(id, updateIncidenteInput);
  }
}