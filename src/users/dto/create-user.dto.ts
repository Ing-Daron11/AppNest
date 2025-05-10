import { IsString, MaxLength, MinLength } from 'class-validator';
import { IsArray, ArrayMinSize, ArrayMaxSize } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'El nombre es obligario' })
  @MinLength(3)
  @MaxLength(20)
  readonly name: string;

  @IsString({ message: 'El email es obligario' })
  @MinLength(3)
  @MaxLength(20)
  readonly email: string;

  @IsString({ message: 'La contraseña es obligaria' })
  @MinLength(6)
  @MaxLength(20)
  readonly password: string;

  @IsArray({ message: 'Los roles deben ser un array' })
  @ArrayMinSize(1, { message: 'Debe haber al menos un rol' })
  @ArrayMaxSize(5, { message: 'No puede haber más de 5 roles' })
  @IsString({ each: true, message: 'Cada rol debe ser un string' })
  readonly roles: string[];
}
