import { Type, applyDecorators } from '@nestjs/common';
import {
	ApiExtraModels,
	ApiOkResponse,
	ApiProperty,
	getSchemaPath,
} from '@nestjs/swagger';

export class Response<T> {
	@ApiProperty()
	code: number;
	@ApiProperty()
	message: string;
	data: T;
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
