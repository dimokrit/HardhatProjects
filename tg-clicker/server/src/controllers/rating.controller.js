import ratingService from '../service/rating.service.js';

class RatingController {
    async users(req, res, next) {
        try {
            const { userId } = req.query
            const usersData = await ratingService.users(userId)
            console.log(usersData)
            return res.json(usersData);
        } catch (e) {
            next(e);
        }
    }

    async guilds(req, res, next) {
        try {
            const { userId } = req.query
            const guildsData = await ratingService.guilds(userId);
            console.log(guildsData)
            return res.json(guildsData);
        } catch (e) {
            next(e);
        }
    }

}


export default new RatingController();