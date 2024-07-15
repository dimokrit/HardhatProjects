import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import { BASE_SCENE, PLAY_SCENE } from '../scenes.type';
import {
  InlineKeyboardMarkup,
  ParseMode,
  Update,
} from 'telegraf/typings/core/types/typegram';
import dedent from 'ts-dedent';
import { ConfigService } from '@nestjs/config';
import { $baseApi } from 'src/database';
const chats = [
  {
    title: '✅ Subscribe to the channel',
    name: 'girand_official_en',
  },
];
let jwt: string
@Scene(PLAY_SCENE)
export class PlayScene {
  constructor(
    private readonly configService: ConfigService,
  ) { }
  @SceneEnter()
  async enter(
    @Ctx()
    ctx: SceneContext & {
      update: Update.CallbackQueryUpdate;

    },
  ) {
    const text = dedent`To play, be sure to subscribe to our Telegram channel.
                        Also subscribe to our social networks and follow the project.`;

    const resolvedChats: { resolved: boolean; title: string; name: string }[] =
      await Promise.all(
        chats.map(async (chat) => {
          try {
            const res = await ctx.telegram.getChatMember(
              `@${chat.name}`,
              ctx.from.id,
            );

            return {
              ...chat,
              resolved: ['creator', 'administrator', 'member'].includes(
                res.status,
              ),
            };
          } catch (e) {
            console.log(e);

            return { ...chat, resolved: false };
          }
        }),
      );

    const leftChats = resolvedChats.filter((chat) => !chat.resolved);

    const toSendKeyboard: {
      parse_mode?: ParseMode;
      reply_markup?: InlineKeyboardMarkup;
    } = {
      reply_markup: {
        inline_keyboard: [
          ...leftChats.map((chat) => [
            {
              text: chat.title,
              url: `https://t.me/${chat.name}`,
              callback_data: 'check'
            },
          ]),
          [{ text: '🔁 Check subscription', callback_data: 'check' }],
          [{ text: '🔙 Back to menu', callback_data: 'back' }],
        ],
      },
    };
    if (leftChats.length > 0) {
      await ctx.editMessageCaption(text, toSendKeyboard);
    } else {
      if (ctx.update.callback_query?.message) {
        const gameText = dedent(`🟢 Never stop Clicking: Click as much as you can and watch your coins soar.

                                 📣 Invite friends and receive coins for each invitee.

                                 ✔️ Complete simple tasks and receive coins for each completed task.
                                 
                                 Let’s tap!`)

        const res = await $baseApi.get(`/api/user/jwt?userId=${ctx.from.id}`)
        const jwt = res.data.jwt
        const versionData = await (await fetch(`${this.configService.get('GAME_URL')}/game/webgl/versions.json`)).json()
        const version = versionData["dev_version"]
        const url = `${this.configService.get('GAME_URL')}/game/webgl/${version}/index.html?jwt=${jwt}`
        console.log(url)
        await ctx.deleteMessage(ctx.update.callback_query.message.message_id);
        const toSendKeyboards: {
          parse_mode?: ParseMode;
          reply_markup?: InlineKeyboardMarkup;
        } = {
          reply_markup: {
            inline_keyboard: [
              [{ text: '🎮 Play', web_app: { url: url }}],
              [{ text: '🛠️ Autofix', url: `https://t.me/GirandCombatBot?start=start` }],
              [{ text: '🔙 Back to menu', callback_data: 'back' }],
            ],
          },
        }
        try {
          await ctx.editMessageCaption(gameText, toSendKeyboards);
        } catch (e) {
          const bannerUrl = `${this.configService.get('BACK_API_URL')}/static/banner.jpg`
          await ctx.replyWithPhoto(bannerUrl, { caption: gameText, reply_markup: toSendKeyboards.reply_markup });
        }
      };
    }
  }

  @Action('back')
  async create(
    @Ctx() ctx: SceneContext & { update: Update.CallbackQueryUpdate },
  ) {
    await ctx.scene.enter(BASE_SCENE);
  }

  @Action('gen')
  async gen(
    @Ctx() ctx: SceneContext & { update: Update.CallbackQueryUpdate },
  ) {
    console.log("NEW JWT")
    const res = await $baseApi.get(`/api/user/jwt?userId=${ctx.from.id}`)
    jwt = res.data.jwt
  }

  @Action('check')
  async check(
    @Ctx() ctx: SceneContext & { update: Update.CallbackQueryUpdate },
  ) {

    const resolvedChats: { resolved: boolean; title: string; name: string }[] =
      await Promise.all(
        chats.map(async (chat) => {
          try {
            const res = await ctx.telegram.getChatMember(
              `@${chat.name}`,
              ctx.from.id,
            );

            return {
              ...chat,
              resolved: ['creator', 'administrator', 'member'].includes(
                res.status,
              ),
            };
          } catch (e) {
            console.log(e);

            return { ...chat, resolved: false };
          }
        }),
      );

    const leftChats = resolvedChats.filter((chat) => !chat.resolved);


    if (leftChats.length > 0) {
      ctx.answerCbQuery('You are not subscribed on the channel', {
        show_alert: true,
      });
    } else {
      if (ctx.update.callback_query?.message) {
        const gameText = dedent(`🟢 Never stop Clicking: Click as much as you can and watch your coins soar.

             📣 Invite friends and receive coins for each invitee.

             ✔️ Complete simple tasks and receive coins for each completed task.
             
             Let’s tap!`)

        const res = await $baseApi.get(`/api/user/jwt?userId=${ctx.from.id}`)
        const { jwt } = res.data
        const versionData = await (await fetch(`${this.configService.get('GAME_URL')}/game/webgl/versions.json`)).json()
        const version = versionData["dev_version"]
        const url = `${this.configService.get('GAME_URL')}/game/webgl/${version}/index.html?jwt=${jwt}`
        console.log(url)
        await ctx.deleteMessage(ctx.update.callback_query.message.message_id);
        const toSendKeyboards: {
          parse_mode?: ParseMode;
          reply_markup?: InlineKeyboardMarkup;
        } = {
          reply_markup: {
            inline_keyboard: [
              [{ text: '🎮 Play', web_app: { url: url } }],
              [{ text: '🔙 Back to menu', callback_data: 'back' }],
            ],
          },
        }
        try {
          await ctx.editMessageCaption(gameText, toSendKeyboards);
        } catch (e) {
          const bannerUrl = `${this.configService.get('BACK_API_URL')}/static/banner.jpg`
          await ctx.replyWithPhoto(bannerUrl, { caption: gameText, reply_markup: toSendKeyboards.reply_markup });
        }
      };
    }
  }
}