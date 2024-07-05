import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { Types } from "mongoose";


export class ValidationParametersPipe implements PipeTransform {

    constructor() {}

    private isValidObjectId(id: string): boolean {
        return Types.ObjectId.isValid(id);
    }

    transform(value: any, metadata: ArgumentMetadata) {
        // Condition for specific validations
        if(!value) {
            throw new BadRequestException(`The value for the parameter '${metadata.data}', must be informed.`);
        }

        // Condition for validations _id parameter (this validation verify the id is id validity in the mongo)
        if (metadata.data === '_id' && !this.isValidObjectId(value)) {
            throw new BadRequestException(`The value for the parameter '${metadata.data}' is not a valid ObjectId.`);
        }

        return value;
    }

}

