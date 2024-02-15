import { pool } from '../models/postgresModel.js';
import { setProgress } from './achivments.controller.js';

class GmailController {
    async web3Auth(req, res, next) {
        try {
            const { wallet } = req.body
            const id = req.session.user
            pool.query("SELECT wallet FROM users WHERE id = " + id + ";", (error, results) => {
                if (error)
                    console.log(error);
                if (results.rows[0]["wallet"] != null) {
                    if (results.rows[0]["wallet"] == wallet)
                        res.json({ "message": "wallet already connected" });
                    else {
                        pool.query("UPDATE users SET wallet = '" + wallet + "' WHERE id = " + id + ";", (error) => {
                            if (error)
                                console.log(error.message)
                        })
                        res.json({ "message": "wallet updated" });
                    }
                }
                else {
                    pool.query("UPDATE users SET wallet = '" + wallet + "' WHERE id = " + id + ";", (error) => {
                        if (error)
                            console.log(error.message)
                        else {
                            setProgress(id)
                        }
                    })
                    res.json({ "message": "wallet connected" });
                }
            })
        } catch (e) {
            next(e);
        }
    }
}

export default new GmailController();