import { Type, applyDecorators } from '@nestjs/common';
import {
	ApiExtraModels,
	ApiOkResponse,
	ApiProperty,
	ApiPropertyOptional,
	getSchemaPath,
} from '@nestjs/swagger';

export class Response<T> {
	@ApiProperty({
		description: 'Application code',
	})
	code: number;
	@ApiProperty({
		description: 'Can be success or error message',
	})
	message: string;
	@ApiProperty({
		description: 'Is API success',
	})
	success: boolean;
	@ApiProperty({
		description: 'Result data if exist',
	})
	data: T;
	@ApiPropertyOptional()
	path?: string;
	@ApiPropertyOptional()
	timestamp?: Date;
}

interface IDecoratorApiResponse {
	model: Type;
	description?: string;
}

export const ApiResponse = (options: IDecoratorApiResponse) => {
	return applyDecorators(
		ApiExtraModels(Response, options.model),
		ApiOkResponse({
			description: options.description || 'Successfully received model list',
			schema: {
				allOf: [
					{ $ref: getSchemaPath(Response) },
					{
						properties: {
							data: {
								type: 'array',
								items: { $ref: getSchemaPath(options.model) },
							},
						},
					},
				],
			},
		}),
	);
};
