import { pool } from '../models/postgresModel.js';
import dotenv from 'dotenv';
import axios from 'axios';
import { Client, auth } from "twitter-api-sdk";
import { setProgress } from './achivments.controller.js';

dotenv.config();

class XController {
  async callback(req, res, next) {
    try {
      const code = req.query["code"]
      console.log(code)
      // using "twitter-api-sdk"
      // const authClient = new auth.OAuth2User({
      //     client_id: process.env.X_CLIENT_ID,
      //     client_secret: process.env.X_SECRET_ID,
      //     callback: process.env.X_REDIRECT_URL,
      //     scopes: ["tweet.read", "users.read", "offline.access"],
      //   })
      //   const client = new Client(authClient)
      //   await authClient.requestAccessToken(code)
      //   const { data } = await client.users.findMyUser()

      const twitterOauthTokenParams = {
        client_id: process.env.X_CLIENT_ID,
        code_verifier: "challenge",
        redirect_uri: process.env.X_REDIRECT_URL,
        grant_type: "authorization_code",
        code: code
      };
      const BasicAuthToken = Buffer.from(`${process.env.X_CLIENT_ID}:${process.env.X_SECRET_ID}`, "utf8").toString("base64");
      const response = await axios.post(
        "https://api.twitter.com/2/oauth2/token",
        new URLSearchParams(twitterOauthTokenParams).toString(), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${BasicAuthToken}`
        }
      }
      );
      const xToken = response.data["access_token"]

      const res = await axios.get("https://api.twitter.com/2/users/me", {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${xToken}`
        }
      });

      if (res.data != null || res.data != undefined) {
        const id = req.session.user
        const xId = res.data["id"]
        const xName = res.data["username"]
        pool.query("UPDATE users SET xName = '" + xName + "', xId = '" + xId + "' WHERE id = " + id + ";", (error) => {
          if (error)
            console.log(error.message)
          else
            setProgress(id)
        })
      }
      res.redirect(process.env.REDIRECT_URL1);
    } catch (e) {
      next(e);
    }
  }

  async checkSub(req, res, next) {
    try {
      const id = res.session.user
      pool.query("SELECT xId, xSub FROM users WHERE id = " + id + ";", async (error, results) => {
        if (error)
          console.log(error);
        if (results && results.rows[0]["xid"] != null) {
          if (results.rows[0]["xsub"] != null)
            res.json({ "message": "X user is already follower", "state": true })
          else {
            const xId = results.rows[0]["xid"]
            const response = await axios.get('https://api.twitter.com/2/users/:' + xId + '/following?name=GirantOfficial', {
              headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${token}`
              }
            });
            if (response.data.length > 0) {
              pool.query("UPDATE users SET xSub = True WHERE id = " + id + ";", (error) => {
                if (error)
                  console.log(error.message)
                else
                  setProgress(id)
              })
              res.json({ "message": "X user is follower success", "state": true })
            } else
              res.json({ "message": "X user is not follower", "state": false })
          }
        } else {
          res.json({ "message": "you should login with X", "state": false })
        }
      });
      res.redirect(process.env.REDIRECT_URL1);
    } catch (e) {
      next(e);
    }
  }

  async checkLike(req, res, next) {
    try {
      const id = res.session.user
      pool.query("SELECT xId, xLiker FROM users WHERE id = " + id + ";", async (error, results) => {
        if (error)
          console.log(error);
        if (results && results.rows[0]["xid"] != null) {
          if (results.rows[0]["xliker"] != null)
            res.json({ "message": "X user is already follower", "state": true })
          else {
            const xId = results.rows[0]["xid"]
            const response = await axios.get('https://api.twitter.com/2/tweets/:' + '{tweet_id}' + '/liking_users?id=' + xId, {
              headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${token}`
              }
            });
            if (response.data.length > 0) {
              pool.query("UPDATE users SET xLiker = True WHERE id = " + id + ";", (error) => {
                if (error)
                  console.log(error.message)
                else
                  setProgress(id)
              })
              res.json({ "message": "X user like success", "state": true })
            } else
              res.json({ "message": "X user didn't like", "state": false })
          }
        } else {
          res.json({ "message": "you should login with X", "state": false })
        }
      });
      res.redirect(process.env.REDIRECT_URL1);
    } catch (e) {
      next(e);
    }
  }

  async checkRetweet(req, res, next) {
    try {
      const id = res.session.user
      pool.query("SELECT xId, xRetweeter FROM users WHERE id = " + id + ";", async (error, results) => {
        if (error)
          console.log(error);
        if (results && results.rows[0]["xid"] != null) {
          if (results.rows[0]["xretweeter"] != null)
            res.json({ "message": "X user already retweeted", "state": true })
          else {
            const xId = results.rows[0]["xid"]
            const response = await axios.get('https://api.twitter.com/2/tweets/:' + '{tweet_id}' + '/liking_users?id=' + xId, {
              headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${token}`
              }
            });
            if (response.data.length > 0) {
              pool.query("UPDATE users SET xRetweeter = True WHERE id = " + id + ";", (error) => {
                if (error)
                  console.log(error.message)
                else
                  setProgress(id)
              })
              res.json({ "message": "X user retweet success", "state": true })
            } else
              res.json({ "message": "X user didn't retweet", "state": false })
          }
        } else {
          res.json({ "message": "you should login with X", "state": false })
        }
      });
      res.redirect(process.env.REDIRECT_URL1);
    } catch (e) {
      next(e);
    }
  }
}

export default new XController();