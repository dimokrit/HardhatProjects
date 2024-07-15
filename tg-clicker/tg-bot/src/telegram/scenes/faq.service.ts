import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import { BASE_SCENE, CONNECT_WALLET_SCENE, FAQ_SCENE } from '../scenes.type';
import {
  InlineKeyboardMarkup,
  ParseMode,
  Update,
} from 'telegraf/typings/core/types/typegram';
import dedent from 'ts-dedent';

@Scene(FAQ_SCENE)
export class FaqScene {
  @SceneEnter()
  async enter(
    @Ctx()
    ctx: SceneContext & { update: Update.MessageUpdate },
  ) {
    const baseText = dedent`Girand Combat. AirDrop – Season 2.
    Welcome to our Kingdom's AirDrop! 
    
    ✅Play a mini game and get coins.

    ✅Invite friends and receive coins for each invitee.
    
    ✅Complete simple tasks and receive coins for each completed task.
    At the end of the season, each active user will receive their reward.
    
    ✅To start playing the mini-game, you need to be subscribed to our Telegram channel.    
    `;

    const baseMarkup: {
      parse_mode?: ParseMode;
      reply_markup?: InlineKeyboardMarkup;
    } = {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '✅ Subscribe to the channel',
              url: 'https://t.me/girand_official_en',
            },
          ],
          [{ text: '🔙 Back to menu', callback_data: 'back' }],
        ],
      },
    };

    await ctx.editMessageCaption(baseText, baseMarkup);
  }

  @Action('back')
  async create(@Ctx() ctx: SceneContext & { update: Update.MessageUpdate }) {
    await ctx.scene.enter(BASE_SCENE);
  }
}
