import { Resolver, Query } from '@nestjs/graphql';
import { DashboardService } from './dashboard.service';
import { Logger } from '@nestjs/common';
import { DashboardResumenType } from './dashboard-resumen.type';

@Resolver()
export class DashboardResolver {
  private readonly logger = new Logger(DashboardResolver.name);

  constructor(private readonly dashboardService: DashboardService) {}

  @Query(() => DashboardResumenType, { name: 'dashboardResumen' })
  async dashboardResumen() {
    this.logger.log('Query dashboardResumen');
    return this.dashboardService.getDashboardResumen();
  }
}