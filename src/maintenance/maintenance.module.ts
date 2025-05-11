import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MaintenanceController } from './maintenance.controller';
import { MaintenanceService } from './maintenance.service';
import { Maintenance } from './entities/maintenance.entity';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([Maintenance]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [MaintenanceController],
  providers: [MaintenanceService],
  exports: [TypeOrmModule],
})
export class MaintenanceModule {}
