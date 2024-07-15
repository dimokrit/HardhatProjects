import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  scryptSync,
  createCipheriv,
  createDecipheriv,
  Cipher,
  createHash,
  Decipher,
  BinaryLike,
} from 'node:crypto';
import 'reflect-metadata';

@Injectable()
export class CryptoService {
  private key: Buffer;
  private iv: Buffer;

  constructor(private readonly configService: ConfigService) {
    this.key = scryptSync(
      this.configService.get('PASSWORD'),
      this.configService.get('SALT'),
      24,
    );
    this.iv = Buffer.from('090e3ddfb6c6e813088f134f17cc927f', 'hex');
  }

  private createCipher(): Cipher {
    return createCipheriv(
      this.configService.get('ALGORITHM'),
      this.key,
      this.iv,
    );
  }

  private createDecipher(): Decipher {
    return createDecipheriv(
      this.configService.get('ALGORITHM'),
      this.key,
      this.iv,
    );
  }

  encrypt(ctx: string): string {
    const cipher = this.createCipher();
    let encrypted = cipher.update(ctx);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString('hex');
  }

  decrypt(ctx: string): string {
    const decipher = this.createDecipher();
    let decrypted = decipher.update(Buffer.from(ctx, 'hex'));
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }
}
