import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { __moduleName__CamelCase__Entity } from './dto/__moduleName__.entity';
import { __moduleName__CamelCase__Controller } from './__moduleName__.controller';
import { __moduleName__CamelCase__Service } from './__moduleName__.service';

@Module({
	imports: [TypeOrmModule.forFeature([__moduleName__CamelCase__Entity])],
	controllers: [__moduleName__CamelCase__Controller],
	providers: [__moduleName__CamelCase__Service],
	exports: [__moduleName__CamelCase__Service],
})
export class UserModule {}
