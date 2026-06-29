import { IsNotEmpty, IsString, IsUUID } from "class-validator";
import { UUID } from "typeorm/driver/mongodb/bson.typings.js";

export class CreateTicketDto {
    
    @IsString()
    @IsNotEmpty()
    placa!: string;

    @IsString()
    @IsNotEmpty()
    dni!: string;

    @IsUUID()
    @IsNotEmpty()
    idEspacio!: string; 

    @IsUUID()
    @IsNotEmpty()
    zona!: string;

    

}
