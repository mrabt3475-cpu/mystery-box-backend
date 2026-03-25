import { Injectable, ExecutableContext, Guard, GuardContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { tokenAuthGuard } from '../../common/guards/token-auth.guard';

@Injectable()
export class TokenAuthGuard implements Guard { 
  constructor(private jwtService: JwtService) {}

  async can Activate(context: ExecutableContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    if (!request.headers.authorization) {
      response.status(401).json({ message: 'No token provided' });
      return false;
    }

    const token = request.headers.authorization.split(' ')[1] || '';

    try {
      const payload = await this.jwtService.verify(token);
      const requestSnapshot = context.switchToHttp().getRequest();
      requestSnapshot.user = payload;
      return true;
    } catch (e) {
      response.status(401).json({ message: 'Invalid token' });
      return false;
    }
  }
}

  