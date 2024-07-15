import db from '../database/index.js';
import ApiError from '../exceptions/api.error.js';
import dotenv from 'dotenv';

dotenv.config();
const limit = process.env.LIST_LIMIT;

class GuildService {
    // Create a new guild
    async create(guildId, userId, ownerName, guildName, photoUrl, refLink, channelUrl) {
        const data = (await db.query(`SELECT start_regen_time, boss_id, guild_id FROM users WHERE user_id = ${userId}`)).rows[0];
        if (!data && !data.boss_id) invalidUserId();

        const guildData = (await db.query(`SELECT * FROM guilds WHERE guild_id = ${guildId}`)).rows[0];
        
        if (!guildData) {
            if (data.guild_id != 0) {
                await db.query(`UPDATE guilds SET users_count = users_count - 1 WHERE guild_id = ${data.guild_id}`);
            }
            console.log(channelUrl)
            const newGuildData = `(${(guildId)}, '${guildName}', '${photoUrl}', '${channelUrl}', ${userId}, '${ownerName}', '${refLink}')`;
            await db.query(`INSERT INTO guilds (guild_id, name, photo_url, channel_url, owner_id, owner, ref_link) VALUES ${newGuildData}`);

            const startRegenTime = data.start_regen_time == 0 ? nowUnix() : data.start_regen_time;
            await db.query(`UPDATE users SET guild_id = ${guildId}, start_regen_time = ${startRegenTime}, guild_coins = 0 WHERE user_id = ${userId}`);
        } else {
            throw ApiError.BadRequest(`Guild with this id already exists`);
        }

        return { refLink };
    }

    // Join an existing guild
    async join(guildId, userId) {
        const { guild_id, start_regen_time } = (await db.query(`SELECT guild_id, boss_id, start_regen_time FROM users WHERE user_id = ${userId}`)).rows[0];
        if (guild_id == undefined) invalidUserId();
        if (guild_id == guildId) throw ApiError.BadRequest(`You are already a member of this guild`);
        if (guild_id != 0) throw ApiError.BadRequest(`You are already a member of another guild`);

        const { users_count } = (await db.query(`SELECT users_count FROM guilds WHERE guild_id = ${guildId}`)).rows[0];
        if (!users_count) throw ApiError.BadRequest(`Invalid guild id`);

        const newUserCount = users_count + 1;
        const { coins } = (await db.query(`UPDATE guilds SET users_count = ${newUserCount} WHERE guild_id = ${guildId} RETURNING coins`)).rows[0];
        const { damage_bonus, hp_bonus } = (await db.query(`SELECT * FROM guild_bonus WHERE min_rating <= ${coins} ORDER BY min_rating DESC`)).rows[0];

        const startRegenTime = start_regen_time == 0 ? nowUnix() : start_regen_time;
        await db.query(`UPDATE users SET guild_id = ${guildId}, start_regen_time = ${startRegenTime} WHERE user_id = ${userId}`);
        const rating = (await db.query(`SELECT user_name, guild_coins, photo_url FROM users WHERE guild_id = ${guildId} ORDER BY guild_coins DESC LIMIT ${limit}`)).rows;

        return { userCount: newUserCount, rating, damageBonus: damage_bonus, hpBonus: hp_bonus };
    }

    // Leave a guild
    async leave(guildId, userId) {
        const data = (await db.query(`SELECT guild_id, boss_id, current_user_hp FROM users WHERE user_id = ${userId}`)).rows[0];
        if (data.guild_id == undefined) invalidUserId();
        if (data.guild_id != guildId) throw ApiError.BadRequest(`Invalid guild id`);
        if (data.guild_id == 0) throw ApiError.BadRequest(`You are not member of the guild`);
       
        const { users_count, owner_id } = (await db.query(`SELECT users_count, owner_id FROM guilds WHERE guild_id = ${guildId}`)).rows[0];
        if (!users_count) throw ApiError.BadRequest(`Invalid guild id`);
        if (owner_id == userId) throw ApiError.BadRequest(`You are owner of the guild`);
        const newUserCount = users_count - 1;
        const { coins } = (await db.query(`UPDATE guilds SET users_count = ${newUserCount} WHERE guild_id = ${guildId} RETURNING coins`)).rows[0];
        const { damage_bonus, hp_bonus } = (await db.query(`SELECT * FROM guild_bonus WHERE min_rating <= ${coins} ORDER BY min_rating DESC`)).rows[0];

        const { user_hp } = (await db.query(`SELECT user_hp FROM bosses WHERE boss_id = ${data.boss_id}`)).rows[0];
        const currentUserHP = Math.min(user_hp, data.current_user_hp)
        await db.query(`UPDATE users SET guild_id = 0, guild_coins = 0, current_user_hp = ${currentUserHP} WHERE user_id = ${userId}`);
        const rating = (await db.query(`SELECT user_name, guild_coins, photo_url FROM users WHERE guild_id = ${guildId} ORDER BY guild_coins DESC LIMIT ${limit}`)).rows;

        return { userCount: newUserCount, rating, damageBonus: damage_bonus, hpBonus: hp_bonus };
    }

    // Get current guild information
    async current(guildId) {
        const guildData = (await db.query(`SELECT * FROM guilds WHERE guild_id = ${guildId}`)).rows[0];
        if (!guildData) throw ApiError.BadRequest(`Invalid guild id`);

        const { damage_bonus, hp_bonus } = (await db.query(`SELECT * FROM guild_bonus WHERE min_rating <= ${guildData.coins} ORDER BY min_rating DESC`)).rows[0];
        const { uuid } = (await db.query(`SELECT uuid FROM users WHERE user_id = ${guildData.owner_id}`)).rows[0];
        const rating = (await db.query(`SELECT user_name, guild_coins, photo_url FROM users WHERE guild_id = ${guildId} ORDER BY guild_coins DESC LIMIT ${limit}`)).rows;
        const refLink = `${guildData.ref_link}_0LL_${uuid}`
        return {
            name: guildData.name,
            photo_url: guildData.photo_url,
            channelUrl: guildData.channel_url,
            owner: guildData.owner,
            coins: guildData.coins,
            userCount: guildData.users_count,
            damageBonus: damage_bonus,
            hpBonus: hp_bonus,
            refLink: refLink,
            rating
        };
    }

    // Reward guild owners
    async reward() {
        const owners = (await db.query(`SELECT owner_id, coins FROM guilds`)).rows;

        for (const owner of owners) {
            const { coins } = (await db.query(`SELECT coins FROM users WHERE user_id = ${owner.owner_id}`)).rows[0];
            const reward = Math.floor(coins * 1 / 100);
            if (reward > 0)
                await db.query(`UPDATE users SET coins = ${coins + reward} WHERE user_id = ${owner.owner_id}`);
        }
        return { success: true };
    }
}

// Helper function to handle invalid user id
function invalidUserId() {
    throw ApiError.BadRequest(`Invalid user id`);
}

function nowUnix() {
    return Math.floor(Date.now() / 1000);
}


export default new GuildService();