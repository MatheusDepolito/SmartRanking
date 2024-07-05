import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateChallegeDto } from './dtos/create-challenge.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IChallenge } from './interfaces/challenge.interface';
import { PlayersService } from 'src/players/players.service';
import { CategoriesService } from 'src/categories/categories.service';
import { ChallengeStatus } from './interfaces/challenge-status.enum';
import { create } from 'domain';

@Injectable()
export class ChallengesService {

    constructor(@InjectModel('Challenge') private readonly challengeModel: Model<IChallenge>,
    private readonly playersService: PlayersService,
    private readonly categoriesService: CategoriesService) {}
    

    async createChallenge(createChallengeDto: CreateChallegeDto) : Promise<IChallenge> {

        // Verify is this players informed are registred
        const players = await this.playersService.consultAllPlayers();

        createChallengeDto.players.map(playerDto => {
            const playerFilter = players.filter( player => player._id == playerDto._id );

            if(playerFilter.length == 0) {
                throw new BadRequestException(`O id ${playerDto._id}, is not a player.`);
            }
        })
 
        // Verify is this requester is a player for the match

        const requesterIsPlayerMatch = createChallengeDto.players.filter(player => player._id == createChallengeDto.requester);

        if(requesterIsPlayerMatch.length === 0) {
            throw new BadRequestException(`The requester he must a player in this match.`)
        }

        const categoriePlayer = await this.categoriesService.consultCategoriaForPlayer(createChallengeDto.requester)
        
        if(!categoriePlayer) {
            throw new BadRequestException(`The requester needs to register in one categorie.`)
        }

        const challengeCreated = new this.challengeModel(createChallengeDto);
        challengeCreated.categorie = categoriePlayer.categorie;
        challengeCreated.dateHourRequest = new Date();
        challengeCreated.status = ChallengeStatus.PENDING;

        return await challengeCreated.save();
    }

    async consultAllChallenges(): Promise<Array<IChallenge>> {
        return await this.challengeModel.find()
        .populate("requester")
        .populate("players")
        .populate("match")
        .exec();
    }

    async consultChallengeForId(_id: string) : Promise<IChallenge> {
        
        const challengeFound = await this.challengeModel.findOne({ _id })
        .populate("requester")
        .populate("players")
        .populate("match")
        .exec();

        if(!challengeFound) {
            throw new NotFoundException(`Challenge with id: ${_id}, not found`);
        }

        return challengeFound;
    }

    async consultChallengeForIdPlayer(_id: string): Promise<Array<IChallenge>> {
        const players = await this.playersService.consultAllPlayers();

        const playerFilter = players.filter( player => player._id == _id );

        if( playerFilter.length == 0 ) {
            throw new BadRequestException(`The id ${_id}, is not a player.`);
        }

        return await this.challengeModel.find()
        .where("players")
        .in([_id])
        .populate("requester")
        .populate("players")
        .populate("match")
        .exec()
    }

}
