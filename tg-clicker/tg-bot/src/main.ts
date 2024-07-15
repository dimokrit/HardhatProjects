import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getBotToken } from 'nestjs-telegraf';
import * as moment from 'moment';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const bot = app.get(getBotToken());

  if (process.env.APP_ENV === 'production') {
    app.use(bot.webhookCallback(process.env.BOT_PATH));
  }
  
  moment.locale('ru');
  app.enableCors();
  await app.listen(process.env.APP_PORT);
}
bootstrap();
