import dataService from '../service/data.service.js';


class UserController {

    async upgrades(req, res, next) {
        try {
            const { userId } = req.query
            const upgradesData = await dataService.upgrades(userId);
            return res.json(upgradesData);
        } catch (e) {
            next(e);
        }
    }

    async tasks(req, res, next) {
        try {
            const { userId } = req.query
            const tasksData = await dataService.tasks(userId);
            return res.json(tasksData);
        } catch (e) {
            next(e);
        }
    }
    
}


export default new UserController();