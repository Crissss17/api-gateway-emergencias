import { Resolver, Query } from '@nestjs/graphql';
import { DashboardService } from './dashboard.service';
import { Logger } from '@nestjs/common';

@Resolver('Dashboard')
export class DashboardResolver {
  private readonly logger = new Logger(DashboardResolver.name);

  constructor(private readonly dashboardService: DashboardService) {}

  @Query('dashboardResumen')
  async dashboardResumen() {
    this.logger.log('Query dashboardResumen');
    return this.dashboardService.getDashboardResumen();
  }
}