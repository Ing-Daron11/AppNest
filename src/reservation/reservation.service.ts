import {
    Injectable,
    NotFoundException,
    InternalServerErrorException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository, FindOptionsWhere } from 'typeorm';
  
  import { Reservation } from './entities/reservation.entity';
  import { CreateReservationDto } from './dto/create-reservation.dto';
  import { UpdateReservationDto } from './dto/update-reservation.dto';
  import { SearchReservationDto } from './dto/search-reservation.dto';
  import { PaginationDto } from 'src/common/dto/pagination.dto';
  
  @Injectable()
  export class ReservationService {
    constructor(
      @InjectRepository(Reservation)
      private readonly reservationRepository: Repository<Reservation>,
    ) {}
  
    async create(dto: CreateReservationDto): Promise<Reservation> {
      try {
        const reservation = this.reservationRepository.create(dto);
        await this.reservationRepository.save(reservation);
        return reservation;
      } catch (error) {
        throw new InternalServerErrorException('Error creating reservation');
      }
    }
  
    async findAll(pagination: PaginationDto): Promise<Reservation[]> {
      const { limit = 10, offset = 0 } = pagination;
      return this.reservationRepository.find({
        take: limit,
        skip: offset,
        order: { createdAt: 'DESC' },
      });
    }
  
    async findOne(id: string): Promise<Reservation> {
      const reservation = await this.reservationRepository.findOneBy({
        id,
      } as FindOptionsWhere<Reservation>);
  
      if (!reservation) {
        throw new NotFoundException(`Reservation with id ${id} not found`);
      }
  
      return reservation;
    }
  
    async update(id: string, dto: UpdateReservationDto): Promise<Reservation> {
      const reservation = await this.reservationRepository.preload({
        id,
        ...dto,
      });
  
      if (!reservation) {
        throw new NotFoundException(`Reservation with id ${id} not found`);
      }
  
      try {
        await this.reservationRepository.save(reservation);
        return this.findOne(id);
      } catch (error) {
        throw new InternalServerErrorException('Error updating reservation');
      }
    }
  
    async remove(id: string): Promise<void> {
      const reservation = await this.findOne(id);
      try {
        await this.reservationRepository.remove(reservation);
      } catch (error) {
        throw new InternalServerErrorException('Error deleting reservation');
      }
    }
  
    async search(filters: SearchReservationDto): Promise<Reservation[]> {
      const { userId, equipmentId, startDate, endDate, limit = 10, offset = 0 } = filters;
  
      const query = this.reservationRepository.createQueryBuilder('reservation');
  
      if (userId) {
        query.andWhere('reservation.user.id = :userId', { userId });
      }
  
      if (equipmentId) {
        query.andWhere('reservation.equipment.id = :equipmentId', { equipmentId });
      }
  
      if (startDate) {
        query.andWhere('reservation.startDate >= :startDate', { startDate });
      }
  
      if (endDate) {
        query.andWhere('reservation.endDate <= :endDate', { endDate });
      }
  
      return query
        .take(limit)
        .skip(offset)
        .orderBy('reservation.createdAt', 'DESC')
        .getMany();
    }
  }
  