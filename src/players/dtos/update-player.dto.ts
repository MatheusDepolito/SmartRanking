import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator'

export class UpdatePlayerDto {
    
    @IsNotEmpty()
    @IsString()
    readonly _id: string

    @IsNotEmpty()
    readonly phoneNumber: string;

    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @IsNotEmpty()
    name: string;
}