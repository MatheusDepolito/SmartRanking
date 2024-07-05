import { ArrayMaxSize, ArrayMinSize, IsArray, IsDateString, IsNotEmpty } from "class-validator";
import { IPlayer } from "src/players/interfaces/player.interface";



export class CreateChallegeDto {

    @IsNotEmpty()
    @IsDateString()
    dateHourChallenge: Date;

    @IsNotEmpty()
    requester: string;

    @IsArray()
    @ArrayMinSize(2)
    @ArrayMaxSize(2)
    players: Array<IPlayer>
}