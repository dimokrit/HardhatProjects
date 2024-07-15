import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [AuthService, AuthGuard],
  exports: [AuthService, AuthGuard],
  imports: [ConfigModule],
})
export class AuthModule {}
