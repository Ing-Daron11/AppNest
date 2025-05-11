import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository, FindOptionsWhere } from 'typeorm';
  
  import { Maintenance } from './entities/maintenance.entity';
  import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
  import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';
  import { SearchMaintenanceDto } from './dto/search-maintenance.dto';
  import { PaginationDto } from 'src/common/dto/pagination.dto';
  
  @Injectable()
  export class MaintenanceService {
    constructor(
      @InjectRepository(Maintenance)
      private readonly maintenanceRepository: Repository<Maintenance>,
    ) {}
  
    async create(dto: CreateMaintenanceDto): Promise<Maintenance> {
      try {
        const maintenance = this.maintenanceRepository.create(dto);
        await this.maintenanceRepository.save(maintenance);
        return maintenance;
      } catch (error) {
        throw new InternalServerErrorException(
          `Error creating maintenance: ${error.message}`,
        );
      }
    }
  
    async findAll(pagination: PaginationDto): Promise<Maintenance[]> {
      const { limit = 10, offset = 0 } = pagination;
      try {
        return await this.maintenanceRepository.find({
          take: limit,
          skip: offset,
          order: { date: 'DESC' },
        });
      } catch (error) {
        throw new InternalServerErrorException(
          `Error fetching maintenances: ${error.message}`,
        );
      }
    }
  
    async findOne(id: string): Promise<Maintenance> {
      const maintenance = await this.maintenanceRepository.findOneBy({
        id,
      } as FindOptionsWhere<Maintenance>);
      if (!maintenance) {
        throw new NotFoundException(`Maintenance with id ${id} not found`);
      }
      return maintenance;
    }
  
    async update(
      id: string,
      dto: UpdateMaintenanceDto,
    ): Promise<Maintenance> {
      const maintenance = await this.maintenanceRepository.preload({
        id,
        ...dto,
      });
      if (!maintenance) {
        throw new NotFoundException(`Maintenance with id ${id} not found`);
      }
      try {
        await this.maintenanceRepository.save(maintenance);
        return await this.findOne(id);
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
      const { description, equipmentId, technicianId, limit = 10, offset = 0 } =
        filters;
  
      const query = this.maintenanceRepository.createQueryBuilder('maintenance');
  
      if (description) {
        query.andWhere('maintenance.description ILIKE :description', {
          description: `%${description}%`,
        });
      }
  
      if (equipmentId) {
        query.andWhere('maintenance.equipmentId = :equipmentId', { equipmentId });
      }
  
      if (technicianId) {
        query.andWhere('maintenance.technicianId = :technicianId', { technicianId });
      }
  
      query.skip(offset).take(limit).orderBy('maintenance.createdAt', 'DESC');
  
      try {
        return await query.getMany();
      } catch (error) {
        throw new InternalServerErrorException('Error searching maintenances');
      }
    }
  }
  