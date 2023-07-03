import { Inject, Injectable, Scope } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService {
	private context: string;

	constructor(@Inject(WINSTON_MODULE_PROVIDER) private logger: Logger) {
		this.context = 'Application';
	}

	setContext(context: string) {
		this.context = context;
	}

	error(message: string, error?: Error) {
		this.logger.error(message, { error, context: this.context });
	}

	info<T>(msg: string, logData?: T) {
		const message =
			msg + (logData ? '\n' + JSON.stringify(logData, null, 2) : '');
		this.logger.info(message, { context: this.context });
	}

	debug<T>(msg: string, logData?: T) {
		const message =
			msg + (logData ? '\n' + JSON.stringify(logData, null, 2) : '');
		this.logger.debug(message, { context: this.context });
	}
}
