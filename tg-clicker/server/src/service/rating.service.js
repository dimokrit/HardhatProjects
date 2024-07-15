import db from '../database/index.js';
import ApiError from '../exceptions/api.error.js';
import dotenv from 'dotenv';

dotenv.config();
const limit = process.env.LIST_LIMIT;

class RatingService {
    async users(userId) {
        console.log(userId)
        const data = (await db.query(`SELECT current_coins FROM users WHERE user_id = ${userId}`)).rows[0]
        if (!data) throw ApiError.BadRequest(`Invalid user id`);

        const totalUsers = (await db.query(`SELECT COUNT(*) FROM users`)).rows[0]
        const rating = (await db.query(`SELECT user_name, current_coins, photo_url FROM users ORDER BY current_coins DESC LIMIT ${limit}`)).rows
        const userRank = (await db.query(`SELECT COUNT(*) FROM users WHERE current_coins > ${data.current_coins}`)).rows[0]
        const currentRank = Number(userRank.count) + 1

        if (currentRank > limit) {
            const userRankColumn = (await db.query(`SELECT user_name, current_coins FROM users WHERE user_id = ${userId}`)).rows[0]
            rating.push(userRankColumn)
        }
        
        const resData = {
            totalUsers: totalUsers.count,
            currentRank: currentRank,
            rating: rating
        }
        console.log(resData)
        return resData;
    }

    async guilds(userId) {
        console.log(userId)
        const guild = (await db.query(`SELECT guild_id FROM users WHERE user_id = ${userId}`)).rows[0]
        if (!guild && userId != 0) throw ApiError.BadRequest(`Invalid guild id`);
        const totalGuilds = (await db.query(`SELECT COUNT(*) FROM guilds`)).rows[0]
        let rating = (await db.query(`SELECT guild_id, name, users_count, photo_url, coins FROM guilds ORDER BY coins DESC LIMIT ${limit}`)).rows
        let currentRank = 0
        const guild_id = guild.guild_id
        if (guild_id && guild.guild_id != 0) {
            const { coins } = (await db.query(`SELECT coins FROM guilds WHERE guild_id = ${guild_id}`)).rows[0]
            const guildRank = (await db.query(`SELECT COUNT(*) FROM guilds WHERE coins > ${coins}`)).rows[0]
            currentRank = Number(guildRank.count) + 1
            if (currentRank > limit) {
                const guildRankColumn = (await db.query(`SELECT guild_id, name, users_count, photo_url, coins FROM guilds WHERE guild_id = ${guild_id}`)).rows[0]
                rating.push(guildRankColumn)
            }
        }

        const resData = {
            totalGuilds: totalGuilds.count,
            currentRank: currentRank,
            rating: rating
        }
        console.log(resData)
        return resData;
    }

}

export default new RatingService();