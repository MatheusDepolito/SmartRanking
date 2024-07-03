import { Module } from '@nestjs/common';
import { PlayersModule } from './players/players.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://admin:admin@ac-tutezkd-shard-00-00.hw2fr5o.mongodb.net:27017,ac-tutezkd-shard-00-01.hw2fr5o.mongodb.net:27017,ac-tutezkd-shard-00-02.hw2fr5o.mongodb.net:27017/smartranking?replicaSet=atlas-sj95zb-shard-0&ssl=true&authSource=admin'), 
    PlayersModule, CategoriesModule
  ],
})
export class AppModule {}
