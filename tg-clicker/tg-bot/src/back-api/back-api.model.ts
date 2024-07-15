import { HttpModule } from '@nestjs/axios';
import { BackApiService } from './back-api.service';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  providers: [BackApiService],
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        timeout: 10000,
        maxRedirects: 5,
        baseURL: configService.get<string>('BACK_API_URL', {
          infer: true,
        }),
        headers: {
          Authorization: `Bearer ${configService.get<string>('BACK_API_TOKEN', {
            infer: true,
          })}`,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [BackApiService],
})
export class BackApiModule {}
