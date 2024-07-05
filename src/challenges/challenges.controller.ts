import { Body, Controller, Get, Logger, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { CreateChallegeDto } from './dtos/create-challenge.dto';
import { IChallenge } from './interfaces/challenge.interface';
import { ValidationParametersPipe } from 'src/common/pipes/validation-parameters.pipe';

@Controller('api/v1/challenges')
export class ChallengesController {

    constructor(private readonly challengesService: ChallengesService ) {}

    private readonly _logger = new Logger(ChallengesController.name);

    @Post()
    @UsePipes(ValidationPipe)
    async createChallenge(@Body() createChallengeDto: CreateChallegeDto) : Promise<IChallenge> {
        return this.challengesService.createChallenge(createChallengeDto);
    }

    @Get("/consultAllChallenges")
    async consultAllChallenges(): Promise<Array<IChallenge>> {
        return this.challengesService.consultAllChallenges();
    }

    @Get("/consultChallengeForId")
    async consultChallengeForId(@Body('_id', ValidationParametersPipe) _id: string): Promise<IChallenge> {
        return await this.challengesService.consultChallengeForId(_id)
    }

    @Get("/consultChallengeForPlayer")
    async consultChallengeForIdPlayer(@Body('_id', ValidationParametersPipe) _id: string): Promise<Array<IChallenge>> {
        return await this.challengesService.consultChallengeForIdPlayer(_id);
    }
    
}
