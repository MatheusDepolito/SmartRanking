import { AssignPlayersToCategorieDto } from './dtos/assign-players-to-categorie.dto';
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateCategorieDto } from './dtos/create-categorie.dto';
import { ICategorie } from './interfaces/categorie.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UpdateCategorieDto } from './dtos/update-categorie.dto';
import { PlayersService } from 'src/players/players.service';

@Injectable()
export class CategoriesService {


    constructor(@InjectModel('Categorie') private readonly categorieModel: Model<ICategorie>, 
    private readonly playersService: PlayersService) {}

    private readonly _logger = new Logger(CategoriesService.name);

    async assignPlayersToCategorie(assignPlayersToCategorieDto: AssignPlayersToCategorieDto) : Promise<void> {
        const { _id, assignPlayers } = assignPlayersToCategorieDto;
        this._logger.log(`Assign player to categorie.`);
        const playersAssigned: Array<String> = [];

        // Verify ID of categorie
        if (!this.isValidObjectId(_id)) {
            this._logger.warn(`Invalid categorie ID: ${_id}`);
            throw new BadRequestException(`Invalid categorie ID: ${_id}`);
        }

        // Verify each player ID and if the player exists
        for (const player of assignPlayers) {
            console.log("uepora", player._id)
            if (!this.isValidObjectId(player._id)) {
                this._logger.warn(`Invalid player ID: ${player._id}`);
                throw new BadRequestException(`Invalid player ID: ${player._id}`);
            }

            await this.playersService.consultPlayerForId(player._id);
 
            const playerItsRegistredInCategorie = await this.categorieModel.find({_id}).where('players').in([player._id]).exec();

            if(playerItsRegistredInCategorie.length > 0) {
                playersAssigned.push(player._id);
            }
        }

        if(playersAssigned.length > 0) {
            throw new BadRequestException(`Player with id: ${playersAssigned}, is registred in the categorie.`);
        }

        const categorieFound = await this.categorieModel.findOne({ _id }).exec();

        if(!categorieFound) {
            throw new NotFoundException(`Categorie ${_id}, not found.`)
        }

        assignPlayers.forEach(player => {
            categorieFound.players.push(player._id);
        });

        await this.categorieModel.findOneAndUpdate({ _id }, { $set: categorieFound }).exec();
    }

    
    async createCategorie(createCategorieDto: CreateCategorieDto) : Promise<ICategorie> {
        const { categorie } = createCategorieDto;

        await this.checkIfValueExists('categorie', categorie);

        const categoriaCreated = new this.categorieModel(createCategorieDto);

        return await categoriaCreated.save();
    }

    async updateCategorie(updateCategorieDto: UpdateCategorieDto) : Promise<void> {
        const { _id, categorie } = updateCategorieDto;
        this._logger.log(`Updating categorie with ID: ${_id}`);

        if (!this.isValidObjectId(_id)) {
            this._logger.warn(`Invalid categorie ID: ${_id}`);
            throw new BadRequestException(`Invalid categorie ID: ${_id}`);
        }

        const categorieFound = await this.categorieModel.findOne({ _id }).exec();

        if(!categorieFound) {
            throw new NotFoundException(`Categorie ${_id}, not found`);
        }

        if(categorie && categorie !== categorieFound.categorie) {
            await this.checkIfValueExists('categorie', categorie);
        }
        
        await this.categorieModel.findOneAndUpdate(
        {_id},
        {$set: updateCategorieDto},
        { new: true } // To return the updated document
        ).exec()
    }

    async consultAllCategories(): Promise<ICategorie[]> {
        this._logger.log('Consulting all players');
        return await this.categorieModel.find().populate("players").exec();
    }

    async consultCategorieForId(_id: string) : Promise<ICategorie> {
        if (!this.isValidObjectId(_id)) {
            throw new BadRequestException(`Invalid categorie ID: ${_id}`);
        }

        const categorieFound = await this.categorieModel.findOne({ _id }).populate("players").exec();

        if(!categorieFound) {
            throw new NotFoundException(`Categorie with id: ${_id}, not found`);
        }

        return categorieFound;
    }

    async deleteCategorie(_id: string) : Promise<any> {
        if (!this.isValidObjectId(_id)) {
            throw new BadRequestException(`Invalid categorie ID: ${_id}`);
        }

        const categorieFound = await this.categorieModel.findOne({ _id }).exec();

        if(!categorieFound) {
            throw new NotFoundException(`Categorie with id: ${_id}, not found`);
        }
        return await this.categorieModel.deleteOne({ _id }).exec();
    }

    // Private Functions
    private isValidObjectId(id: string): boolean {
        return Types.ObjectId.isValid(id);
    }

    private async checkIfValueExists(field: string, value: any): Promise<void> {
        const filter = {};
        filter[field] = value;

        const playerFound = await this.categorieModel.findOne(filter).exec();
        if (playerFound) {
            this._logger.warn(`Categorie with ${field} ${value} already registered`);
            throw new BadRequestException(`Categorie with ${field} ${value}, already registered.`);
        }
    }

}
