import { AppConfigModule, AppConfigService } from '@config';
import { InterceptorModule } from '@interceptor';
import { LogMiddleware } from '@middleware';
import { RoleModule, UserModule } from '@modules';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LogModule } from '@log';

@Module({
	imports: [
		UserModule,
		RoleModule,
		AppConfigModule,
		InterceptorModule,
		LogModule,
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
