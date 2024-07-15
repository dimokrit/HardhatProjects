import db from '../database/index.js';
import ApiError from '../exceptions/api.error.js';
import dotenv from 'dotenv';

dotenv.config();

class DataService {
    async upgrades(userId) {
        const { upgrades_levels } = (await db.query(`SELECT upgrades_levels FROM users WHERE user_id = ${userId}`)).rows[0];
        console.log(upgrades_levels)
        const currentLevels = formatUpgradeArray(upgrades_levels)
        console.log(currentLevels)
        const upgradesData = (await db.query(`SELECT * FROM upgrades WHERE (id, level) IN (${currentLevels}) ORDER BY id ASC`)).rows;
        const upgradesNames = (await db.query(`SELECT * FROM upgrades_names`)).rows;

        let upgrades = []
        for (let i = 0; i < upgradesData.length; i++) {
            const next = {
                id: i,
                name: upgradesNames[i].name,
                level: upgrades_levels[i],
                maxLevel: process.env.UPGRADES_MAX_LEVEL,
                cost: upgradesData[i].cost,
                coinsPerHour: upgradesData[i].coins_per_hour
            }
            upgrades.push(next)
        }
        const resData = {
            upgrades: upgrades
        }

        console.log(resData)
        return resData;
    }

    async tasks(userId) {
        const { task_levels, crit_count, coins, current_coins, first_task_damage, potions_used, hits_in_row, boss_id, taps_count } = (await db.query(`SELECT task_levels, 
                                                                                                                                                  crit_count, 
                                                                                                                                                  coins, 
                                                                                                                                                  current_coins, 
                                                                                                                                                  first_task_damage, 
                                                                                                                                                  potions_used, 
                                                                                                                                                  hits_in_row, 
                                                                                                                                                  boss_id,
                                                                                                                                                  taps_count 
                                                                                                                                                  FROM users 
                                                                                                                                                  WHERE user_id = ${userId}`)).rows[0];
        const currentLevels = formatArray(task_levels)
        console.log(currentLevels)
        const tasksData = (await db.query(`SELECT * FROM game_tasks WHERE (id, level) IN (${currentLevels}) ORDER BY id ASC`)).rows;
        const tasksNames = (await db.query(`SELECT * FROM game_tasks_names`)).rows;
     
        const progress = [first_task_damage, potions_used, crit_count, boss_id-1, hits_in_row, taps_count,  coins - current_coins]
        let tasks = []
        for (let i = 0; i < tasksData.length; i++) {
            const next = {
                id: i,
                name: tasksNames[i].name,
                level: task_levels[i],
                maxLevel: process.env.UPGRADES_MAX_LEVEL,
                type: tasksData[i].type,
                progress: progress[i],
                goal: tasksData[i].cond,
                reward: tasksData[i].reward
            }
            tasks.push(next)
        }
        const resData = {
            tasks: tasks
        }

        console.log(resData)
        return resData;
    }

    async earn(userId) {
        const { task_levels, crit_count, coins, current_coins, first_task_damage, potions_used, hits_in_row, boss_id, taps_count } = (await db.query(`SELECT task_levels, 
                                                                                                                                                  crit_count, 
                                                                                                                                                  coins, 
                                                                                                                                                  current_coins, 
                                                                                                                                                  first_task_damage, 
                                                                                                                                                  potions_used, 
                                                                                                                                                  hits_in_row, 
                                                                                                                                                  boss_id,
                                                                                                                                                  taps_count 
                                                                                                                                                  FROM users 
                                                                                                                                                  WHERE user_id = ${userId}`)).rows[0];
        const currentLevels = formatArray(task_levels)
        console.log(currentLevels)
        const tasksData = (await db.query(`SELECT * FROM game_tasks WHERE (id, level) IN (${currentLevels}) ORDER BY id ASC`)).rows;
        const tasksNames = (await db.query(`SELECT * FROM game_tasks_names`)).rows;
     
        const progress = [first_task_damage, potions_used, crit_count, boss_id-1, hits_in_row, coins - current_coins, taps_count]
        let tasks = []
        for (let i = 0; i < tasksData.length; i++) {
            const next = {
                id: i,
                name: tasksNames[i].name,
                level: task_levels[i],
                maxLevel: process.env.UPGRADES_MAX_LEVEL,
                type: tasksData[i].type,
                progress: progress[i],
                goal: tasksData[i].cond,
                reward: tasksData[i].reward
            }
            tasks.push(next)
        }
        const resData = {
            tasks: tasks
        }

        console.log(resData)
        return resData;
    }
}

function formatUpgradeArray(arr) {
    const formattedElements = arr.map((val, index) => `(${index}, ${val == process.env.UPGRADES_MAX_LEVEL ? val : val+1})`);
    return formattedElements.join(', ');
}

function formatArray(arr) {
    const formattedElements = arr.map((val, index) => `(${index+1}, ${val == process.env.UPGRADES_MAX_LEVEL ? val : val+1})`);
    return formattedElements.join(', ');
}

export default new DataService();