import db from '../database/index.js';
import ApiError from '../exceptions/api.error.js';
import dotenv from 'dotenv';
import axios from 'axios';
import jwt from 'jsonwebtoken';
dotenv.config();
const limit = process.env.LIST_LIMIT;
class UserService {

    async register(user_id, uuid, photo_url, user_name, ref_link, lang, premium) {
        const bossData = (await db.query(`SELECT user_hp, boss_hp FROM bosses WHERE boss_id = 1`)).rows[0];
        const newUserData = `(${user_id}, '${uuid}', '${photo_url}', '${user_name}', ${bossData.user_hp}, ${bossData.boss_hp}, '${ref_link}', '${lang}', ${premium})`;
        await db.query(`INSERT INTO users (user_id, uuid, photo_url, user_name, current_user_hp, current_boss_hp, ref_link, lang, premium) VALUES ${newUserData}`);

        const resData = {
            messege: `${user_name} is REGISTERED`
        };
        console.log(`${user_name} is REGISTERED`)
        return resData;
    }

    async login(userId) {
        const now = nowUnix();
        console.log(userId)
        const userData = (await db.query(`SELECT * FROM users WHERE user_id = ${userId}`)).rows[0];
        let currentUserHP;
        let hpTaskBonus = userData.hp_bonus

        const bossData = (await db.query(`SELECT * FROM bosses WHERE boss_id = ${userData.boss_id}`)).rows[0];
        let maxHP = bossData.user_hp + hpTaskBonus;
        currentUserHP = userData.current_user_hp

        // Daily reward
        const nowDay = new Date().getDay()
        const lastLoginTime = userData.last_login_time
        const lastLoginDay = lastLoginTime == 0 ? nowDay : new Date(lastLoginTime * 1000).getDay()
        let rewardDay = userData.reward_day
        let dailyReward = false
        if (lastLoginDay != nowDay || !userData.daily_rewarded) {
            if (nowDay - lastLoginDay == 1 || (nowDay == 1 && lastLoginDay == 7)) {
                rewardDay = userData.reward_day + 1 > 8 ? 1 : userData.reward_day + 1
            } else {
                rewardDay = 1
            }
            userData.daily_rewarded = false
            dailyReward = true
        }

        //Firs task check
        if (now - userData.first_task_time > 3600) {
            await db.query(`UPDATE users SET first_task_time = ${now}, first_task_damage = 0 WHERE user_id = ${userId}`);
        }

        // Claculate ready to claim
        let readyToClaim = 0
        const afkPeriod = now - userData.last_login_time
        if (afkPeriod >= 10800)
            readyToClaim = userData.coins_per_hour * 3
        else {
            const coinsPerSecond = Math.floor(userData.coins_per_hour / 3600)
            if (coinsPerSecond != 0)
                readyToClaim = coinsPerSecond * afkPeriod
            else {
                const coinsPerMinute = Math.floor(userData.coins_per_hour / 60)
                if (coinsPerMinute != 0)
                    readyToClaim = coinsPerMinute * Math.floor(afkPeriod / 60)
                else if (afkPeriod > 3600)
                    readyToClaim = userData.coins_per_hour * Math.floor(afkPeriod / 3600)
            }
        }


        // Check guild
        let guildPhotoUrl
        let baseDamage = userData.damage + userData.level
        if (userData.guild_id != 0) {
            const { coins, photo_url } = (await db.query(`SELECT coins, photo_url FROM guilds WHERE guild_id = ${userData.guild_id}`)).rows[0];
            const { hp_bonus, damage_bonus } = (await db.query(`SELECT * FROM guild_bonus WHERE min_rating <= ${coins} ORDER BY min_rating DESC`)).rows[0];
            maxHP += hp_bonus;
            guildPhotoUrl = photo_url
            baseDamage += damage_bonus
        }

        // Calculate regenerated HP
        if (userData.start_regen_time != 0) {
            const regenCount = Math.floor((now - userData.start_regen_time) / bossData.regen_time)
            const regenAmount = regenCount >= 1 ? regenCount * (bossData.regen_hp + userData.regen_bonus) : 0;
            if (regenAmount > 0) {
                currentUserHP = Math.min(currentUserHP + regenAmount, maxHP);
                const startRegenTime = currentUserHP == maxHP ? 0 : userData.start_regen_time + regenCount * bossData.regen_time
                await db.query(`UPDATE users SET start_regen_time = ${startRegenTime}, current_user_hp = ${currentUserHP} WHERE user_id = ${userId}`);
            }
        }

        // Get level bonus
        let leftPoint
        let rightPoint
        const limits = (await db.query(`SELECT coin_limit FROM level_bonus WHERE level = ${userData.level} OR level = ${userData.level} + 1`)).rows
        if (userData.level == 0) {
            leftPoint = 0
            rightPoint = limits[0].coin_limit
        } else {
            leftPoint = limits[0].coin_limit
            rightPoint = limits[1].coin_limit
        }
        const progress = Math.floor((userData.coins - leftPoint) / (rightPoint - leftPoint) * 10000)

        await db.query(`UPDATE users SET last_login_time = ${now},
                                         coins = coins + ${readyToClaim},
                                         current_coins = current_coins + ${readyToClaim},
                                         daily_rewarded = ${userData.daily_rewarded},
                                         reward_day = ${rewardDay}
                                         WHERE user_id = ${userId}`);

        const resData = {
            bossId: userData.boss_id,
            bossHP: bossData.boss_hp,
            currentBossHP: userData.current_boss_hp,
            userHP: maxHP,
            level: userData.level,
            baseDamage: baseDamage,
            days: rewardDay,
            dailyReward: dailyReward,
            progress: progress,
            photo_url: userData.photo_url,
            currentUserHP: currentUserHP,
            coins: userData.current_coins + readyToClaim,
            readyToClaim: readyToClaim,
            coinsPerHour: userData.coins_per_hour,
            potions: userData.potions,
            regenHP: bossData.regen_hp + userData.regen_bonus,
            regenTime: bossData.regen_time,
            guildId: userData.guild_id,
            guildPhotoUrl: guildPhotoUrl,
            refLink: userData.ref_link,
            tasks: userData.task_status
        };
        console.log(resData)
        return resData;
    }

    async hit(userId) {
        const userData = (await db.query(`SELECT * FROM users WHERE user_id = ${userId}`)).rows[0];
        let bossId = userData.boss_id
        if (!userData) invalidId()
        const bossData = (await db.query(`SELECT * FROM bosses WHERE boss_id = ${bossId}`)).rows[0];
        const now = nowUnix();
        if (userData.refferal && userData.coins == 0 && userData.current_user_hp == bossData.user_hp) {
            await db.query(`UPDATE users SET coins = coins + 2000, 
                                             current_coins = current_coins + 2000, 
                                             friends = array_append(friends, '${userData.uuid}'), 
                                             potions = potions + 1, 
                                             ref_count = ref_count + 1 
                                             WHERE uuid = '${userData.refferal}'`);
        }

        // Check user guild
        let currentUserHP = userData.current_user_hp
        let hpBonus = 0;
        let damageBonus = 0;
        let totalGuildCoins = 0;
        if (userData.guild_id != 0) {
            const { coins } = (await db.query(`SELECT coins FROM guilds WHERE guild_id = ${userData.guild_id}`)).rows[0];
            const { damage_bonus, hp_bonus } = (await db.query(`SELECT * FROM guild_bonus WHERE min_rating <= ${coins} ORDER BY min_rating DESC`)).rows[0];
            hpBonus = hp_bonus;
            damageBonus = damage_bonus;
            totalGuildCoins = coins;
        }
        let hpTaskBonus = userData.hp_bonus
        let maxHP = bossData.user_hp + hpBonus + hpTaskBonus;

        // Check regen HP
        if (userData.start_regen_time != 0) {
            const regenCount = Math.floor((now - userData.start_regen_time) / bossData.regen_time)
            const regenAmount = regenCount >= 1 ? regenCount * (bossData.regen_hp + userData.regen_bonus) : 0;
            if (regenAmount > 0) {
                currentUserHP = Math.min(currentUserHP + regenAmount, maxHP);
                const startRegenTime = currentUserHP == maxHP ? 0 : userData.start_regen_time + regenCount * bossData.regen_time
                await db.query(`UPDATE users SET start_regen_time = ${startRegenTime}, current_user_hp = ${currentUserHP} WHERE user_id = ${userId}`);
            }
        }

        if (currentUserHP == 0)
            throw ApiError.BadRequest(`You are dead, try later`);

        // Check entry and damage
        let damage = userData.damage
        const entry = randomNumber(0, 100) > 4;
        const double_d = now - userData.time_potion_used <= 10 ? 2 : 1
        const hitPower = entry ? (damageBonus + userData.level + damage) * double_d : 0;
        const crit = randomNumber(0, 100) < userData.crit_chance;
        const currentDamege = crit ? hitPower * 3 : hitPower;
        let currentBossHP = userData.current_boss_hp - currentDamege;

        // Check first task
        let currentTaskLevels = userData.task_levels
        const currentLevels = formatArray(currentTaskLevels)
        const taskData = (await db.query(`SELECT * FROM game_tasks WHERE (id, level) IN (${currentLevels}) ORDER BY id ASC`)).rows;
        let firstTaskTime = userData.first_task_time
        let firsTaskDamage = userData.first_task_damage + currentDamege
        if (now - userData.first_task_time > 3600) {
            firstTaskTime = now
            firsTaskDamage = currentDamege
        } else {
            if (firsTaskDamage >= taskData[0].cond) {
                currentTaskLevels[0]++
                damage += taskData[0].reward
            }
        }

        // Check crit task
        let critChance = userData.crit_chance
        let critCount = userData.crit_count
        if (crit) {
            critCount++
            if (critCount >= taskData[2].cond) {
                currentTaskLevels[2]++
                critChance += taskData[2].reward
                critCount = 0
            }
        }

        // Check hit in row task
        let hitsInRow = userData.hits_in_row
        if (entry) {
            hitsInRow++
            if (hitsInRow >= taskData[4].cond) {
                currentTaskLevels[4]++
                damage += taskData[4].reward
                hitsInRow = 0
            }
        } else {
            hitsInRow = 0
        }
        // Check tap task
        let tapsCount = userData.taps_count
        tapsCount++
        if (tapsCount > taskData[5].cond) {
            currentTaskLevels[5]++
            hpTaskBonus += taskData[5].reward
        }

        // Missed
        let bossDamage = 0;
        let coins = userData.coins;
        let currentCoins = userData.current_coins;
        let kill = false;
        let newBoss = {};
        if (!entry) {
            currentBossHP = userData.current_boss_hp;
            bossDamage = currentBossHP >= bossData.boss_damage / 2 ? bossData.boss_damage : bossData.boss_damage * 2;
            currentUserHP = currentUserHP - bossDamage <= 0 ? 0 : currentUserHP - bossDamage;
            let startRegenTime = userData.start_regen_time == 0 ? nowUnix() : userData.start_regen_time;
            await db.query(`UPDATE users SET current_user_hp = ${currentUserHP},
                                             start_regen_time = ${startRegenTime},
                                             hits_in_row = ${hitsInRow}, 
                                             taps_count = ${tapsCount} 
                                             WHERE user_id = ${userId}`);
        } else {
            // Entry
            let coinAmount = 0;
            if (currentBossHP <= 0) {
                // Boss died
                kill = true;
                bossId = bossData.boss_id + 1;
                currentTaskLevels[3]++
                hpTaskBonus += taskData[3].reward
                const newBossData = (await db.query(`SELECT boss_hp, user_hp, regen_hp, regen_time FROM bosses WHERE boss_id = ${bossId}`)).rows[0];

                newBoss = {
                    bossId: bossId,
                    bossHP: newBossData.boss_hp,
                    userHP: newBossData.user_hp + hpBonus,
                    regenHP: newBossData.regen_hp,
                    regenTime: newBossData.regen_time
                };
                coinAmount = currentBossHP;
                currentBossHP = newBossData.boss_hp;
            } else
                coinAmount = currentDamege;

            coins += coinAmount;
            currentCoins += coinAmount

            // Update guild coins
            let guildCoins = 0
            if (userData.guild_id != 0) {
                await db.query(`UPDATE guilds SET coins = ${totalGuildCoins + coinAmount} WHERE guild_id = ${userData.guild_id}`);
                guildCoins = userData.guild_coins + coinAmount
            }

            await db.query(`UPDATE users SET boss_id = ${bossId},
                                             current_boss_hp = ${currentBossHP}, 
                                             coins = ${coins}, 
                                             guild_coins = ${guildCoins}, 
                                             current_coins = ${currentCoins},
                                             task_levels = '{${currentTaskLevels.toString()}}',
                                             damage = ${damage},
                                             hp_bonus = ${hpTaskBonus},
                                             first_task_time = ${firstTaskTime},
                                             first_task_damage = ${firsTaskDamage},
                                             crit_chance = ${critChance},
                                             crit_count = ${critCount},
                                             hits_in_row = ${hitsInRow},
                                             taps_count = ${tapsCount}
                                             WHERE user_id = ${userId}`);
        }

        let level = userData.level
        let leftPoint
        let rightPoint
        if (level <= 15) {
            const limits = (await db.query(`SELECT * FROM level_bonus WHERE level = ${level} OR level = ${level} + 1 OR level = ${level} + 2 ORDER BY level ASC`)).rows
            if (level == 0) {
                leftPoint = 0
                rightPoint = limits[0].coin_limit
            } else {
                leftPoint = limits[0].coin_limit
                rightPoint = limits[1].coin_limit
            }
            if (coins >= rightPoint) {
                leftPoint = rightPoint
                rightPoint = level == 0 ? limits[1].coin_limit : limits[2].coin_limit
                level++
                await db.query(`UPDATE users SET level = ${level} WHERE user_id = ${userId}`);
            }
        }
        const progress = userData.level <= 15 ? Math.floor((coins - leftPoint) / (rightPoint - leftPoint) * 10000) : 10000
        const baseDamage = userData.damage + damageBonus + userData.level
        maxHP = bossData.user_hp + hpBonus + hpTaskBonus
        console.log(currentUserHP)
        const resData = {
            currentDamege: currentDamege,
            level: userData.level,
            baseDamage: baseDamage,
            progress: progress,
            potions: userData.potions,
            bossDamage: bossDamage,
            currentUserHP: currentUserHP,
            maxHP: maxHP,
            currentBossHP: currentBossHP,
            coins: currentCoins,
            crit: crit,
            kill: kill,
            newBoss: newBoss
        };

        return resData;
    }

    async heal(userId) {
        let { boss_id, current_user_hp, potions, guild_id, hp_bonus, task_levels, potions_used } = (await db.query(`SELECT boss_id, current_user_hp, potions, guild_id, hp_bonus, task_levels, potions_used FROM users WHERE user_id = ${userId}`)).rows[0];
        if (!boss_id) invalidId()
        const { user_hp } = (await db.query(`SELECT user_hp FROM bosses WHERE boss_id = ${boss_id}`)).rows[0];
        let used = false;
        if (potions != 0) {

            let totalUserHP = user_hp + hp_bonus;
            if (guild_id != 0) {
                const { coins } = (await db.query(`SELECT coins FROM guilds WHERE guild_id = ${guild_id}`)).rows[0];
                const { hp_bonus } = (await db.query(`SELECT * FROM guild_bonus WHERE min_rating <= ${coins} ORDER BY min_rating DESC`)).rows[0];
                totalUserHP += hp_bonus;
            }
            if (current_user_hp < totalUserHP) {
                potions_used++
                let currentTaskLevel = task_levels[1]
                const taskData = (await db.query(`SELECT * FROM game_tasks WHERE id = 2 AND level = ${currentTaskLevel + 1}`)).rows[0];
                if (potions_used >= taskData.cond) {
                    hp_bonus += taskData.reward
                    currentTaskLevel++;
                }
                console.log(Math.floor(totalUserHP / 3), "   ", totalUserHP)
                current_user_hp = current_user_hp + Math.floor(totalUserHP / 3) > totalUserHP ? totalUserHP : current_user_hp + Math.floor(totalUserHP / 3);
                potions--;
                used = true;
                await db.query(`UPDATE users SET current_user_hp = ${current_user_hp},
                                                 potions = ${potions},
                                                 hp_bonus = ${hp_bonus},
                                                 task_levels[2] = ${currentTaskLevel},
                                                 potions_used = ${potions_used}, 
                                                 time_potion_used = ${nowUnix()} 
                                                 WHERE user_id = ${userId}`);
            }
        }

        const resData = {
            used: used,
            currentUserHP: current_user_hp,
            potions: potions
        };

        console.log(resData)
        return resData;
    }

    async task(userId, taskId) {
        const data = (await db.query(`SELECT task_status, current_coins FROM users WHERE user_id = ${userId}`)).rows[0];
        if (!data.task_status[taskId]) {
            data.task_status[taskId] = true;
            const reward = 4000;
            data.current_coins += reward
            await db.query(`UPDATE users SET task_status[${taskId + 1}] = True,
                                             coins = coins + ${reward},
                                             current_coins = ${data.current_coins}
                                             WHERE user_id = ${userId}`);
        }

        const resData = {
            status: data.task_status[taskId],
            coins: data.current_coins
        };
        return resData;
    }

    async auth(authHeader) {
        const token = authHeader && authHeader.split(' ')[1];
        let _userId
        if (!token) {
            throw ApiError.BadRequest('Unauthorized');
        }
        if (token != '777') {
            jwt.verify(token, process.env.JWT_KEY, async (err, res) => {
                if (err)
                    throw ApiError.BadRequest('Forbidden');
                _userId = res.id
            });
        } else _userId = 777

        const resData = {
            userId: _userId
        };

        console.log(`${_userId} is AUTHORIZED`)
        return resData;
    }

    async jwt(userId) {
        try {
            const user = (await db.query(`SELECT * FROM users WHERE user_id = ${userId}`)).rows[0];
            if (!user)
                throw ApiError.BadRequest('Invalid user id')
            const accessToken = jwt.sign({ id: userId, time: nowUnix() }, process.env.JWT_KEY);
            return ({ jwt: accessToken });
        } catch (error) {
            console.error('Error generate jwt ', error);
        }
    }

    async photo(url) {
        try {
            const fullUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/photos/${url}`
            const response = await axios.get(fullUrl, { responseType: 'arraybuffer' });
            const imageBuffer = Buffer.from(response.data, 'binary');
            const base64Image = imageBuffer.toString('base64');
            return ({ image: base64Image });
        } catch (error) {
            console.error('Error loading image');
            throw ApiError.BadRequest(`Error loading image`);
        }
    }

    async daily(userId) {
        try {
            const { reward_day, daily_rewarded } = (await db.query(`SELECT daily_rewarded, reward_day FROM users WHERE user_id = ${userId}`)).rows[0];
            if (!daily_rewarded) {
                const { reward } = (await db.query(`SELECT reward FROM daily_reward WHERE day = ${reward_day}`)).rows[0];
                await db.query(`UPDATE users SET coins = coins + ${reward},
                                                 current_coins = current_coins + ${reward},
                                                 daily_rewarded = ${!daily_rewarded}
                                                 WHERE user_id = ${userId}`);
            }
            return ({ success: true });
        } catch (error) {
            console.error('Error get reward');
        }
    }

    async upgrade(userId, upgradeId) {
        try {
            if (upgradeId < 0 || upgradeId >= process.env.UPGRADES_COUNT)
                throw ApiError.BadRequest(`Invalid upgrade id`);

            let { current_coins, coins_per_hour, upgrades_levels, coins, task_levels, regen_bonus } = (await db.query(`SELECT regen_bonus, 
                                                                                                                              current_coins, 
                                                                                                                              coins, 
                                                                                                                              task_levels, 
                                                                                                                              coins_per_hour, 
                                                                                                                              upgrades_levels 
                                                                                                                              FROM users 
                                                                                                                              WHERE user_id = ${userId}`)).rows[0];
            let upgradeLevel = upgrades_levels[upgradeId]
            if (upgradeLevel >= process.env.UPGRADES_MAX_LEVEL)
                throw ApiError.BadRequest(`Max upgrade level`);

            const upgradeData = (await db.query(`SELECT cost, coins_per_hour FROM upgrades WHERE id = ${upgradeId} AND (level = ${upgradeLevel} OR level = ${upgradeLevel + 1} OR level = ${upgradeLevel + 2})  ORDER BY level ASC`)).rows;
            let success = false
            const currentUpgrade = upgradeData[0]
            const nextUpgrade = upgradeData[1]
            const veryNextUpgrade = upgradeData[2] ? upgradeData[2] : null
            let nextCost = nextUpgrade.cost

            const oldCoinPerHour = upgradeLevel == 0 ? 0 : currentUpgrade.coins_per_hour
            if (current_coins >= nextUpgrade.cost) {
                success = true
                console.log("COINS ", current_coins)
                current_coins = upgradeLevel == 0 ? current_coins - currentUpgrade.cost : current_coins - nextUpgrade.cost
                console.log("COST ", nextUpgrade.cost)
                const taskData = (await db.query(`SELECT * FROM game_tasks WHERE id = 7 AND level = ${task_levels[6] + 1}`)).rows[0];
                if (coins - current_coins >= taskData.cond) {
                    task_levels[6]++
                    regen_bonus += taskData.reward
                }
                nextCost = veryNextUpgrade ? veryNextUpgrade.cost : nextUpgrade.cost
                coins_per_hour = coins_per_hour - oldCoinPerHour + nextUpgrade.coins_per_hour
                upgradeLevel++;
                await db.query(`UPDATE users SET current_coins = ${current_coins},
                                                 coins_per_hour = ${coins_per_hour},
                                                 upgrades_levels[${upgradeId + 1}] = ${upgradeLevel},
                                                 task_levels[7] = ${task_levels[6]},
                                                 regen_bonus = ${regen_bonus}
                                                 WHERE user_id = ${userId}`);
            } else 
                throw ApiError.BadRequest(`Not enought coins`);


            const resData = {
                success: success,
                coins: current_coins,
                coinPerHour: upgradeData[1].coins_per_hour,
                coinPerHourUser: coins_per_hour,
                cost: nextCost,
                level: upgradeLevel
            }
            console.log(resData)
            return (resData);
        } catch (error) {
            console.error('Error upgrade: ', error);
        }
    }

    async friends(userId) {
        try {
            const { friends } = (await db.query(`SELECT friends FROM users WHERE user_id = ${userId}`)).rows[0];
            let friensList = []
            if (friends) {
                const formatFriends = '[' + friends.map(element => `'${element}'`).join(', ') + ']';
                friensList = (await db.query(`SELECT user_name, current_coins, photo_url FROM users WHERE uuid LIKE ANY(ARRAY${formatFriends}) ORDER BY coins DESC LIMIT ${limit}`)).rows
            }
            return ({ friends: friensList });
        } catch (error) {
            throw ApiError.BadRequest(`Error get friends`);
        }
    }

}
function formatArray(arr) {
    const formattedElements = arr.map((val, index) => `(${index + 1}, ${val == process.env.UPGRADES_MAX_LEVEL ? val : val + 1})`);
    return formattedElements.join(', ');
}

function nowUnix() {
    return Math.floor(Date.now() / 1000);
}

function randomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

function invalidId() {
    throw ApiError.BadRequest(`Invalid user id`);
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export default new UserService();