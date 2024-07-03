import { PlayersValidationParametersPipe } from './pipes/players-validation-parameters.pipe';
import { Body, Controller, Delete, Get, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { PlayersService } from './players.service';
import { IPlayer } from './interfaces/player.interface';
import { UpdatePlayerDto } from './dtos/update-player.dto';

@Controller('api/v1/players')
export class PlayersController {

    constructor(private readonly playersService: PlayersService) {}

    @Post()
    @UsePipes(ValidationPipe)
    async createPlayer(@Body() createPlayerDto: CreatePlayerDto) : Promise<IPlayer> {
        return this.playersService.createPlayer(createPlayerDto);
    }

    @Put() 
    @UsePipes(ValidationPipe)
    async updatePlayer(@Body() updatePlayerDto: UpdatePlayerDto) : Promise<IPlayer> {
        return this.playersService.updatePlayer(updatePlayerDto);
    }

    @Get('/consultAllPlayers')
    async consultAllPlayers() : Promise<IPlayer[]> {
        return this.playersService.consultAllPlayers();
    
    }

    @Get('/consultPlayerForId')
    async consultPlayerForId(@Body('_id', PlayersValidationParametersPipe) _id: string) : Promise<IPlayer> {
        return await this.playersService.consultPlayerForId(_id);
    }

    @Delete()
    async deletePlayer(@Body('_id', PlayersValidationParametersPipe) _id: string): Promise<void> {
        return this.playersService.deletePlayer(_id);

    }


}
