import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';

import { Equipment } from './entities/equipment.entity';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { SearchEquipmentDto } from './dto/search-equipment.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { EquipmentStatus } from './enums/equipment.enum';

@Injectable()
export class EquipmentService {
    constructor(
        @InjectRepository(Equipment)
        private readonly equipmentRepository: Repository<Equipment>,
        // Si necesitamos un DataSource para transacciones:
        // private readonly dataSource: DataSource,
    ) { }

    async create(equipmentDto: CreateEquipmentDto): Promise<Equipment> {
        try {

            // verificar si ya existe el equipo
            const existingEquipment = await this.equipmentRepository.findOne({
                where: {
                    name: equipmentDto.name,
                    model: equipmentDto.model
                }
            })

            if (existingEquipment) {
                throw new ConflictException(`Equipment with name ${equipmentDto.name} already exists`);
            }

            const equipment = this.equipmentRepository.create(equipmentDto);
            await this.equipmentRepository.save(equipment);
            return equipment;
        } catch (error) {
            if (error instanceof ConflictException) {
                throw error;
            }

            throw new Error(`Error creating equipment: ${error.message}`);
        }
    }

    async findAll(pagination: PaginationDto): Promise<Equipment[]> {
        try {
            const { limit = 10, offset = 0 } = pagination;
            return await this.equipmentRepository.find({
                take: limit,
                skip: offset,
            });
        } catch (error) {
            throw new Error(`Error fetching equipment: ${error.message}`);
        }
    }

    async findOne(id: string): Promise<Equipment> {
        try {
            const equipment = await this.equipmentRepository.findOneBy({
                id,
            } as FindOptionsWhere<Equipment>);
            if (!equipment) {
                throw new NotFoundException(`Equipment with id ${id} not found`);
            }
            return equipment;
        } catch (error) {
            throw new InternalServerErrorException(`Error finding equipment: ${error.message}`);
        }
    }

    async update(id: string, dto: UpdateEquipmentDto): Promise<Equipment> {
        const equipment = await this.equipmentRepository.preload({
            id,
            ...dto,
        });
        if (!equipment) {
            throw new NotFoundException(`Equipment with id ${id} not found`);
        }
        try {
            await this.equipmentRepository.save(equipment);
            return await this.findOne(id);
        } catch (error) {
            throw new InternalServerErrorException('Error updating equipment');
        }
    }

    async remove(id: string): Promise<void> {
        const equipment = await this.findOne(id);
        try {
            await this.equipmentRepository.remove(equipment);
        } catch (error) {
            throw new InternalServerErrorException('Error deleting equipment');
        }
    }

    async search(filters: SearchEquipmentDto): Promise<Equipment[]> {
        const { name, category, status, limit = 10, offset = 0 } = filters;

        const query = this.equipmentRepository.createQueryBuilder('equipment');

        if (name) {
            query.andWhere('equipment.name ILIKE :name', { name: `%${name}%` });
        }

        if (category) {
            query.andWhere('equipment.category = :category', { category });
        }

        if (status) {
            query.andWhere('equipment.status = :status', { status });
        }

        query.skip(offset).take(limit).orderBy('equipment.addedAt', 'DESC');

        return query.getMany();
    }

    private async updateStatus(
        id: string,
        newStatus: EquipmentStatus,
    ): Promise<Equipment> {
        const equipment = await this.findOne(id);
        const currentStatus = equipment.status;

        const validTransitions: Record<EquipmentStatus, EquipmentStatus[]> = {
            [EquipmentStatus.AVAILABLE]: [EquipmentStatus.RENTED, EquipmentStatus.MAINTENANCE],
            [EquipmentStatus.RENTED]: [EquipmentStatus.AVAILABLE, EquipmentStatus.MAINTENANCE],
            [EquipmentStatus.MAINTENANCE]: [EquipmentStatus.AVAILABLE],
        };

        const allowedNextStates = validTransitions[currentStatus] || [];

        if (!allowedNextStates.includes(newStatus)) {
            throw new Error(
                `Invalid status change from '${currentStatus}' to '${newStatus}'`,
            );
        }

        equipment.status = newStatus;

        try {
            return await this.equipmentRepository.save(equipment);
        } catch (error) {
            throw new InternalServerErrorException('Error updating equipment status');
        }
    }


    async markAsRented(id: string): Promise<Equipment> {
        return this.updateStatus(id, EquipmentStatus.RENTED);
    }

    async markAsAvailable(id: string): Promise<Equipment> {
        return this.updateStatus(id, EquipmentStatus.AVAILABLE);
    }

    async markInMaintenance(id: string): Promise<Equipment> {
        return this.updateStatus(id, EquipmentStatus.MAINTENANCE);
    }
}
