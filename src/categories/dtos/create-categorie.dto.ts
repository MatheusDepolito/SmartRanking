import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from "class-validator";
import { IEvent } from "../interfaces/categorie.interface";



export class CreateCategorieDto {

    @IsString()
    @IsNotEmpty()
    categorie: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsArray()
    @ArrayMinSize(1)
    events: Array<IEvent>
}