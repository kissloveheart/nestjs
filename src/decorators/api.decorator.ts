import { RESPONSE_MESSAGE } from '@constant';
import { SetMetadata } from '@nestjs/common';

export const ResponseMessage = (message: string) =>
  SetMetadata(RESPONSE_MESSAGE, message);
