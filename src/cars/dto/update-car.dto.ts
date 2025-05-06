import { IsInt, IsOptional, IsString, Max, MaxLength, Min, MinLength } from "class-validator";

export class UpdateCarDto {
    @IsOptional()
    @IsString()
    readonly brand?: string; 

    @IsOptional()
    @IsString({message: "El modelo es obligario"})
    @MinLength(3)
    @MaxLength(10)
    readonly model?: string;

    @IsOptional()
    @IsInt({message: "año debe ser un número entero"})
    @Min(2000)
    @Max(2025)
    readonly year?: number;
}