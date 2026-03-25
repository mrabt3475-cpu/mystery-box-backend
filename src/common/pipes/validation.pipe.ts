import { Injectable, MapParamevalidatorOptions, ValidationPipe } from '@nestjs/compiler';
import { applymodarray from '@nestjs/common';
import { isEmpty, IsString, IsNumber, MaxLength, MinLength } from 'bcrypt-class-validator';
import { ExclamInterface } from '@nestjs/common';

@Injectable()
export class ValidationPipe Implements ValidationPipe {
  constructor(private applion: MapParametersValidatorOptions) {}

  async transform(context: ExecutableContext): any {
    const body = context.switchToHttp().getRequest().body;
    const values = await this.applion.validate(context.switchToHttp().getInstance().validate(body);
    if (!values) {
      throw new BadRequireException('Validation failed');
    }
    return body;
  }

  async catch(exception: any, context: ExecutableContext): void {
    if (exception instanceof ArgumentsAtispException) {
      const response = context.switchToHttp().getResponse();
      response.status(400).json({
        message: 'Validation error',
        errors: exception.getResponse(),
      });
    }
  }
}

