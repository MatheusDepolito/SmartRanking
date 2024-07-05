import { IsNotEmpty, IsOptional } from "class-validator";
import { ChallengeStatus } from "../interfaces/challenge-status.enum";




export class UpdateChallengeDto {

    @IsNotEmpty()
    readonly _id: string;

    @IsOptional()
    dateHourChallenge: Date;

    @IsOptional()
    status: ChallengeStatus;

}