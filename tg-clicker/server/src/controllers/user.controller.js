import userService from '../service/user.service.js';


class UserController {

    async register(req, res, next) {
        try {
            const { userId, uuid, photo_url, user_name, ref_link, lang, premium } = req.body
            const registerData = await userService.register(userId, uuid, photo_url, user_name, ref_link, lang, premium);

            return res.json(registerData);
        } catch (e) {
            next(e);
        }
    }

    async login(req, res, next) {
        try {
            const { userId } = req.body
            const loginData = await userService.login(userId)

            return res.json(loginData);
        } catch (e) {
            next(e);
        }
    }

    async hit(req, res, next) {
        try {
            const { userId } = req.body
            const hitData = await userService.hit(userId);

            return res.json(hitData);
        } catch (e) {
            next(e);
        }
    }


    async heal(req, res, next) {
        try {
            const { userId } = req.body
            const healData = await userService.heal(userId);

            return res.json(healData);
        } catch (e) {
            next(e);
        }
    }

    async task(req, res, next) {
        try {
            const { userId, taskId } = req.body
            const taskData = await userService.task(userId, taskId);

            return res.json(taskData);
        } catch (e) {
            next(e);
        }
    }

    async auth(req, res, next) {
        try {
            const authHeader = req.headers['authorization'];
            const authData = await userService.auth(authHeader);

            return res.json(authData);
        } catch (e) {
            next(e);
        }
    }

    async jwt(req, res, next) {
        try {
            const { userId } = req.query
            const jwtToken = await userService.jwt(userId);

            return res.json(jwtToken);
        } catch (e) {
            next(e);
        }
    }

    async photo(req, res, next) {
        try {
            const { url } = req.query
            const photoData = await userService.photo(url);

            return res.json(photoData);
        } catch (e) {
            next(e);
        }
    }

    async daily(req, res, next) {
        try {
            const { userId } = req.body
            const dailyData = await userService.daily(userId);

            return res.json(dailyData);
        } catch (e) {
            next(e);
        }
    }

    async upgrade(req, res, next) {
        try {
            const { userId, taskId } = req.body
            const upgradeData = await userService.upgrade(userId, taskId);

            return res.json(upgradeData);
        } catch (e) {
            next(e);
        }
    }

    async friends(req, res, next) {
        try {
            const { userId } = req.query
            const friendsData = await userService.friends(userId);

            return res.json(friendsData);
        } catch (e) {
            next(e);
        }
    }
}


export default new UserController();