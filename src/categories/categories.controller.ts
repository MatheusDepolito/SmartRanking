import { Body, Controller, Get, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateCategorieDto } from './dtos/create-categorie.dto';
import { ICategorie } from './interfaces/categorie.interface';
import { CategoriesService } from './categories.service';
import { ValidationParametersPipe } from '../common/pipes/validation-parameters.pipe';
import { UpdateCategorieDto } from './dtos/update-categorie.dto';
import { AssignPlayersToCategorieDto } from './dtos/assign-players-to-categorie.dto';


@Controller('api/v1/categories')
export class CategoriesController {


    constructor(private readonly categoriesService: CategoriesService) {}


    @Post('/assign/player')
    @UsePipes(ValidationPipe)
    async assingPlayerToCategorie(@Body() assignPlayersToCategorieDto: AssignPlayersToCategorieDto) : Promise<void> {
        return await this.categoriesService.assignPlayersToCategorie(assignPlayersToCategorieDto);
    }

    @Post()
    @UsePipes(ValidationPipe)
    async createCategorie(@Body() createCategorieDto: CreateCategorieDto) : Promise<ICategorie> {

        return await this.categoriesService.createCategorie(createCategorieDto);
    }

    @Put()
    @UsePipes(ValidationPipe)
    async updateCategorie(@Body() updateCategorieDto: UpdateCategorieDto) : Promise<void> {
        return await this.categoriesService.updateCategorie(updateCategorieDto);
    }

    @Get('/consultAllCategories')
    async consultAllCategories(): Promise<ICategorie[]> {
        return await this.categoriesService.consultAllCategories();
    }

    @Get('/consultCategorieForId')
    async consultCategorieForId(@Body('_id', ValidationParametersPipe) _id: string) : Promise<ICategorie> {
        return await this.categoriesService.consultCategorieForId(_id)
    }

}
