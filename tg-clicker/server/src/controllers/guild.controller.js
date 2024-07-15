import guildService from '../service/guild.service.js';


class GuildController {
    async create(req, res, next) {
        try {
            const { guildId, userId, ownerName, guildName, photoUrl, refLink, channelUrl } = req.body
            const createData = await guildService.create(guildId, userId, ownerName, guildName, photoUrl, refLink, channelUrl)

            return res.json(createData);
        } catch (e) {
            next(e);
        }
    }

    async join(req, res, next) {
        try {
            const { guildId, userId } = req.body
            const joinData = await guildService.join(guildId, userId);

            return res.json(joinData);
        } catch (e) {
            next(e);
        }
    }


    async leave(req, res, next) {
        try {
            const { guildId, userId } = req.body
            const leaveData = await guildService.leave(guildId, userId)

            return res.json(leaveData);
        } catch (e) {
            next(e);
        }
    }

    async current(req, res, next) {
        try {
            const { guildId } = req.query
            const currentData = await guildService.current(guildId);

            return res.json(currentData);
        } catch (e) {
            next(e);
        }
    }

    async reward(req, res, next) {
        try {
            const rewardData = await guildService.reward();

            return res.json(rewardData);
        } catch (e) {
            next(e);
        }
    }
}


export default new GuildController();