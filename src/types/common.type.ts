import { Type, applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiProperty,
  ApiPropertyOptional,
  getSchemaPath,
} from '@nestjs/swagger';
import { Pageable } from './page.type';

export class IResponse<T> {
  @ApiProperty({
    description: 'Application code',
  })
  code: number | string;
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

export const ApiResponseArray = (model: Type) => {
  return applyDecorators(
    ApiExtraModels(IResponse, model),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(IResponse) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );
};

export const ApiResponseObject = (model: Type) => {
  return applyDecorators(
    ApiExtraModels(IResponse, model),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(IResponse) },
          {
            properties: {
              data: { $ref: getSchemaPath(model) },
            },
          },
        ],
      },
    }),
  );
};

export const ApiResponsePagination = (model: Type) => {
  return applyDecorators(
    ApiExtraModels(IResponse, Pageable, model),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(IResponse) },
          {
            properties: {
              data: {
                $ref: getSchemaPath(Pageable),
                properties: {
                  result: {
                    type: 'array',
                    items: { $ref: getSchemaPath(model) },
                  },
                },
              },
            },
          },
        ],
      },
    }),
  );
};
