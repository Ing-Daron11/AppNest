import { Controller, Get, Post, Body, UseGuards, SetMetadata, Request, Req, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { RoleProtected } from './decorators/role-protected.decorator';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role.guard';
import { ValidRoles } from './interfaces/valid-roles';
import { Auth } from './decorators/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto){
    return this.authService.createUser(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto){
    return this.authService.loginUser(loginUserDto);
  }

  @Get('protected')
  @UseGuards(AuthGuard())
  protected1(){
    return 'esto es una ruta protegida';
  }

  @Get('private')
  @UseGuards( AuthGuard() )
  testingPrivateRoute(
    @Req() request: Express.Request,
    @GetUser() user: User,
    @GetUser('email') userEmail: string,
  ) {

    console.log(request);

    return {
      ok: true,
      message: 'Hola Mundo Private',
      user,
      userEmail
    }
  }

  @Get('protected2/:id')
  //@SetMetadata('roles', ['admin','user'])
  @UseGuards(AuthGuard(), UserRoleGuard)
  @RoleProtected(ValidRoles.admin, ValidRoles.user)
  protected2(@GetUser() user: User, @Param('id') id: string ){
    
    return {
      id,
      user,
      message: "OK"
    }
  }

  @Get('protected3')
  @Auth(ValidRoles.superuser, ValidRoles.admin)
  protected3(@GetUser() user: User ){
    
    return {
      user,
      message: "OK"
    }
  }  
}
