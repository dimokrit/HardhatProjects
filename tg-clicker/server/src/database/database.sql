DROP TABLE IF EXISTS users;
CREATE TABLE users (
  user_id BIGINT DEFAULT NULL,
  uuid TEXT DEFAULT NULL,
  user_name TEXT,
  photo_url TEXT,
  lang VARCHAR(20),
  premium BOOL,

  level INT DEFAULT 0,
  reward_day INT DEFAULT 1,
  daily_rewarded BOOL DEFAULT FALSE,
  last_login_time INT DEFAULT 0,
  current_user_hp INT DEFAULT NULL,
  boss_id INT DEFAULT 1,
  current_boss_hp INT DEFAULT 0,
  damage INT DEFAULT 1,
  hp_bonus INT DEFAULT 0,

  task_levels INT[] DEFAULT ARRAY[0, 0, 0, 0, 0, 0, 0],
  crit_chance INT DEFAULT 10,
  first_task_time INT DEFAULT 0,
  first_task_damage INT DEFAULT 0,
  crit_count INT DEFAULT 0,
  potions_used INT DEFAULT 0,
  hits_in_row INT DEFAULT 0,
  taps_count INT DEFAULT 0,
  regen_bonus INT DEFAULT 0,

  coins INT DEFAULT 0,
  current_coins INT DEFAULT 0,
  guild_coins INT DEFAULT 0,

  potions INT DEFAULT 10,
  time_potion_used INT DEFAULT 0,

  start_regen_time INT DEFAULT 0,
  regened_amount INT DEFAULT 0,

  upgrades_levels INT[] DEFAULT ARRAY[0, 0, 0, 0, 0, 0, 0, 0, 0],
  coins_per_hour INT DEFAULT 0,
  ready_to_claim INT DEFAULT 0,
  last_claim_time INT DEFAULT 0,

  guild_id BIGINT DEFAULT 0,
  refferal TEXT,
  ref_count INT DEFAULT 0,
  ref_link TEXT,
  friends TEXT[],

  task_status BOOL[] DEFAULT ARRAY[FALSE, FALSE, FALSE, FALSE, FALSE],
	PRIMARY KEY(user_id)
);

DROP TABLE IF EXISTS bosses;
CREATE TABLE bosses (
  boss_id INT,
  boss_hp INT,
  boss_damage INT,
  user_base_damage INT,
  user_hp INT,
  regen_hp INT,
  regen_time INT
);

INSERT INTO bosses (boss_id, boss_hp, boss_damage, user_base_damage, user_hp, regen_hp, regen_time) 
VALUES (1, 20000, 10, 1, 500, 10, 480),
      (2, 150000, 20, 1, 500, 10, 480),
      (3, 400000, 25, 1, 500, 10, 480),
      (4, 1000000, 30, 1, 500, 10, 480);

DROP TABLE IF EXISTS guild_bonus;
CREATE TABLE guild_bonus (
  min_rating INTEGER,
  damage_bonus INTEGER,
  hp_bonus INTEGER
);
INSERT INTO guild_bonus (min_rating, damage_bonus, hp_bonus) 
VALUES (0, 1, 20),
       (1000000, 2, 40),
       (3000000, 3, 60),
       (100000000, 4, 80),
       (200000000, 5, 100);

DROP TABLE IF EXISTS guilds;
CREATE TABLE guilds (
  guild_id BIGINT,
  name varchar(255) DEFAULT NULL,
  channel_url varchar(255) DEFAULT NULL,
  photo_url varchar(255) DEFAULT NULL,
  owner_id INTEGER DEFAULT NULL,
  owner varchar(255) DEFAULT NULL,
  coins INT DEFAULT 0,
  users_count INT DEFAULT 1,
  ref_link varchar(255) DEFAULT NULL,
  PRIMARY KEY(guild_id)
);

DROP TABLE IF EXISTS level_bonus;
CREATE TABLE level_bonus (
  level INTEGER,
  coin_limit INTEGER
);
INSERT INTO level_bonus (level, coin_limit) 
VALUES (1, 2000),
       (2, 6000),
       (3, 9000),
       (4, 18000),
       (5, 36000),
       (6, 72000),
       (7, 128000),
       (8, 256000),
       (9, 512000),
       (10, 1024000),
       (11, 2048000),
       (12, 4096000),
       (13, 8192000),
       (14, 16384000),
       (15, 32768000);

DROP TABLE IF EXISTS daily_reward;
CREATE TABLE daily_reward (
  day INTEGER,
  reward INTEGER
);
INSERT INTO daily_reward (day, reward) 
VALUES (1, 500),
       (2, 1000),
       (3, 2000),
       (4, 4000),
       (5, 8000),
       (6, 16000),
       (7, 32000),
       (8, 64000);

DROP TABLE IF EXISTS upgrades_names;
CREATE TABLE upgrades_names (
  id INTEGER,
  name TEXT
);
INSERT INTO upgrades_names (id, name) 
VALUES (0, 'Trade caravan'),
       (1, 'Minerals Mine'),
       (2, 'Search for Artifacts'),
       (3, 'Black market'),
       (4, 'Rune of Wealth'),
       (5, 'Dwemerite Trade'),
       (6, 'Gnome Exchange'),
       (7, 'Troll Forge'),
       (8, 'Traders Guild');


DROP TABLE IF EXISTS upgrades;
CREATE TABLE upgrades (
  id INTEGER,
  level INTEGER,
  cost INTEGER,
  coins_per_hour INTEGER
);
INSERT INTO upgrades (id, level, cost, coins_per_hour) 
VALUES (0, 1, 9, 1),     (1, 1, 54, 15),     (2, 1, 143, 40),
       (0, 2, 30, 5),    (1, 2, 113, 19),    (2, 2, 344, 57),
       (0, 3, 62, 8),    (1, 3, 202, 25),    (2, 3, 710, 86),
       (0, 4, 105, 10),  (1, 4, 335, 32),    (2, 4, 1350, 130),
       (0, 5, 159, 13),  (1, 5, 528, 41),    (2, 5, 2470, 190),
       (0, 6, 225, 15),  (1, 6, 808, 54),    (2, 6, 4350, 290),
       (0, 7, 302, 18),  (1, 7, 1208, 70),   (2, 7, 7510, 440),
       (0, 8, 390, 20),  (1, 8, 1775, 91),   (2, 8, 12730, 650),
       (0, 9, 489, 23),  (1, 9, 2574, 118),  (2, 9, 21300, 980),
       (0, 10, 600, 25),  (1, 10, 3692, 154),  (2, 10, 35250, 1470),
       (0, 11, 722, 28), (1, 11, 5250, 200), (2, 11, 57830, 2200),

       (3, 1, 191, 50),     (4, 1, 436, 120),     (5, 1, 518, 140),
       (3, 2, 490, 81),    (4, 2, 1100, 180),    (5, 2, 1300, 220),
       (3, 3, 1080, 130),    (4, 3, 2300, 300),    (5, 3, 2900, 350),
       (3, 4, 2190, 210),  (4, 4, 4500, 430),    (5, 4, 5900, 570),
       (3, 5, 4260, 330),  (4, 5, 8600, 670),    (5, 5, 11600, 910),
       (3, 6, 8000, 530),  (4, 6, 15600, 1040),    (5, 6, 21700, 1450),
       (3, 7, 14700, 850),  (4, 7, 27800, 1610),   (5, 7, 40000, 2320),
       (3, 8, 26700, 1370),  (4, 8, 48700, 2500),   (5, 8, 72000, 3710),
       (3, 9, 47600, 2190),  (4, 9, 144000, 6000),  (5, 9, 228000, 9500),
       (3, 10, 84000, 3500),  (4, 10, 244100, 9300), (5, 10, 399000, 15200),
       
       (6, 1, 710, 190),     (7, 1, 1000, 290),     (8, 1, 2200, 600),
       (6, 2, 1800, 300),    (7, 2, 2900, 500),    (8, 2, 6100, 1000),
       (6, 3, 3995, 480),    (7, 3, 6500, 800),    (8, 3, 14200, 1700),
       (6, 4, 8100, 770),  (7, 4, 13700, 1000),    (8, 4, 31000, 3000),
       (6, 5, 15800, 1240),  (7, 5, 27500, 2000),    (8, 5, 64000, 5000),
       (6, 6, 29800, 1980),  (7, 6, 53000, 3600),    (8, 6, 127000, 8500),
       (6, 7, 54700, 3170),  (7, 7, 101000, 5900),   (8, 7, 249000, 14400),
       (6, 8, 99000, 5080),  (7, 8, 189000, 9700),   (8, 8, 478000, 24500),
       (6, 9, 176700, 8130),  (7, 9, 348000, 16000),  (8, 9, 1323000, 55000),
       (6, 10, 312000, 13000), (7, 10, 576000, 24000), (8, 10, 2171000, 83000);

DROP TABLE IF EXISTS game_tasks_names;
CREATE TABLE game_tasks_names (
  id INTEGER,
  name TEXT
);
INSERT INTO game_tasks_names (id, name) 
VALUES (0, 'Fury of Golems'),
       (1, 'Potions Master'),
       (2, 'Critical hit'),
       (3, 'Boss Killer'),
       (4, 'Blind luck'),
       (5, 'The Hero`s Path'),
       (6, 'First among Equals');


DROP TABLE IF EXISTS game_tasks;
CREATE TABLE game_tasks (
  id INTEGER,
  type VARCHAR(5),
  level INTEGER,
  cond INTEGER,
  reward INTEGER
);
INSERT INTO game_tasks (id, type, level, cond, reward) 
VALUES (1, 'dam', 1, 12000, 1),    (2, 'heal', 1, 3, 10),     (3, 'crit', 1, 500, 1),
       (1, 'dam', 2, 24000, 1),    (2, 'heal', 2, 4, 50),     (3, 'crit', 2, 600, 2),
       (1, 'dam', 3, 48000, 1),    (2, 'heal', 3, 5, 50),   (3, 'crit', 3, 1800, 3),
       (1, 'dam', 4, 96000, 1),    (2, 'heal', 4, 10, 50),   (3, 'crit', 4, 2000, 4),
       (1, 'dam', 5, 240000, 1),   (2, 'heal', 5, 25, 100),   (3, 'crit', 5, 2350, 1),
       (1, 'dam', 6, 480000, 1),  (2, 'heal', 6, 50, 100),   (3, 'crit', 6, 2600, 2),
       (1, 'dam', 7, 960000, 1),  (2, 'heal', 7, 50, 100),   (3, 'crit', 7, 2850, 3),
       (1, 'dam', 8, 1440000, 1),  (2, 'heal', 8, 50, 200),   (3, 'crit', 8, 3100, 4),
       (1, 'dam', 9, 2400000, 1),  (2, 'heal', 9, 50, 500),   (3, 'crit', 9, 3450, 5),
       (1, 'dam', 10, 38400000, 1), (2, 'heal', 10, 50, 500),  (3, 'crit', 10, 3800, 5),
       (1, 'dam', 11, 38400000, 1), (2, 'heal', 11, 50, 500),  (3, 'crit', 11, 3800, 5),

       (4, 'heal', 1, 1, 10),    (5, 'dam', 1, 50, 1),     (6, 'reg', 1, 100, 1),
       (4, 'heal', 2, 2, 10),    (5, 'dam', 2, 100, 1),     (6, 'reg', 2, 1000, 1),
       (4, 'heal', 3, 3, 30),    (5, 'dam', 3, 150, 1),     (6, 'reg', 3, 10000, 3),
       (4, 'heal', 4, 4, 50),    (5, 'dam', 4, 200, 1),    (6, 'reg', 4, 100000, 5),
       (4, 'heal', 5, 5, 50),    (5, 'dam', 5, 250, 1),    (6, 'reg', 5, 200000, 5),
       (4, 'heal', 6, 6, 100),    (5, 'dam', 6, 300, 1),    (6, 'reg', 6, 400000, 5),
       (4, 'heal', 7, 7, 50),    (5, 'dam', 7, 350, 1),    (6, 'reg', 7, 900000, 5),
       (4, 'heal', 8, 8, 50),    (5, 'dam', 8, 400, 1),    (6, 'reg', 8, 2000000, 10),
       (4, 'heal', 9, 9, 100),    (5, 'dam', 9, 450, 1),    (6, 'reg', 9, 5000000, 10),
       (4, 'heal', 10, 10, 100),   (5, 'dam', 10, 500, 1),   (6, 'reg', 10, 11000000, 10),
       (4, 'heal', 11, 10, 100),   (5, 'dam', 11, 500, 1),   (6, 'reg', 11, 11000000, 10),
       
       (7, 'heal', 1, 500, 1),    
       (7, 'heal', 2, 5000, 1),   
       (7, 'heal', 3, 50000, 3),
       (7, 'heal', 4, 150000, 5), 
       (7, 'heal', 5, 300000, 5),
       (7, 'heal', 6, 600000, 5),
       (7, 'heal', 7, 1000000, 5),
       (7, 'heal', 8, 3000000, 5), 
       (7, 'heal', 9, 50000000, 5), 
       (7, 'heal', 10, 100000000, 5),
       (7, 'heal', 11, 100000000, 5);


DELETE FROM users WHERE user_id = 777;
INSERT INTO users (user_id, uuid, user_name, current_user_hp, current_boss_hp, ref_link) VALUES (777, '777', 'Antonio Banderos', 500, 15000, 'refka');

DROP TABLE IF EXISTS earn;
CREATE TABLE earn (
  id INTEGER,
  name TEXT,
  icon TEXT,
  url TEXT,
  reward INTEGER,
  banner TEXT
);

INSERT INTO earn (id, name, icon, url, reward, banner) 
VALUES (0, 'FOLLOW INSTAGRAM', '', '', 4000, 'default'),
       (1, 'JOIN DISCORD', '', '', 4000, 'default'),
       (2, 'FOLLOW X', '', '', 4000, 'default'),
       (3, 'SUBSCRIBE YOUTUBE', '', '', 4000, 'default');


DELETE FROM users WHERE user_id = 778;
INSERT INTO users (user_id, uuid, user_name, current_user_hp, current_boss_hp, ref_link) VALUES (778, '778', 'Maxim Tester', 500, 15000, 'refka');
INSERT INTO guilds (guild_id, name, channel_url, photo_url, owner_id, owner, ref_link) VALUES (888888, 'TEST GUILD', 'URL', 'PHOTO_URL', 778, 'Maxim Tester', 'refka');