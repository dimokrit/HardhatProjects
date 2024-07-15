import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthService } from './auth.service';
import * as crypto from 'crypto';
import * as moment from 'moment';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      console.log('AuthGuard token faild');
      return false;
    }

    try {
      const decodedToken = this.authService.verifyToken(token);
      request.params = decodedToken;
      return true;
    } catch (error) {
      console.log('AuthGuard decode faild');
      return false;
    }
  }
}

@Injectable()
export class ScoreGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    if (!request.headers.hash || !request.headers.time) {
      console.log('ScoreGuard headers faild');
      return false;
    }

    if (
      moment().diff(moment.unix(Number(request.headers.time)), 'seconds') > 10
    ) {
      console.log(
        'ScoreGuard time faild',
        moment().unix(),
        moment.unix(Number(request.headers.time)).unix(),
      );
      return false;
    }

    const buff = Buffer.from(request.body ? JSON.stringify(request.body) : '');
    const base64data = request.method !== 'GET' ? buff.toString('base64') : '';

    const calculatedHash = crypto
      .createHash('md5')
      .update(`${request.headers.time}${base64data}`)
      .digest('hex');

    if (request.headers.hash !== calculatedHash) {
      console.log('ScoreGuard hash faild');
      return false;
    }

    return true;
  }
}
