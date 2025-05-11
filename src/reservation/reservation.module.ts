import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { Reservation } from './entities/reservation.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation]), PassportModule, AuthModule ],
  controllers: [ReservationController],
  providers: [ReservationService],
  exports: [TypeOrmModule],
})
export class ReservationModule {}
