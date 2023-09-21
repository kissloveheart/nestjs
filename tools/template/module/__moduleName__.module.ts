import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { __moduleName__PascalCase__Controller } from './__moduleName__.controller';
import { __moduleName__PascalCase__Service } from './__moduleName__.service';
import { __moduleName__PascalCase__ } from './entity/__moduleName__.entity';

@Module({
  imports: [TypeOrmModule.forFeature([__moduleName__PascalCase__])],
  controllers: [__moduleName__PascalCase__Controller],
  providers: [__moduleName__PascalCase__Service],
})
export class __moduleName__PascalCase__Module {}
