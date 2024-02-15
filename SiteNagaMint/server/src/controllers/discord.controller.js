import axios from 'axios';
import dotenv from 'dotenv';
import { pool } from '../models/postgresModel.js';
import { setProgress } from './achivments.controller.js';
dotenv.config();

class DiscordController {
    async callback(ctx) {
        try {
            if (!ctx.query.code) throw new Error('Code not provided.');

            const { code } = ctx.query;
            const params = new URLSearchParams({
                client_id: process.env.DISCORD_CLIENT_ID,
                client_secret: process.env.DISCORD_CLIENT_SECRET,
                grant_type: 'authorization_code',
                code,
                redirect_uri: process.env.DISCORD_REDIRECT_URL
            });

            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept-Encoding': 'application/x-www-form-urlencoded'
            };

            const response = await axios.post(
                'https://discord.com/api/oauth2/token',
                params,
                {
                    headers
                }
            );
            const token = response.data.access_token
            console.log(token)
            const userResponse = await axios.get('https://discord.com/api/users/@me', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    ...headers
                }
            });

            const { username } = userResponse.data;
            const id = ctx.session.user

            pool.query("UPDATE users SET discordName = '" + username + "', discordToken = '" + token + "' WHERE id = " + id + ";", (error) => {
                if (error)
                    console.log(error.message)
                else
                    setProgress(id)
            })
            ctx.res.redirect(process.env.REDIRECT_URL1);
        } catch (e) {
            ctx.next(e);
        }
    }

    async checkVerify(req, res, next) {
        try {
            const id = req.session.user
            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept-Encoding': 'application/x-www-form-urlencoded'
            };

            pool.query("SELECT discordToken, discordSub FROM users WHERE id = " + id + ";", async (error, results) => {
                if (error)
                    console.log(error);
                if (results && results.rows[0]["discordtoken"] != null) {
                    if (results.rows[0]["discordsub"] != null)
                        res.json({ "message": "discord user is already verified", "state": true })
                    else {
                        const token = results.rows[0]["discordtoken"]
                        const roleResponse = await axios.get('https://discord.com/api/users/@me/guilds/' + process.env.DISCORD_SERVER_ID + '/member', {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                ...headers
                            }
                        });
                        if (roleResponse.data["roles"].length > 0) {
                            pool.query("UPDATE users SET discordSub = True WHERE id = " + id + ";", (error) => {
                                if (error)
                                    console.log(error.message)
                                else
                                    setProgress(id)
                            })
                            res.json({ "message": "discord user is verified success", "state": true })
                        } else
                            res.json({ "message": "discord user is not verified", "state": false })
                    }
                } else {
                    res.json({ "message": "you should login with discord", "state": false })
                }
            });
        } catch (e) {
            next(e);
        }
    }
}

export default new DiscordController();