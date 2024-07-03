import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";


export class PlayersValidationParametersPipe implements PipeTransform {

    constructor() {}

    transform(value: any, metadata: ArgumentMetadata) {
        if(!value) {
            throw new BadRequestException(`The value for the parameter '${metadata.data}', must be informed.`);
        }

        return value;
    }

}