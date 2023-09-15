import { utilities } from 'nest-winston';
import * as path from 'path';
import winston, { format, transports } from 'winston';
import 'winston-daily-rotate-file';
import { AppConfigService } from './app-config.service';

const formatLogger = format.printf((msg) => {
  const message = msg.metadata?.error?.stack ?? msg.message;
  return `${msg.metadata.timestamp} - ${msg.metadata.context}[${msg.level}] ${
    msg.metadata.requestId ? '- [' + msg.metadata.requestId + ']' : ''
  }: ${message}`;
});

export class LoggerConfig {
  private readonly options: winston.LoggerOptions;

  constructor(configService: AppConfigService) {
    this.options = {
      exitOnError: false,
    };

    if (configService.isUseLogFile()) {
      this.options = {
        ...this.options,
        transports: [
          this.transportConsole(configService),
          this.transportRotateFile(configService),
        ],
      };
    } else {
      this.options = {
        ...this.options,
        transports: this.transportConsole(configService),
      };
    }
  }

  public transports(): object {
    return this.options;
  }

  private transportConsole(configService: AppConfigService) {
    return new transports.Console({
      level: configService.consoleLogLevel(),
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.metadata({ fillExcept: ['message', 'level'] }),
        format.colorize({ all: true }),
        formatLogger,
        format.combine(format.splat()),
      ),
    });
  }

  private transportRotateFile(configService: AppConfigService) {
    return new transports.DailyRotateFile({
      filename: path.join(__dirname, '../../..', 'logs', `%DATE%.log`),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      level: configService.fileLogLevel(),
      json: false,
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.metadata({ fillExcept: ['message', 'level'] }),
        formatLogger,
      ),
    });
  }
}
