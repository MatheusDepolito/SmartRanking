import { IsArray, IsNotEmpty, IsString } from 'class-validator';

class AssignPlayerDto {
    @IsString()
    @IsNotEmpty()
    _id: string;
}

export class AssignPlayersToCategorieDto {
    @IsString()
    @IsNotEmpty()
    _id: string;

    @IsArray()
    assignPlayers: AssignPlayerDto[];
}
