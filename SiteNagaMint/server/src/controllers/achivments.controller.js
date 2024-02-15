import { pool } from '../models/postgresModel.js';
import { v4 as uuid } from 'uuid';

class AchivmentsController {
    async youtubeSub(req, res, next) {
        try {
            const id = req.session.user
            setTimeout(update, 5000)
            function update() {
                pool.query("UPDATE users SET youtubeSub = True WHERE id = " + id + ";", (error) => {
                    if (error)
                        console.log(error.message)
                    else
                        setProgress(id)
                })
                res.json({ "message": "sub is success" });
            }
        } catch (e) {
            next(e);
        }
    }

    async youtubeWatch(req, res, next) {
        try {
            const id = req.session.user
            setTimeout(update, 5000)
            function update() {
                pool.query("UPDATE users SET youtubeWatch = True WHERE id = " + id + ";", (error) => {
                    if (error)
                        console.log(error.message)
                    else
                        setProgress(id)
                })
                res.json({ "message": "video watched" });
            }
        } catch (e) {
            next(e);
        }
    }

    async instaSub(req, res, next) {
        try {
            const id = req.session.user
            setTimeout(update, 5000)
            function update() {
                pool.query("UPDATE users SET instaSub = True WHERE id = " + id + ";", (error) => {
                    if (error)
                        console.log(error.message)
                    else
                        setProgress(id)
                })
                res.json({ "message": "insta is success" });
            }
        } catch (e) {
            next(e);
        }
    }

    async checkLink(req, res, next) {
        try {
            const id = req.session.user
            pool.query("SELECT refCode FROM users WHERE id = " + id + ";", (error, results) => {
                if (error)
                    console.log(error);
                if (results && results.rows[0]["refcode"] != null) {
                    const code = results.rows[0]["refcode"]
                    res.json(code)
                } else {
                    const refferralCode = uuid()
                    pool.query("UPDATE users SET refcode = '" + refferralCode + "' WHERE id = " + id + ";", (error) => {
                        if (error)
                            console.log(error.message)
                    })
                    res.json(refferralCode);
                }
            });
        } catch (e) {
            next(e);
        }
    }
}

export async function setProgress(id) {
    try {
        pool.query("SELECT progress, refuser FROM users WHERE id = " + id + ";", (error, results) => {
            if (error)
                console.log(error);
            if (results && results.rows.length > 0) {
                const userData = results.rows[0]
                const { progress, refuser } = userData
                const newProgress = progress + 1
                pool.query("UPDATE users SET progress = " + newProgress + "  WHERE id = " + id + ";", (error) => {
                    if (error)
                        console.log(error.message)
                })
                console.log(userData)
                if (newProgress == 5 && refuser != null)
                    pool.query("UPDATE users SET refAchive = True WHERE refCode = '" + refuser + "';", (error) => {
                        if (error)
                            console.log(error.message)
                        else
                            pool.query("SELECT id FROM users WHERE refCode = '" + refuser + "';", (error, results) => {
                                if (error)
                                    console.log(error);
                                if (results && results.rows.length > 0) {
                                    const userId = results.rows[0]["id"]
                                    setProgress(userId)
                                }
                            })
                    })
            }
        });
    } catch (e) {
        next(e);
    }
}

export default new AchivmentsController();