import TelegramBot from 'node-telegram-bot-api';
import { pool } from '../models/postgresModel.js';
import dotenv from 'dotenv';
import crypto from 'crypto'
import { setProgress } from './achivments.controller.js';

dotenv.config();

class TelegtramController {
    async checkSub(req, res, next) {
        try {
            const id = req.session.user
            pool.query("SELECT telegramUserId, telegramSub FROM users WHERE id = " + id + ";", async (error, results) => {
                if (error)
                    console.log(error);
                if (results && results.rows[0]["telegramuserid"] != null) {
                    if (results.rows[0]["telegramsub"] != null)
                        res.json({ "message": "telegram user is already subscribed", "state": true })
                    else {
                        const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });
                        const pass = await bot.getChatMember('@GiTestSub', results.rows[0]["telegramuserid"])
                        if (pass.status === "left")
                            res.json({ "message": "telegram user is not subscribed", "state": false })
                        else {
                            pool.query("UPDATE users SET telegramSub = True WHERE id = " + id + ";", (error) => {
                                if (error)
                                    console.log(error.message)
                                else
                                    setProgress()
                            })
                            res.json({ "message": "telegram user is subscribed", "state": true })
                        }
                    }
                } else
                    res.json({ "message": "you should login with telegram", "state": false })
            });
        } catch (e) {
            next(e);
        }
    }

    async tgAuthCallback(req, res, next) {
        try {
            const { username, id, auth_date, first_name, photo_url, hash } = req.query
            const key = crypto.createHash('sha256').update(process.env.TELEGRAM_BOT_TOKEN).digest()
            const validateHash = crypto.createHmac('sha256', key).update(`auth_date=${auth_date}\nfirst_name=${first_name}\nid=${id}\nphoto_url=${photo_url}\nusername=${username}`).digest('hex')
            if (validateHash == hash) {
                const userId = req.session.user
                pool.query("UPDATE users SET telegramName = '" + username + "', telegramUserId = " + id + " WHERE id = '" + userId + "';", (error) => {
                    if (error)
                        console.log(error.message)
                    else {
                        setProgress()
                    }
                })
            }
            res.redirect(process.env.REDIRECT_URL2)
        } catch (e) {
            next(e);
        }
    }

    async tgLoginCallback(req, res, next) {
        try {
            let code = req.session.code
            if (!code)
                code = null
            const { username, id, auth_date, first_name, photo_url, hash } = req.query
            const key = crypto.createHash('sha256').update(process.env.TELEGRAM_BOT_TOKEN).digest()
            const validateHash = crypto.createHmac('sha256', key).update(`auth_date=${auth_date}\nfirst_name=${first_name}\nid=${id}\nphoto_url=${photo_url}\nusername=${username}`).digest('hex')
            if (validateHash == hash) {
                pool.query("SELECT * FROM users WHERE telegramUserId = '" + id + "';", (error, results) => {
                    if (error)
                        console.log(error);
                    if (results && results.rows.length > 0) {
                        const userData = results.rows[0]
                        req.session.user = userData["id"]
                        req.session.save()
                    } else {
                        pool.query("INSERT INTO users (telegramName, telegramUserId) VALUES ('" + username + "', " + id + ") RETURNING id;", (error, results) => {
                            if (error)
                                console.log(error);
                            if (results && results.rows.length > 0) {
                                const userData = results.rows[0]
                                if (code != undefined)
                                    pool.query("SELECT refCount FROM users WHERE refcode = '" + code + "';", (error, results) => {
                                        if (error)
                                            console.log(error);
                                        if (results && results.rows.length > 0) {
                                            const refCount = results.rows[0]["refcount"]
                                            refCount++;
                                            pool.query("UPDATE users SET refCount = " + refCount + " WHERE refcode = '" + code + "';", (error) => {
                                                if (error)
                                                    console.log(error.message)
                                            })
                                        }
                                    })
                                req.session.user = userData["id"]
                                req.session.save()
                            }
                        });
                    }
                });
            }
            res.redirect(process.env.REDIRECT_URL2)
        } catch (e) {
            next(e);
        }
    }

}

export default new TelegtramController();