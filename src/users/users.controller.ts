import { Controller, Get, Param, Delete, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { ValidRoles } from '../auth/interfaces/valid-roles';
import { User } from '../auth/entities/user.entity';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Patch, Body } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  
    
  @Get()
  @Auth(ValidRoles.admin)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Auth(ValidRoles.admin)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Get('me')
  @Auth() // cualquier usuario autenticado puede acceder
  getProfile(@GetUser() user: User) {
    return this.usersService.getProfile(user.id);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin, ValidRoles.admin)
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto  ) {
    return this.usersService.update(id, updateUserDto);
  }
}

