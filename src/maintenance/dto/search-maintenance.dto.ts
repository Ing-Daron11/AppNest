import { IsOptional, IsString, IsUUID, IsDate, IsIn } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class SearchMaintenanceDto {
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

  @IsOptional()
  @IsString()
  readonly sortBy?: string;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  readonly sortOrder?: 'asc' | 'desc';

  // Permite que 'search' o 'term' se transformen en 'description'
  @IsOptional()
  @Transform(({ obj }) => obj.term ?? obj.search ?? obj.description ?? undefined)
  @IsString()
  readonly description?: string;

  // Se incluye para evitar errores de validación si llega 'term'
  @IsOptional()
  @IsString()
  readonly term?: string;

  // También se permite 'search' explícitamente
  @IsOptional()
  @IsString()
  readonly search?: string;
}
