import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CarsController } from './cars.controller';
import { CarsService } from './cars.service';
import { Car } from './entities/car.entity';
import { BrandsModule } from 'src/brands/brands.module';

@Module({
  controllers: [CarsController],
  providers: [CarsService], 
  imports: [
    TypeOrmModule.forFeature([ Car ]),
    BrandsModule,
  ],
})
export class CarsModule {}
