import { IsInt, IsString, Max, MaxLength, Min, MinLength } from "class-validator";

export class CreateCarDto {
    @IsString()
    readonly brand: string; 

    @IsString({message: "El modelo es obligario"})
    @MinLength(3)
    @MaxLength(10)
    readonly model: string;

    @IsInt({message: "año debe ser un número entero"})
    @Min(2000)
    @Max(2025)
    readonly year: number;
}