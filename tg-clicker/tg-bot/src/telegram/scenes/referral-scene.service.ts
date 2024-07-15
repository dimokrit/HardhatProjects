import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import { BASE_SCENE, REFERRAL_SCENE } from '../scenes.type';
import { Update } from 'telegraf/typings/core/types/typegram';
import dedent from 'ts-dedent';
import { ConfigService } from '@nestjs/config';
import db from '../../database/db'
@Scene(REFERRAL_SCENE)
export class ReferralScene {
  constructor(
    private readonly configService: ConfigService,
  ) {}

  @SceneEnter()
  async enter(
    @Ctx()
    ctx: SceneContext & { update: Update.MessageUpdate },
  ) {
    const user = (await db.query(`SELECT * FROM users WHERE user_id = ${ctx.from.id}`)).rows[0]
  
    const shareUrl = `https://t.me/${this.configService.get(
      'BOT_NAME',
    )}?start=${user.uuid}`;
    const url = `https://t.me/share/url?url=${shareUrl}&text=`;

    ctx.editMessageCaption(
      dedent`Use it to invite friends and receive bonuses!

    For one friend you invite, you get 1 additional one-time try.
    
    Your referral link: <code>https://t.me/${this.configService.get(
      'BOT_NAME',
    )}?start=${user.uuid}</code>.

    <b>To copy the referral link, click on it.</b>

    You invited: <b>${user.ref_count}</b> people

    `,
      {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'Share',
                url,
              },
            ],
            [{ text: '🔙 Back to menu', callback_data: 'back' }],
          ],
        },
      },
    );
  }

  @Action('back')
  async create(
    @Ctx() ctx: SceneContext & { update: Update.CallbackQueryUpdate },
  ) {
    await ctx.scene.enter(BASE_SCENE);
  }
}
