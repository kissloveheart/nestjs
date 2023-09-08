import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { enumTransform } from '@transform';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';

export enum OrderDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export class Pageable<T> {
  @IsArray()
  @ApiProperty({ isArray: true })
  readonly result: T[];

  @ApiProperty()
  readonly page: number;

  @ApiProperty()
  readonly size: number;

  @ApiProperty()
  readonly itemCount: number;

  @ApiProperty()
  readonly pageCount: number;

  @ApiProperty()
  readonly hasPreviousPage: boolean;

  @ApiProperty()
  readonly hasNextPage: boolean;

  constructor(
    data: T[],
    { size, page, count }: { size: number; page: number; count: number },
  ) {
    this.result = data;
    this.page = page;
    this.size = size;
    this.itemCount = count;
    this.pageCount = Math.ceil(this.itemCount / this.size);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
}

export class PageRequest {
  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: 50,
    default: 10,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  @Type(() => Number)
  size?: number = 10;

  @ApiPropertyOptional({
    enum: OrderDirection,
    default: OrderDirection.DESC,
    required: false,
  })
  @IsEnum(OrderDirection)
  @IsOptional()
  @Transform(({ value }) => enumTransform(value, OrderDirection))
  order?: OrderDirection = OrderDirection.DESC;

  @ApiPropertyOptional({
    required: false,
    default: 'createdTime',
  })
  @IsOptional()
  orderBy?: string = 'createdTime';

  @ApiPropertyOptional({
    required: false,
  })
  @IsOptional()
  search?: string;

  get skip(): number {
    return (this.page - 1) * this.size;
  }
}
