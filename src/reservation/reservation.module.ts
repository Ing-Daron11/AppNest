import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { Reservation } from './entities/reservation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [ReservationController],
  providers: [ReservationService],
  exports: [TypeOrmModule],
})
export class ReservationModule {}
