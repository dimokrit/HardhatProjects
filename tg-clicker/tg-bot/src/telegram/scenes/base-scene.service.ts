import { Injectable } from '@nestjs/common';
import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { PLAY_SCENE, BASE_SCENE, REFERRAL_SCENE, FAQ_SCENE, INFO_LINKS_SCENE } from 'src/telegram/scenes.type';
import { InlineKeyboardMarkup, ParseMode, Update } from 'telegraf/typings/core/types/typegram';
import { SceneContext } from 'telegraf/typings/scenes';
import dedent from 'ts-dedent';
import { ConfigService } from '@nestjs/config';

@Scene(BASE_SCENE)
@Injectable()
export class BaseScene {
  constructor(
    private readonly configService: ConfigService,
  ) { }
  @SceneEnter()
  async sceneEnter(
    @Ctx()
    ctx: SceneContext<{
      state: {
        isNew?: boolean;
      };
    }> & {
      update: Update.CallbackQueryUpdate;
    },
  ) {
    const baseText = dedent`Girand: In the lost city.
Team up with friends, fight monsters and earn coins.
Let's tap!`;

    const baseMarkup: {
      parse_mode?: ParseMode;
      reply_markup?: InlineKeyboardMarkup;
    } = {
      parse_mode: 'HTML',
      
      reply_markup: {
        inline_keyboard: [
          [{ text: '🎮 Tap & Earn.', callback_data: 'play' }],
          [{ text: '📢 Invite friends', callback_data: 'referral' }],
          [{ text: '❓ FAQ', callback_data: 'faq' }],
          [{ text: '🌐 Join Community', callback_data: 'info-links' }],
        ],
      },
    };
    const bannerUrl = `${this.configService.get('BACK_API_URL')}/static/banner.jpg`
    try {
      await ctx.editMessageCaption(baseText, baseMarkup);
    } catch (e) {
      if (ctx.update.callback_query?.message) {
        try {
          await ctx.deleteMessage(ctx.update.callback_query.message.message_id);
        } catch (e) {
          console.warn(e);
        }
      }
      await ctx.replyWithPhoto(bannerUrl, {caption: baseText, reply_markup:baseMarkup.reply_markup});
    }
  }

  @Action('play')
  async play(@Ctx() ctx: SceneContext) {
    await ctx.scene.enter(PLAY_SCENE);
  }

  @Action('referral')
  async referral(@Ctx() ctx: SceneContext) {
    await ctx.scene.enter(REFERRAL_SCENE);
  }

  @Action('info-links')
  async infoLinks(@Ctx() ctx: SceneContext) {
    await ctx.scene.enter(INFO_LINKS_SCENE);
  }

  @Action('faq')
  async faq(@Ctx() ctx: SceneContext) {
    await ctx.scene.enter(FAQ_SCENE);
  }

}
