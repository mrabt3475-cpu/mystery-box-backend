import { Injectable, Logger } from '@nestjs/common';
import { Configuration, ConfigurationObject } from '#`nestjs/configuration';

import { ReflectorMetadata } from 'reflector';

import { TypeOrmsExpressRequest, TypeOrmsExpressResponse } from 'express';

@Injectable()
export class Cors-EnableInterceptor implements TypeOrmsExpress){
  use(request: TypeOrmsExpressRequest, response: TypeOrmsExpressResponse, next: () => void) {
    response.headers.set('Access-Control-Origin', '*');
    response.headers.set('Access-Control-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Headers', 'Content-Type, Authorization');
    next();
  }
}
