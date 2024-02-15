import { pool } from '../models/postgresModel.js';
import { google } from 'googleapis';
import url from "url"
import dotenv from 'dotenv';
import { setProgress } from './achivments.controller.js';
dotenv.config();

const clientId = "947884460324-n3kd271m4sfgaqi3hnuv9kiu4n6vhsog.apps.googleusercontent.com"
const secretKey = "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"

const oauth2ClientLog = new google.auth.OAuth2(
    clientId,
    secretKey,
    "http://localhost:5000/api/gmail/gmailCallback"
);

const oauth2ClientAuth = new google.auth.OAuth2(
    clientId,
    secretKey,
    "http://localhost:5000/api/gmail/gmailAuthCallback"
);

class GmailController {
    async gmailAuth(req, res, next) {
        try {
            // Access scopes for read-only Drive activity.
            const scopes = [
                'openid', 'email', 'profile'
            ];
            // Generate a url that asks permissions for the Drive activity scope
            const authorizationUrl = oauth2ClientAuth.generateAuthUrl({
                // 'online' (default) or 'offline' (gets refresh_token)
                access_type: 'online',
                /** Pass in the scopes array defined above.
                  * Alternatively, if only one scope is needed, you can pass a scope URL as a string */
                scope: scopes,
                // Enable incremental authorization. Recommended as a best practice.
                include_granted_scopes: false,
                prompt: 'select_account'
            });
            const data = { "url": authorizationUrl }
            res.json(data)
        } catch (e) {
            next(e);
        }
    }

    async gmailLogin(req, res, next) {
        try {
            req.session.code = req.body["code"]
            const scopes = [
                'openid', 'email', 'profile'
            ];

            // Generate a url that asks permissions for the Drive activity scope
            const authorizationUrl = oauth2ClientLog.generateAuthUrl({
                // 'online' (default) or 'offline' (gets refresh_token)
                access_type: 'online',
                /** Pass in the scopes array defined above.
                  * Alternatively, if only one scope is needed, you can pass a scope URL as a string */
                scope: scopes,
                // Enable incremental authorization. Recommended as a best practice.
                include_granted_scopes: false,
                prompt: 'select_account'
            });

            const data = { "url": authorizationUrl }
            res.json(data)
        } catch (e) {
            next(e);
        }
    }

    async gmailCallback(req, res, next) {
        try {
            let code = req.session.code
            if (!code)
                code = null
            let q = url.parse(req.url, true).query
            if (q.error)
                console.log('Error:' + q.error);
            else {
                let { tokens } = await oauth2ClientLog.getToken(q.code);
                oauth2ClientLog.setCredentials(tokens);
                const userCredential = tokens;
                const profile = JSON.parse(Buffer.from(userCredential["id_token"].split('.')[1], 'base64'))
                const email = profile["email"]
                pool.query("SELECT * FROM users WHERE email = '" + email + "';", (error, results) => {
                    if (error)
                        console.log(error);
                    if (results && results.rows.length > 0) {
                        const userData = results.rows[0]
                        req.session.user = userData["id"]
                        req.session.save()
                    } else {
                        pool.query("INSERT INTO users (email, progress, refuser) VALUES ('" + email + "', 1, '" + code + "') RETURNING id;", (error, results) => {
                            if (error)
                                console.log(error);
                            if (results && results.rows.length > 0) {
                                const userData = results.rows[0]
                                if (code)
                                    pool.query("SELECT refCount FROM users WHERE refcode = '" + code + "';", (error, results) => {
                                        if (error)
                                            console.log(error);
                                        if (results && results.rows.length > 0) {
                                            let refCount = results.rows[0]["refcount"]
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
            res.redirect(process.env.REDIRECT_URL1)
        } catch (e) {
            next(e);
        }
    }

    async gmailAuthCallback(req, res, next) {
        try {
            let q = url.parse(req.url, true).query
            if (q.error)
                console.log('Error:' + q.error);
            else {
                let { tokens } = oauth2ClientAuth.getToken(q.code);
                oauth2ClientLog.setCredentials(tokens);
                const userCredential = tokens;
                const profile = JSON.parse(Buffer.from(userCredential["id_token"].split('.')[1], 'base64'))
                const email = profile["email"]
                const id = req.session.user
                pool.query("UPDATE users SET email = '" + email + "' WHERE id = " + id + ";", (error) => {
                    if (error)
                        console.log(error.message)
                    else
                        setProgress(id)

                })
            }
            res.redirect(process.env.REDIRECT_URL1)
        } catch (e) {
            next(e);
        }
    }
}

export default new GmailController();