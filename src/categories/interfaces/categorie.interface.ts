import { Document } from "mongoose";
import { IPlayer } from "src/players/interfaces/player.interface";


export interface ICategorie extends Document {

    categorie: string;
    description: string;
    events: Array<Event>
    players: Array<string>
}


export interface IEvent {
    name: string;
    operation: string;
    value: number;
}