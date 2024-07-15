import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './config';
import { TelegramEntryModule } from './telegram/telegram-entry.module';
import { session } from 'telegraf';
import { CryptoModule } from './modules/crypto/crypto.module';
import { BackApiModule } from './back-api/back-api.model';
import { AuthModule } from './modules/auth/auth.module';
import { SchedulerModule } from './modules/scheduler/scheduler.module'

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        token: configService.get<string>('TELEGRAM_BOT_TOKEN'),
        ...(configService.get<string>('APP_ENV') === 'production'
          ? {
              // launchOptions: {
              //   webhook: {
              //     domain: configService.get<string>('APP_URL', { infer: true }),
              //     hookPath: configService.get<string>('BOT_PATH', {
              //       infer: true,
              //     }),
              //   },
              // },
            }
          : {}),
        middlewares: [
           session(),
        ],
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      validationSchema: config,
      validationOptions: {
        abortEarly: true,
      },
    }),
    TelegramEntryModule,
    CryptoModule,
    BackApiModule,
    AuthModule,
    SchedulerModule
  ],
})
export class AppModule {}
