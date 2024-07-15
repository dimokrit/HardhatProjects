import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectBot } from 'nestjs-telegraf';
import db from 'src/database/db';
import { Telegraf } from 'telegraf';
import { ConfigService } from '@nestjs/config';
import dedent from 'ts-dedent';
import { ParseMode, InlineKeyboardMarkup } from 'telegraf/typings/core/types/typegram';
import { $baseApi } from 'src/database';

@Injectable()
export class SchedulerService {

    constructor(@InjectBot() private readonly bot: Telegraf,
        private readonly configService: ConfigService) { }

    @Cron('* * * * *')
    async handleCron() {
        const foundUser = 760273960//(await db.query(`SELECT userId FROM users`)).rows
        const bannerUrl = `${this.configService.get('BACK_API_URL')}/static/banner.jpg`
        const gameText = dedent(`🟢 Never stop Clicking: Click as much as you can and watch your coins soar.

                                 📣 Invite friends and receive coins for each invitee.

                                 ✔️ Complete simple tasks and receive coins for each completed task.
                                 
                                 Let’s tap!`)
        //const versionData = await (await fetch(`${this.configService.get('GAME_URL')}/game/webgl/versions.json`)).json()
        //const version = versionData["dev_version"]
        //for (const user of foundUser) {
           // const res = await $baseApi.get(`/api/user/jwt?userId=${user}`)
            const jwt = `newJWT#${foundUser}`//res.data.jwt
            //const url = `${this.configService.get('GAME_URL')}/game/webgl/${version}/index.html?jwt=${jwt}`
            const toSendKeyboards: {
                parse_mode?: ParseMode;
                reply_markup?: InlineKeyboardMarkup;
            } = {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '🎮 Play',  url: `https://t.me/GirandCombatBot?start=start` }],
                        [{ text: `🛠️ ${jwt}`, url: `https://t.me/GirandCombatBot?start=start` }],
                        [{ text: '🔙 Back to menu', callback_data: 'back' }],
                    ],
                },
            }
            await this.bot.telegram.sendPhoto(foundUser, bannerUrl, { caption: gameText, reply_markup: toSendKeyboards.reply_markup });
       // }
    }
}