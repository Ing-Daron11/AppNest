import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  createUser(createUserDto: CreateUserDto) {
      try {
        const { password, ...userData } = createUserDto;
        const user = this.userRepository.create({
          password: bcrypt.hashSync(password, 10),
          ...userData,
        });
        return this.userRepository.save(user);
      } catch (error) {
        throw new Error('Error creating user');
      }
  }
  
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id); // valida existencia
    await this.userRepository.delete(id);
  }

  async getProfile(id: string): Promise<User> {
    return this.findOne(id);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    const updatedUser = this.userRepository.merge(user, updateUserDto);
    return this.userRepository.save(updatedUser);
  }

}
