import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private readonly configService: ConfigService) {}

  generateToken(payload: string | object | Buffer): string {
    return jwt.sign(payload, this.configService.get<string>('PASSWORD'));
  }

  verifyToken(token: string) {
    try {
      return jwt.verify(token, this.configService.get<string>('PASSWORD'));
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}
