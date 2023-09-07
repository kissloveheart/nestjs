import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { __moduleName__Controller } from './__moduleName__.controller';
import { __moduleName__Service } from './__moduleName__.service';
import { __moduleName__ } from './entity/__moduleName__.entity';

@Module({
  imports: [TypeOrmModule.forFeature([__moduleName__])],
  controllers: [__moduleName__Controller],
  providers: [__moduleName__Service],
})
export class __moduleName__Module {}
