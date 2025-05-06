import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import  * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) {

  }

  createUser(createUserDto: CreateUserDto) {
    try {
      const{password, ...userData} = createUserDto;
      const user = this.userRepository.create(
        {
          password: bcrypt.hashSync(password, 10),
          ...userData
        });
      return this.userRepository.save(user);
    }
    catch (error) {
      throw new Error('Error creating user');
    }
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const {email, password} = loginUserDto;
    const user: User | null = await this.userRepository.findOne(
      {
        where: {email},
        select: ['id','email','name', 'password','isActive']
      });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      user_id: user.id,
      name: user.name,
      email: user.email,
      token: this.jwtService.sign({user_id: user.id}),
    }

  }
}
