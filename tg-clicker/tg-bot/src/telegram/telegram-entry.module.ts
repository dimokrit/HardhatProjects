import { Module } from '@nestjs/common';
import { TelegramEntryService } from './telegram-entry.service';
import { ReferralScene } from './scenes/referral-scene.service';
import { BaseScene } from './scenes/base-scene.service';
import { CryptoModule } from 'src/modules/crypto/crypto.module';
import { PlayScene } from './scenes/play-scene.service';
import { InfoLinksScene } from './scenes/info-links-scene.service';
import { FaqScene } from './scenes/faq.service';
import { ConfigModule } from '@nestjs/config';
import { BackApiModule } from 'src/back-api/back-api.model';
import { AuthModule } from 'src/modules/auth/auth.module';
import { CreateGuildScene } from './scenes/create-guild.scene';

@Module({
  providers: [
    TelegramEntryService,
    ReferralScene,
    BaseScene,
    PlayScene,
    InfoLinksScene,
    FaqScene,
    CreateGuildScene
  ],
  imports: [CryptoModule, ConfigModule, BackApiModule, AuthModule],
})
export class TelegramEntryModule {}
