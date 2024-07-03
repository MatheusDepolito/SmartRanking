import { CreatePlayerDto } from './dtos/create-player.dto';
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IPlayer } from './interfaces/player.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UpdatePlayerDto } from './dtos/update-player.dto';

@Injectable()
export class PlayersService {

    constructor(@InjectModel('Player') private readonly playerModel: Model<IPlayer>) {}

    private readonly _logger = new Logger(PlayersService.name);


    async createPlayer(createPlayerDto: CreatePlayerDto): Promise<IPlayer> {
        const { email, phoneNumber } = createPlayerDto;
        this._logger.log(`Creating player with email: ${email}`);
        
        await this.checkIfValueExists('email', email); 
            
        await this.checkIfValueExists('phoneNumber', phoneNumber);

        const playerCreated = new this.playerModel(createPlayerDto);
        return await playerCreated.save();
    }

    async updatePlayer(updatePlayerDto: UpdatePlayerDto): Promise<IPlayer> {
        const { _id, email, phoneNumber } = updatePlayerDto;
        this._logger.log(`Updating player with ID: ${_id}`);

        if (!this.isValidObjectId(_id)) {
            this._logger.warn(`Invalid player ID: ${_id}`);
            throw new BadRequestException(`Invalid player ID: ${_id}`);
        }

        const playerFound = await this.playerModel.findOne({ _id }).exec();

        if (!playerFound) {
            this._logger.warn(`Player with ID ${_id} not found`);
            throw new NotFoundException(`Player with id ${_id}, not found.`);
        }

        if (email && email !== playerFound.email) {
            await this.checkIfValueExists('email', email);
        }

        if (phoneNumber && phoneNumber !== playerFound.phoneNumber) {
            await this.checkIfValueExists('phoneNumber', phoneNumber);
        }

        return await this.playerModel.findOneAndUpdate(
            { _id }, 
            { $set: updatePlayerDto },
            { new: true } // To return the updated document
        ).exec();
    }

    async deletePlayer(_id: string): Promise<any> {
        if (this.isValidObjectId(_id)) {
            throw new BadRequestException(`Invalid player ID: ${_id}`);
        }

        const playerFound = await this.playerModel.findOne({ _id }).exec();

        if (!playerFound) {
            throw new NotFoundException(`Player with id: ${_id}, not found.`);
        }

        return await this.playerModel.deleteOne({ _id }).exec();
    }

    async consultPlayerForId(_id: string): Promise<IPlayer> {
        console.log(_id)
        if (!this.isValidObjectId(_id)) {
            throw new BadRequestException(`Invalid player ID: ${_id}`);
        }

        const playerFound = await this.playerModel.findOne({ _id }).exec();

        if (!playerFound) {
            throw new NotFoundException(`Player with id: ${_id}, not found.`);
        }

        return playerFound; 
    }

    async consultAllPlayers(): Promise<IPlayer[]> {
        this._logger.log('Consulting all players');
        return await this.playerModel.find().exec();
    }



    // Private functions
    private isValidObjectId(id: string): boolean {
        return Types.ObjectId.isValid(id);
    }

    private async checkIfValueExists(field: string, value: any): Promise<void> {
        const filter = {};
        filter[field] = value;

        const playerFound = await this.playerModel.findOne(filter).exec();
        if (playerFound) {
            this._logger.warn(`Player with ${field} ${value} already registered`);
            throw new BadRequestException(`Player with ${field} ${value}, already registered.`);
        }
    }
}
