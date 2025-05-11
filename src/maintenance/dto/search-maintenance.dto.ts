import { IsOptional, IsString, IsUUID, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchMaintenanceDto {
  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsOptional()
  @IsUUID()
  readonly equipmentId?: string;

  @IsOptional()
  @IsUUID()
  readonly technicianId?: string;

  @IsOptional()
  @IsString()
  readonly equipmentName?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  readonly startDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  readonly endDate?: Date;

  @IsOptional()
  @Type(() => Number)
  readonly limit?: number;

  @IsOptional()
  @Type(() => Number)
  readonly offset?: number;
}
