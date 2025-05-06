import { Body,
     Controller,
     Delete, 
     Get, 
     Param, 
     ParseIntPipe, 
     ParseUUIDPipe, 
     Patch, 
     Post, 
     Put, 
     Query, 
     UsePipes,
     ValidationPipe} from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { SearchCarDto } from './dto/search-car.dto';
import { CarsService } from './cars.service';

@Controller('cars')
export class CarsController {
  constructor(private readonly carService: CarsService) {}

    @Get()
    getAll(
         @Query() params: SearchCarDto
    ){
        return this.carService.getAll();
    }

    @Get(':id')
    getById(@Param('id', ParseUUIDPipe) id: string){

        return this.carService.findById(id);
    }

    @Patch(':id')
    update(@Param('id', ParseUUIDPipe) id: string,
           @Body() car:UpdateCarDto){
        return this.carService.update(id, car);
    }
    
    @Delete(':id')
    delete(@Param('id', ParseUUIDPipe) id: string){
        return this.carService.delete(id);
    }

    @Post('')
    //@UsePipes(ValidationPipe)
    create(@Body() car:CreateCarDto){
        return this.carService.create(car);
    }
}
