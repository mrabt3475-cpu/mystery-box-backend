import { SetMetadata } from '@nestjs/common';

export const RateLimit = (options: { limit: number; windowMs: number }) =>
  SetMetadata('rateLimit', options);
