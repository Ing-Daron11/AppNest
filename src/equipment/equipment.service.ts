import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';   
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';

import { Equipment } from './entities/equipment.entity';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class EquipmentService {
    constructor(
        @InjectRepository(Equipment)
        private readonly equipmentRepository: Repository<Equipment>,
    ) {}

    async create(equipmentDto: CreateEquipmentDto): Promise<Equipment> {
        try {
            const equipment = this.equipmentRepository.create(equipmentDto);
            await this.equipmentRepository.save(equipment);
            return equipment;
        } catch (error) {
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

    async findOne(criteria: string | FindOptionsWhere<Equipment>): Promise<Equipment> {
        try {
            let findOptions: FindOptionsWhere<Equipment>;
            
            // Si es string, asumimos que es un ID
            if (typeof criteria === 'string') {
                findOptions = { id: criteria };
            } else {
                findOptions = criteria;
            }
            
            const equipment = await this.equipmentRepository.findOneBy(findOptions);
            
            if (!equipment) {
                const criteriaStr = typeof criteria === 'string' 
                    ? `id ${criteria}` 
                    : Object.entries(criteria)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join(', ');
                        
                throw new Error(`Equipment with ${criteriaStr} not found`);
            }
            
            return equipment;
        } catch (error) {
            throw new Error(`Error fetching equipment: ${error.message}`);
        }
    }

}
