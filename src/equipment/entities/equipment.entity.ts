import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EquipmentCategory, EquipmentStatus } from '../enums/equipment.enum';

@Entity()
export class Equipment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', { unique: true })
    name: string;

    @Column('text')
    model: string;

    @Column('text')
    description: string;

    @Column('enum', { enum: EquipmentCategory })
    category: EquipmentCategory;

    @Column('enum', { enum: EquipmentStatus, default: EquipmentStatus.AVAILABLE })
    status: EquipmentStatus;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}
