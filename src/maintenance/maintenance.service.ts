import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Maintenance } from './entities/maintenance.entity';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';
import { SearchMaintenanceDto } from './dto/search-maintenance.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Equipment } from 'src/equipment/entities/equipment.entity';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class MaintenanceService {
  constructor(
    @InjectRepository(Maintenance)
    private readonly maintenanceRepository: Repository<Maintenance>,

    @InjectRepository(Equipment)
    private readonly equipmentRepository: Repository<Equipment>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(dto: CreateMaintenanceDto): Promise<Maintenance> {
    try {
      const equipment = await this.equipmentRepository.findOneBy({ id: dto.equipmentId });
      if (!equipment) {
        throw new NotFoundException(`Equipment with id ${dto.equipmentId} not found`);
      }

      const technician = await this.userRepository.findOneBy({ id: dto.technicianId });
      if (!technician) {
        throw new NotFoundException(`Technician with id ${dto.technicianId} not found`);
      }

      // ✅ Validar que el usuario tenga el rol "technical"
      if (!technician.roles.includes('technical')) {
        throw new BadRequestException(`User with id ${dto.technicianId} does not have the 'technical' role`);
      }

      const maintenance = this.maintenanceRepository.create({
        equipment,
        technician,
        description: dto.description,
      });

      return await this.maintenanceRepository.save(maintenance);
    } catch (error) {
      throw new InternalServerErrorException(`Error creating maintenance: ${error.message}`);
    }
  }

  async findAll(pagination: PaginationDto): Promise<Maintenance[]> {
    const { limit = 10, offset = 0 } = pagination;
    try {
      return await this.maintenanceRepository.find({
        take: limit,
        skip: offset,
        order: { date: 'DESC' },
        relations: ['equipment', 'technician'],
      });
    } catch (error) {
      throw new InternalServerErrorException(`Error fetching maintenances: ${error.message}`);
    }
  }

  async findOne(id: string): Promise<Maintenance> {
    const maintenance = await this.maintenanceRepository.findOne({
      where: { id },
      relations: ['equipment', 'technician'],
    });
    if (!maintenance) {
      throw new NotFoundException(`Maintenance with id ${id} not found`);
    }
    return maintenance;
  }

  async update(id: string, dto: UpdateMaintenanceDto): Promise<Maintenance> {
    const maintenance = await this.maintenanceRepository.preload({
      id,
      ...dto,
    });

    if (!maintenance) {
      throw new NotFoundException(`Maintenance with id ${id} not found`);
    }

    try {
      return await this.maintenanceRepository.save(maintenance);
    } catch (error) {
      throw new InternalServerErrorException('Error updating maintenance');
    }
  }

  async remove(id: string): Promise<void> {
    const maintenance = await this.findOne(id);
    try {
      await this.maintenanceRepository.remove(maintenance);
    } catch (error) {
      throw new InternalServerErrorException('Error deleting maintenance');
    }
  }

  async search(filters: SearchMaintenanceDto): Promise<Maintenance[]> {
    const { description, equipmentId, technicianId, limit = 10, offset = 0 } = filters;

    const query = this.maintenanceRepository.createQueryBuilder('maintenance')
      .leftJoinAndSelect('maintenance.equipment', 'equipment')
      .leftJoinAndSelect('maintenance.technician', 'technician');

    if (description) {
      query.andWhere('maintenance.description ILIKE :description', {
        description: `%${description}%`,
      });
    }

    if (equipmentId) {
      query.andWhere('equipment.id = :equipmentId', { equipmentId });
    }

    if (technicianId) {
      query.andWhere('technician.id = :technicianId', { technicianId });
    }

    query.skip(offset).take(limit).orderBy('maintenance.date', 'DESC');

    try {
      return await query.getMany();
    } catch (error) {
      throw new InternalServerErrorException('Error searching maintenances');
    }
  }
}
