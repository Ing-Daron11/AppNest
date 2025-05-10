import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async onApplicationBootstrap() {
    // Verificar si ya existen usuarios en la base de datos
    const userCount = await this.userRepository.count();
    if (userCount > 0) {
      console.log('Usuarios ya existentes, no se ejecuta el seeder.');
      return;
    }

    // Crear un usuario inicial con roles
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = this.userRepository.create({
      name: 'Admin',
      email: 'admin@gmail.com',
      password: hashedPassword,
      roles: ['admin'],
    });

    await this.userRepository.save(adminUser);
    console.log('Usuario administrador creado.');
  }
}