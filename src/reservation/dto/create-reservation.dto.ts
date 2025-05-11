import { IsUUID, IsDate, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReservationDto {
  @IsUUID()
  @IsNotEmpty()
  readonly equipmentId: string;

  @IsUUID()
  @IsNotEmpty()
  readonly userId: string;

  @Type(() => Date)
  @IsDate()
  readonly startDate: Date;

  @Type(() => Date)
  @IsDate()
  readonly endDate: Date;
}
