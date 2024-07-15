import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Command, Ctx, Start, Update } from 'nestjs-telegraf';
import db from 'src/database/db';
import { BASE_SCENE, CREATE_GUILD_SCENE } from 'src/telegram/scenes.type';
import { SceneContext } from 'telegraf/typings/scenes';
import { $baseApi } from '../database/index';
import { v4 as uuidv4 } from 'uuid';
@Update()
@Injectable()
export class TelegramEntryService {
  constructor(
    private readonly configService: ConfigService,
  ) { }
  @Start()
  async start(@Ctx() ctx: SceneContext & { payload?: string }) {
    if (ctx.chat.type !== 'private' || ctx.from.is_bot) {
      return 'Only 4 people';
    }

    let openScene = BASE_SCENE
    const { first_name, username } = ctx.from;
    console.log(`${first_name} run bot`)

    const foundUser = (await db.query(`SELECT uuid FROM users WHERE user_id = ${ctx.from.id}`)).rows[0]
    const uuid = uuidv4();
    if (!foundUser) {
      const shareUrl = `https://t.me/${this.configService.get(
        'BOT_NAME',
      )}?start=${uuid}`;
      const photoId = await ctx.telegram.getUserProfilePhotos(ctx.from.id)
      let photoUrl = ''
      if (photoId.photos && photoId.photos[0]) {
        photoUrl = (await ctx.telegram.getFileLink(photoId.photos[0][0].file_id)).href.split('photos/')[1]
      }
      const lang = ctx.from.language_code
      const premium = ctx.from.is_premium ? ctx.from.is_premium : false
      const newUserData = { userId: ctx.from.id, uuid: uuid, photo_url: photoUrl, user_name: username, ref_link: shareUrl, lang: lang, premium: premium }
      const res = await $baseApi.post('/api/user/register', newUserData)
      console.log(res.data)
    }
    if (ctx.payload) {
      if (ctx.payload.toString() != 'start') {
        if (ctx.payload.toString() == "create_guild") {
          console.log("GUILD CREATOR")
          await this.create(ctx);
          return;
        }

        if (ctx.payload.toString() != "create_guild") {
          const p = ctx.payload.toString().split("_0LL_")
          let guildName: string
          let p_uuid: string

          if (p.length > 1) {
            guildName = p[0]
            p_uuid = p[1]
          } else
            p_uuid = p[0]

          try {
            if (foundUser && foundUser.jwt) {
              throw new Error('Already in system');
            }

            const byUser = (await db.query(`SELECT user_id, guild_id, start_regen_time FROM users WHERE uuid = '${p_uuid}'`)).rows[0]

            if (!byUser) {
              throw new Error('User not found');
            }

            await db.query(`UPDATE users SET refferal = '${p_uuid}' WHERE user_id = ${ctx.from.id}`);

            if (guildName) {
              const res = await $baseApi.get(`/api/user/jwt?userId=${ctx.from.id}`)
              const { jwt } = res.data
              const headers = { 'Authorization': `Bearer ${jwt}` }
              await $baseApi.post('/api/guild/join', { userId: ctx.from.id, guildId: byUser.guild_id }, { headers })
            }
            await ctx.sendMessage('Referral is used');
          } catch (e) {
            console.log(e)
            await ctx.sendMessage('Referral cannot be used');
          }
        }
      } else {
        await ctx.deleteMessage(ctx.msgId - 1)
      }
    }
    await ctx.scene.enter(BASE_SCENE);
  }

  @Command('create_guild')
  async create(@Ctx() ctx: SceneContext & { payload?: string }) {
    await ctx.scene.enter(CREATE_GUILD_SCENE);
  }
}
