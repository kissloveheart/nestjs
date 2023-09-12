import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { __moduleName__pascalCase__Controller } from './__moduleName__.controller';
import { __moduleName__pascalCase__Service } from './__moduleName__.service';
import { __moduleName__pascalCase__ } from './entity/__moduleName__.entity';

@Module({
  imports: [TypeOrmModule.forFeature([__moduleName__pascalCase__])],
  controllers: [__moduleName__pascalCase__Controller],
  providers: [__moduleName__pascalCase__Service],
})
export class __moduleName__pascalCase__Module {}
