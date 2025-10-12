import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class SignupDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly username: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly password: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @ApiProperty({ enum: $Enums.Gender, description: 'User gender' })
    @IsEnum($Enums.Gender, { message: 'Gender must be a valid value.' })
    @IsNotEmpty()
    gender: $Enums.Gender;
}

export class LoginDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly username: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly password: string;
}
