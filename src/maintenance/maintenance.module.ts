import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MaintenanceController } from './maintenance.controller';
import { MaintenanceService } from './maintenance.service';
import { Maintenance } from './entities/maintenance.entity';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Maintenance]), PassportModule, AuthModule],
  controllers: [MaintenanceController],
  providers: [MaintenanceService],
  exports: [TypeOrmModule],
})
export class MaintenanceModule {}
