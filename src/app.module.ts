import { AppConfigModule, AppConfigService } from '@config';
import { InterceptorModule } from '@interceptor';
import { LogMiddleware } from '@middleware';
import { UserModule } from '@modules/user';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LogModule } from '@log';
import { AuthModule } from '@modules/auth';
import { FilterModule } from '@filter';
import { RoleModule } from '@modules/role';

@Module({
	imports: [
		UserModule,
		RoleModule,
		AppConfigModule,
		InterceptorModule,
		LogModule,
		AuthModule,
		FilterModule,
	],
	providers: [],
})
export class AppModule implements NestModule {
	constructor(private readonly configService: AppConfigService) {}

	configure(consumer: MiddlewareConsumer): void {
		!this.configService.isProduction() &&
			consumer.apply(LogMiddleware).forRoutes('*');
	}
}
