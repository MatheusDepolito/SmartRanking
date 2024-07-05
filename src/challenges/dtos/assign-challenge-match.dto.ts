import { IsNotEmpty } from "class-validator";
import { IPlayer } from "src/players/interfaces/player.interface";
import { IResult } from "../interfaces/challenge.interface";




export class AssignChallengeMatchDto {
    @IsNotEmpty()
    def: IPlayer;

    @IsNotEmpty()
    result: Array<IResult>;
}