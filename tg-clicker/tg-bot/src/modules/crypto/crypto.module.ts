import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CryptoService } from './crypto.service';

@Module({
  providers: [CryptoService],
  exports: [CryptoService],
  imports: [ConfigModule],
})
export class CryptoModule {}
