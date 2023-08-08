import { Inject, Injectable, Scope } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ClsService } from 'nestjs-cls';
import { Logger } from 'winston';

interface ILoggerMetadata {
	error?: Error;
	context: string;
	requestId?: string;
}

@Injectable({ scope: Scope.TRANSIENT })
export class LogService {
	private context: string;

	constructor(
		@Inject(WINSTON_MODULE_PROVIDER)
		private readonly logger: Logger,
		private readonly cls: ClsService,
	) {
		this.context = 'Application';
	}

	setContext(context: string) {
		this.context = context;
	}

	error(error: Error, msg = '') {
		this.logger.error(msg, {
			error,
			context: this.context,
			requestId: this.cls.get('requestId'),
		});
	}

	info<T>(msg: string, logData?: T) {
		const message =
			msg + (logData ? '\n' + JSON.stringify(logData, null, 2) : '');
		this.logger.info(message, {
			context: this.context,
			requestId: this.cls.get('requestId'),
		});
	}

	debug<T>(msg: string, logData?: T) {
		const message =
			msg + (logData ? '\n' + JSON.stringify(logData, null, 2) : '');
		this.logger.debug(message, {
			context: this.context,
			requestId: this.cls.get('requestId'),
		});
	}

	warn(msg: string, error?: Error) {
		const meta: ILoggerMetadata = {
			context: this.context,
			requestId: this.cls.get('requestId'),
		};
		if (error) meta.error = error;

		this.logger.warn(msg, meta);
	}
}
