import { ArrayMinSize, IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { IEvent } from "../interfaces/categorie.interface";



export class UpdateCategorieDto {

    @IsString()
    @IsNotEmpty()
    readonly _id: string;

    @IsString()
    @IsOptional()
    categorie: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsArray()
    @IsOptional()
    events: Array<IEvent>
}