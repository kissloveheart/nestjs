import { Global, Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { AppConfigModule, AppConfigService } from '@config';
import { LoggerConfig } from '@config';
import { LogService } from './log.service';

@Global()
@Module({
	imports: [
		WinstonModule.forRootAsync({
			imports: [AppConfigModule],
			useFactory: (configService: AppConfigService) => {
				return new LoggerConfig(configService).transports();
			},
			inject: [AppConfigService],
		}),
	],
	providers: [LogService],
	exports: [LogService],
})
export class LogModule {}
