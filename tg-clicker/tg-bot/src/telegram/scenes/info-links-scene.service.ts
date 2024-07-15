import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import { INFO_LINKS_SCENE, BASE_SCENE } from '../scenes.type';
import {
  InlineKeyboardMarkup,
  ParseMode,
  Update,
} from 'telegraf/typings/core/types/typegram';
import dedent from 'ts-dedent';

@Scene(INFO_LINKS_SCENE)
export class InfoLinksScene {
  @SceneEnter()
  async enter(
    @Ctx()
    ctx: SceneContext & { update: Update.MessageUpdate },
  ) {
    const baseText = dedent`✅ FOLLOW US:
    
    📲 Telegram: https://t.me/girand_official_en
    📲 Twitter: https://twitter.com/GirandOfficial
    📲 Instagram: https://www.instagram.com/girand_official/
    📲 YouTube: https://www.youtube.com/@GirandOfficial
    📲 Reddit: https://www.reddit.com/r/GirandInTheLostCity/
    📲 Discord: https://discord.gg/rbcbBH7ZR3
    
    ✅ OFFICIAL WEBSITES AND RESOURCES:
    
    💻 Official website: https://inlostcity.com/
    📄 Whitepaper: https://gitbook.inlostcity.com/`;
    

    const baseMarkup: {
      parse_mode?: ParseMode;
      reply_markup?: InlineKeyboardMarkup;
    } = {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [[{ text: '🔙 Back to menu', callback_data: 'back' }]],
      },
    };

    await ctx.editMessageCaption(baseText, baseMarkup);
  }

  @Action('back')
  async create(@Ctx() ctx: SceneContext & { update: Update.MessageUpdate }) {
    await ctx.scene.enter(BASE_SCENE);
  }
}
