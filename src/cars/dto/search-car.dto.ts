import { IsNumberString, IsOptional } from "class-validator";

export class SearchCarDto {
    @IsOptional()
    @IsNumberString()
    readonly offset?: number; 

    @IsOptional()
    @IsNumberString()
    readonly limit?: number;
}