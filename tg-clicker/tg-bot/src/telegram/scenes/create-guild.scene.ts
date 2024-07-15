import { Action, Ctx, Scene, SceneEnter, On, Start } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import { BASE_SCENE, CREATE_GUILD_SCENE, PLAY_SCENE } from '../scenes.type';
import { Update } from 'telegraf/typings/core/types/typegram';
import dedent from 'ts-dedent';
import db from 'src/database/db';
import { $baseApi } from '../../database/index';
import { error } from 'console';
import { ConfigService } from '@nestjs/config';

@Scene(CREATE_GUILD_SCENE)
export class CreateGuildScene {
  constructor(
    private readonly configService: ConfigService,
  ) { }
  @SceneEnter()
  async enter(
    @Ctx()
    ctx: SceneContext & { update: Update.MessageUpdate },
  ) {
    const baseText = dedent`Send a link of your channel or chat.

                      It must have at least 300 people.
                      
                      Invite more people and earn more. 
    `;

    const bannerUrl = `${this.configService.get('BACK_API_URL')}/static/banner_creator.jpg`
    
    await ctx.telegram.sendPhoto(ctx.chat.id, bannerUrl, {
      caption: baseText,
      parse_mode: 'Markdown',
    });
  }

  @Start()
  async start(@Ctx() ctx: SceneContext & { payload?: string }) {
    await ctx.scene.enter(BASE_SCENE);
  }

  @On('text')
  async onText(
    @Ctx()
    ctx: SceneContext & { update: Update.MessageUpdate },
  ) {
    const message = ctx.update.message;
    if ('text' in message) {
      const messageText = message.text;

      if (messageText.includes('t.me/') || messageText.includes('@')) {
        const chatLink = messageText.trim();
    
        try {
          const chatName = chatLink.replace("https://t.me/", "").replace("t.me/", "").replace("@", "")
          const chat = await ctx.telegram.getChat(`@${chatName}`);

          if (chat && chat.id) {
            const membersCount = await ctx.telegram.getChatMembersCount(chat.id);
            const chatMember = await ctx.telegram.getChatMember(`@${chatName}`, ctx.from.id);
            if (chatMember.status === 'creator' || chatMember.status === 'administrator') {
               if (membersCount >= 300) {
                const { count } = (await db.query(`SELECT COUNT(*) FROM guilds WHERE guild_id = ${chat.id} OR owner_id = ${ctx.from.id}`)).rows[0]
                if (count != 0) {
                  await ctx.reply(dedent`❌ Please make sure the link is valid.`)
                } else {
                  let photoUrl = ''
                  if (chat.photo) {
                    const file = await ctx.telegram.getFile(chat.photo.small_file_id);
                    photoUrl = `https://api.telegram.org/file/bot${ctx.telegram.token}/${file.file_path}`;
                  }
                  const exist = (await db.query(`SELECT uuid, user_name FROM users WHERE user_id = ${ctx.from.id}`)).rows[0]
                  if (exist) {
                    const refLink = `https://t.me/GirandCombatBot?start=${chatName}`;
                    const channelLink = `https://t.me/${chatName}`
                    const res = await $baseApi.get(`/api/user/jwt?userId=${ctx.from.id}`)
                    const { jwt } = res.data
                    const headers = { 'Authorization': `Bearer ${jwt}` }
                    await $baseApi.post('/api/guild/create', {
                      guildId: chat.id,
                      userId: ctx.from.id,
                      ownerName: exist.user_name,
                      guildName: chat["title"],
                      photoUrl: photoUrl,
                      refLink: refLink,
                      channelUrl: channelLink
                    }, {headers})
                    
                    await ctx.reply(dedent`✅ Congratulations! You have created your own guild.
                                  Invite your friends and get bonuses!
                                  ${refLink}_0LL_${exist.uuid}`);

                    await ctx.scene.enter(PLAY_SCENE);
                  } else {
                    await ctx.reply(dedent`❌ You should launch to the game to create guild.`);
                  }
                }
              } else {
                await ctx.reply(dedent`❌ This channel is too small to become a clan, you need at least 300 members.`);
              }
           }
          } else {
            console.log(error)
            await ctx.reply(dedent`❌ Please make sure the link is valid.
            `);
          }
        } catch (error) {
          console.log(error)
          await ctx.reply(dedent`❌ Please make sure the link is valid.
          `);
        }
      } else {
        await ctx.reply(dedent`❌ Please make sure the link is valid.
        `);
      }
    }
  }

  @Action('back')
  async create(@Ctx() ctx: SceneContext & { update: Update.MessageUpdate }) {
    await ctx.scene.enter(BASE_SCENE);
  }
}
