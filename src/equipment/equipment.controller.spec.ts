import { Test, TestingModule } from '@nestjs/testing';
import { EquipmentController } from './equipment.controller';
import { EquipmentService } from './equipment.service';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { EquipmentCategory, EquipmentStatus } from './enums/equipment.enum';

describe('EquipmentController', () => {
  let controller: EquipmentController;
  let service: EquipmentService;

  const mockEquipment = {
    id: 'uuid-1',
    name: 'HP Laptop',
    model: '840 G7',
    description: 'Test description',
    category: EquipmentCategory.LAPTOP,
    status: EquipmentStatus.AVAILABLE,
  };

  const mockService = {
    create: jest.fn().mockResolvedValue(mockEquipment),
    findAll: jest.fn().mockResolvedValue([mockEquipment]),
    findOne: jest.fn().mockResolvedValue(mockEquipment),
    update: jest.fn().mockResolvedValue({ ...mockEquipment, name: 'Updated' }),
    remove: jest.fn().mockResolvedValue(undefined),
    search: jest.fn().mockResolvedValue([mockEquipment]),
    markAsAvailable: jest.fn().mockResolvedValue({ ...mockEquipment, status: EquipmentStatus.AVAILABLE }),
    markAsRented: jest.fn().mockResolvedValue({ ...mockEquipment, status: EquipmentStatus.RENTED }),
    markInMaintenance: jest.fn().mockResolvedValue({ ...mockEquipment, status: EquipmentStatus.MAINTENANCE }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EquipmentController],
      providers: [
        {
          provide: EquipmentService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<EquipmentController>(EquipmentController);
    service = module.get<EquipmentService>(EquipmentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create equipment', async () => {
    const dto: CreateEquipmentDto = {
      name: 'HP Laptop',
      model: '840 G7',
      description: 'desc',
      category: EquipmentCategory.LAPTOP,
    };

    const result = await controller.create(dto);
    expect(result).toEqual(mockEquipment);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should return all equipment', async () => {
    const result = await controller.findAll({ limit: 10, offset: 0 });
    expect(result).toEqual([mockEquipment]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should find one equipment', async () => {
    const result = await controller.findOne('uuid-1');
    expect(result).toEqual(mockEquipment);
    expect(service.findOne).toHaveBeenCalledWith('uuid-1');
  });

  it('should update equipment', async () => {
    const dto: CreateEquipmentDto = { ...mockEquipment, name: 'Updated' };
    const result = await controller.update('uuid-1', dto);
    expect(result.name).toBe('Updated');
  });

  it('should delete equipment', async () => {
    await expect(controller.remove('uuid-1')).resolves.toBeUndefined();
    expect(service.remove).toHaveBeenCalledWith('uuid-1');
  });

  it('should update status to RENTED', async () => {
    const result = await controller.updateStatus('uuid-1', { status: EquipmentStatus.RENTED });
    expect(result.status).toBe(EquipmentStatus.RENTED);
    expect(service.markAsRented).toHaveBeenCalledWith('uuid-1');
  });
});
