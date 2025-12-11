-- Initialisation de la session
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";

-- Création de la base de données
CREATE DATABASE IF NOT EXISTS `dna_db`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;

USE `dna_db`;

-- Table `elements`
CREATE TABLE `elements` (
  `name` varchar(50) NOT NULL,
  `icon` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table `characters`
CREATE TABLE `characters` (
  `id` varchar(10) NOT NULL,
  `name` varchar(100) NOT NULL,
  `element` varchar(50) NOT NULL,
  `image_icon_url` varchar(255) DEFAULT NULL,
  `image_card_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_characters_element` (`element`),
  CONSTRAINT `fk_characters_element` FOREIGN KEY (`element`) REFERENCES `elements` (`name`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table `weapons`
CREATE TABLE `weapons` (
  `id` varchar(10) NOT NULL,
  `name` varchar(100) NOT NULL,
  `element` varchar(50) DEFAULT NULL,
  `weapon_type` varchar(50) NOT NULL,
  `damage_type` varchar(50) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `base_atk` decimal(8,2) DEFAULT NULL,
  `max_atk` decimal(8,2) DEFAULT NULL,
  `crit_chance_pct` decimal(5,2) DEFAULT NULL,
  `crit_damage_pct` decimal(5,2) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_weapons_element` (`element`),
  CONSTRAINT `fk_weapons_element` FOREIGN KEY (`element`) REFERENCES `elements` (`name`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table `users`
CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin') NOT NULL DEFAULT 'user',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_users_username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table `character_weapons`
CREATE TABLE `character_weapons` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `character_id` varchar(10) NOT NULL,
  `weapon_id` varchar(10) NOT NULL,
  `is_best_in_slot` tinyint(1) NOT NULL DEFAULT 0,
  `notes` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_character_weapon` (`character_id`,`weapon_id`),
  KEY `fk_character_weapons_weapon` (`weapon_id`),
  CONSTRAINT `fk_character_weapons_character` FOREIGN KEY (`character_id`) REFERENCES `characters` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_character_weapons_weapon` FOREIGN KEY (`weapon_id`) REFERENCES `weapons` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- INSERTS
-- Données de la table `elements`
INSERT INTO `elements` (`name`, `icon`) VALUES
('Anemo', 'assets/images/elements/anemo.png'),
('Electro', 'assets/images/elements/electro.png'),
('Hydro', 'assets/images/elements/hydro.png'),
('Lumino', 'assets/images/elements/lumino.png'),
('Neutral', NULL),
('Pyro', 'assets/images/elements/pyro.png'),
('Umbro', 'assets/images/elements/umbro.png');

-- Données de la table `characters`
INSERT INTO `characters` (`id`, `name`, `element`, `image_icon_url`, `image_card_url`) VALUES
('c001', 'Main Character - M', 'Lumino', 'assets/images/characters/lg-png-2000-2000/mc-male', 'assets/images/characters/sm-png-500-500/mc-male'),
('c002', 'Main Character - F', 'Lumino', 'assets/images/characters/lg-png-2000-2000/mc-female', 'assets/images/characters/sm-png-500-500/mc-female'),
('c003', 'Berenica', 'Umbro', 'assets/images/characters/lg-png-2000-2000/berenica', 'assets/images/characters/sm-png-500-500/berenica'),
('c004', 'Outsider', 'Anemo', 'assets/images/characters/lg-png-2000-2000/outsider', 'assets/images/characters/sm-png-500-500/outsider'),
('c005', 'Sibylle', 'Electro', 'assets/images/characters/lg-png-2000-2000/sibylle', 'assets/images/characters/sm-png-500-500/sibylle'),
('c006', 'Lynn', 'Pyro', 'assets/images/characters/lg-png-2000-2000/lynn', 'assets/images/characters/sm-png-500-500/lynn'),
('c007', 'Rhythm', 'Electro', 'assets/images/characters/lg-png-2000-2000/rhythm', 'assets/images/characters/sm-png-500-500/rhythm'),
('c008', 'Daphne', 'Anemo', 'assets/images/characters/lg-png-2000-2000/daphne', 'assets/images/characters/sm-png-500-500/daphne'),
('c009', 'Randy', 'Electro', 'assets/images/characters/lg-png-2000-2000/randy', 'assets/images/characters/sm-png-500-500/randy'),
('c010', 'Hellfire', 'Pyro', 'assets/images/characters/lg-png-2000-2000/hellfire', 'assets/images/characters/sm-png-500-500/hellfire'),
('c011', 'Truffle and Filbert', 'Anemo', 'assets/images/characters/lg-png-2000-2000/truffle-and-filbert', 'assets/images/characters/sm-png-500-500/truffle-and-filbert'),
('c012', 'Lisbell', 'Lumino', 'assets/images/characters/lg-png-2000-2000/lisbell', 'assets/images/characters/sm-png-500-500/lisbell'),
('c013', 'Rebecca', 'Hydro', 'assets/images/characters/lg-png-2000-2000/rebecca', 'assets/images/characters/sm-png-500-500/rebecca'),
('c014', 'Tabethe', 'Hydro', 'assets/images/characters/lg-png-2000-2000/tabethe', 'assets/images/characters/sm-png-500-500/tabethe'),
('c015', 'Psyche', 'Anemo', 'assets/images/characters/lg-png-2000-2000/psyche', 'assets/images/characters/sm-png-500-500/psyche'),
('c016', 'Fina', 'Lumino', 'assets/images/characters/lg-png-2000-2000/fina', 'assets/images/characters/sm-png-500-500/fina'),
('c017', 'Phantasio', 'Umbro', 'assets/images/characters/lg-png-2000-2000/phantasio', 'assets/images/characters/sm-png-500-500/phantasio'),
('c018', 'Lady Nifle', 'Lumino', 'assets/images/characters/lg-png-2000-2000/lady-nifle', 'assets/images/characters/sm-png-500-500/lady-nifle'),
('c019', 'Margie', 'Pyro', 'assets/images/characters/lg-png-2000-2000/margie', 'assets/images/characters/sm-png-500-500/margie'),
('c020', 'Yale & Oliver', 'Pyro', 'assets/images/characters/lg-png-2000-2000/yale-and-oliver', 'assets/images/characters/sm-png-500-500/yale-and-oliver');

-- Données de la table `weapons`
INSERT INTO `weapons` (`id`, `name`, `element`, `weapon_type`, `damage_type`, `description`, `base_atk`, `max_atk`, `crit_chance_pct`, `crit_damage_pct`, `image_url`) VALUES
('w001', 'Arclight Apocalypse', 'Neutral', 'Bow', 'Smash', 'Skill Duration (+15% / 18% / 21% / 24% / 27% / 30%). Landing a CRIT hit with this weapon randomly grants other allies one of the following for 16s : (+10% / 12% / 14% / 16% / 18% / 20%) ATK, (+10% / 12% / 14% / 16% / 18% / 20%) DEF, (+7.5% / 9% / 10.5% / 12% / 13.5% / 15%) Skill Damage or (+10% / 12% / 14% / 16% /18% / 20%) Skill Duration.', 18.00, 225.94, 26.00, 220.00, '/assets/images/weapons/arclight-apocalypses.png'),
('w002', 'Aurate Yore', 'Neutral', 'Dual Blades', 'Smash', 'CRIT Damage (+62.5% / 74.4% / 86.8% / 99.2% / 112.5% / 125%). Sliding attacks with this weapon gain (+75% / 90% / 105% / 120% / 135% / 150% ) CRIT Chance.', 18.00, 225.94, 24.00, 215.00, '/assets/images/weapons/aurate-yore.png'),
('w003', 'Blade Amberglow', 'Neutral', 'Sword', 'Smash', 'Character ATK (+60% / 72% / 84% / 96% / 108% / 120%).', 19.00, 238.49, 25.00, 200.00, '/assets/images/weapons/blade-amberglow.png'),
('w004', 'Blast Artistry', 'Umbro', 'Shotgun', 'Smash', 'Character ATK (+50.0% / 60% / 70% / 80% / 90% / 100%). Charging fires a special bullet that travels slowly and explodes after a short delay, dealing AoE damage. Tap-firing bullets can trigger its early detonation on contact. When an Umbro character casts their Ultimate, grants (+20.0% / 24% / 28% / 32% / 36% / 40%) Skill Efficiency for 15.0s', 15.00, 188.28, 15.00, 165.00, '/assets/images/weapons/blade-artistry.png'),
('w005', 'Bluecurrent Pulse', 'Neutral', 'Dual Pistols', 'Spike', 'Skill Duration (+15% / 18% / 21% / 24% / 27% / 30%). When it\'s projectiles hit enemies or the environment, they bounce once. When dealing damage with this weapon, increases Dual Pistols Damage by (45% / 54% / 63% / 72% / 81% / 90%) for (15s / 18s / 21s / 24s / 27s / 30s).', 19.00, 238.49, 20.00, 225.00, '/assets/images/weapons/bluecurrent-pulse.png'),
('w006', 'Day of Sacred Verdict', 'Neutral', 'Shotgun', 'Slash', 'CRIT Damage (+62.5% / 75% / 87.5% / 100% / 112.5% / 125%). Fired projectiles track the crosshair. When dealing damage with this weapon, the farther the target, the higher the damage, up to a maximum increase of (45.0% / 54% / 63% / 72% / 81% / 90%).', 17.00, 213.39, 20.00, 200.00, '/assets/images/weapons/day-of-scared-verdict.png'),
('w007', 'Daybreak Hymn', 'Neutral', 'Assault Rifle', 'Spike', 'Multishot (+37.5% / 45% / 52.5% / 60% / 67.5% / 75%). When dealing damage with this weapon, the lower the remaining Ammo percentage, the higher the damage dealt, up to a maximum increase of (45% / 54% / 63% / 72% / 81% / 90%), with full effect when the Ammo count is below 20%.', 18.00, 225.94, 26.00, 245.00, '/assets/images/weapons/daybreak-hymn.png'),
('w008', 'Destructo', 'Neutral', 'Grenade Launcher', 'Smash', 'Skill Range (+36% / 43.2% / 50.4% / 57.6% / 64.8% / 72%).', 18.00, 225.94, 20.00, 180.00, '/assets/images/weapons/destructo.png'),
('w009', 'Dreamweaver\'s Feather', 'Lumino', 'Assault Rifle', 'Slash', 'Skill Range (+30% / 36% / 42% / 48% / 54% / 60%). When a Lumino character deals additional damage, it will have a 30% chance to grant 1 stack that increases ATK for the nearby teammates by (9% / 10.8% / 12.6% / 14.4% / 16.2% / 18%) for 15s, up to 10 stacks.', 15.00, 188.28, 24.00, 240.00, '/assets/images/weapons/dreamweavers-feather.png'),
('w010', 'Elpides Abound', 'Anemo', 'Polearm', 'Slash', 'Resolve (+5.0% / 6% / 7% / 8% / 9% / 10%). After an Anemo character uses their Ultimate Skill, grants [Thousand Winds\' Blessing]: increases Resolve by (8.0% / 9.6% / 11.2% / 12.8% / 14.4% / 16%) and ATK Speed by (15.0% / 18% / 21% / 24% / 27% / 30%) for 15.0s. Each instance of Skill Damage or Ranged Weapon Damage extends the duration by 0.2s.', 22.00, 276.15, 23.00, 250.00, '/assets/images/weapons/elpides-abound.png'),
('w011', 'Embla Inflorescence', 'Lumino', 'Bow', 'Slash', 'Skill Range (+30% / 36% / 42% / 48% / 54% / 60%). While charging, gradually locks onto nearby enemies. Upon release, fires tracking arrows at all locked targets. When a Lumino character deals Skill Damage, grants (+35% / 42% / 49% / 56% / 63% / 70%) Skill DMG for 6s.', 15.00, 188.28, 22.00, 220.00, '/assets/images/weapons/embla-inflorescence.png'),
('w012', 'Entropic Singularity', 'Neutral', 'Pistol', 'Slash', 'Trigger Probability (+75.0% / 90% / 105% / 120% / 135% / 150%). Each shot with this weapon has a chance (based on its Weapon Trigger Probability) to fire an extra projectile at no Ammo cost, dealing AoE Damage equal to (50.0% / 60% / 70% / 80% / 90% / 100%) of its ATK.', 16.00, 200.84, 20.00, 210.00, '/assets/images/weapons/entropic-singularity.png'),
('w013', 'Excresduo', 'Neutral', 'Dual Pistols', 'Spike', 'Skill Damage (+24% / 28.8% / 33.6% / 38.4% / 43.2% / 48%).', 21.00, 263.60, 20.00, 220.00, '/assets/images/weapons/excresduo.png'),
('w014', 'Exiled Fangs', 'Neutral', 'Dual Blades', 'Slash', 'ATK Speed (+25% / 30% / 35% /40% / 45% / 50%). When dealing damage with this weapon triggers Bonus Effect, if the user\'s HP percentage is below 25%, there\'s a 45% chance to restore (1.5% / 1.8% / 2.1% / 2.4% / 3.7% / 3%) of the character\'s Max HP.', 21.00, 263.60, 16.00, 210.00, '/assets/images/weapons/exiled-fangs.png'),
('w015', 'Exiled Thunderwyrm', 'Electro', 'Assault Rifle', 'Spike', 'Trigger Probability (+75% / 90% / 105% / 120% / 135% / 150%). Fires a beam that can ricochet off the target and hits up to 4 enemies within range. When an Electro character triggers bonus effects with this weapon, the user gains (+45% / 54% / 63% / 81% / 90%) Weapon Damage for 10s.', 15.00, 188.28, 25.00, 220.00, '/assets/images/weapons/exiled-thunderwyrm.png'),
('w016', 'Fathomless Sharkgaze', 'Neutral', 'Dual Blades', 'Spike', 'Skill Range (+36% / 43.2% / 50.4% / 57.6% / 64.8% / 72%).', 20.00, 251.04, 20.00, 235.00, '/assets/images/weapons/fathomless-sharkgaze.png'),
('w017', 'Flamme De Epuration', 'Neutral', 'Assault Rifle', 'Slash', 'Trigger Probability (+75% / 90% / 105% / 120% / 135% / 150%). When this weapon triggers a bonus effect on hit, there is (30% / 36% / 42% / 48% / 54% / 60%) chance to reload 1 projectile.', 19.00, 238.49, 15.00, 200.00, '/assets/images/weapons/flamme-de-epuration.png'),
('w018', 'Guixu Ratchet', 'Neutral', 'Grenade Launcher', 'Slash', 'CRIT Damage (+62.5% / 75% / 87.5% / 100% / 112.5% / 125%). When its projectiles hit enemies or the environment, they split into 2 additional projectiles that continue to travel. After switching to this weapon, increases Multishot by (38.0% / 45.6% / 53.2% / 60.8% / 68.4% / 73% ), which decreases over time. This effect can only be triggered once every 10s and is removed when switching to another weapon.', 16.00, 200.84, 22.00, 215.00, '/assets/images/weapons/guixu-ratchet.png'),
('w019', 'Ingenious Tactics', 'Neutral', 'Sword', 'Slash', 'DEF (+50% / 60% / 70% / 80% / 90% / 100%). When dealing damage with this weapon triggers Bonus Effect, there\'s a (25% / 30% / 35% / 40% / 45% / 50%) chance to decrease the target\'s Shield by 350% of the user\'s DEF.', 18.00, 225.94, 20.00, 200.00, '/assets/images/weapons/ingenious-tactics.png'),
('w020', 'Ironforger', 'Neutral', 'Greatsword', 'Slash', 'CRIT Chance (+50% / 60% / 70% / 80% / 90% / 100%). When dealing damage with this weapon triggers Bonus Effect, there is a (2.1% / 2.94% / 3.36% / 3.78% / 4.2%) chance to increase the Combo Level to maximum.', 18.00, 225.94, 20.00, 205.00, '/assets/images/weapons/ironforger.png'),
('w021', 'Momiji Itteki', 'Neutral', 'Katana', 'Slash', 'CRIT Damage (+62.5% / 74.4% / 86.8% / 99.2% / 112.5% / 125%). When dealing damage with this weapon, increase Damage Dealt by (9.0% / 10.8% / 12.6% / 14.4% / 16.2% / 18%), with an additional 9.0% increase per Combo Level.', 19.00, 238.49, 22.00, 225.00, '/assets/images/weapons/momiji-itteki.png'),
('w022', 'Osteobreaker', 'Neutral', 'Assault Rifle', 'Spike', 'Skill Duration (+18% / 21.6% / 25.2% / 28.8% / 32.4% / 36%).', 17.00, 213.39, 23.00, 225.00, '/assets/images/weapons/osteobreaker.png'),
('w023', 'Punitive Inferno', 'Pyro', 'Greatsword', 'Smash', 'Max HP (+50% / 60% / 70% / 80% / 90% / 100%). When a Pyro character takes damage, grants (+15% / 18% / 21% / 24% / 27% / 30%) Skill Duration for 8s (up to 3 stacks).', 19.00, 238.49, 24.00, 205.00, '/assets/images/weapons/punitive-inferno.png'),
('w024', 'Pyrothirst', 'Neutral', 'Greatsword', 'Smash', 'Skill Duration (+18% / 21.6% / 25.2% / 28.8% / 32.4% / 36%).', 17.00, 213.39, 24.00, 210.00, '/assets/images/weapons/pyrothirst.png'),
('w025', 'Remanent Reminiscence', 'Neutral', 'Sword', 'Spike', 'ATK Range (+1.0 / 1.2 / 1.4 / 1.6 / 2.0). Landing a CRIT with this weapon has a (33.0% / 39.6% / 46.2% / 52.8% / 59.4% / 66%) chance to restore 3.0 Sanity. Can trigger once every 0.5s.', 17.00, 213.39, 30.00, 210.00, '/assets/images/weapons/remanent-reminiscence.png'),
('w026', 'Rendhusk', 'Neutral', 'Pistol', 'Smash', 'Character ATK (+60% / 62% / 84% / 96% / 108% / 120%).', 15.00, 188.28, 25.00, 230.00, '/assets/images/weapons/rendhusk.png'),
('w027', 'Sacred Favour', 'Neutral', 'Katana', 'Spike', 'Character ATK (+50.0% / 60% / 70% / 80% / 90% / 100%). Charged Attacks with this weapon grant (+75.0% / 90% / 105% / 120% / 135% / 150%) CRIT Damage for 6.0s. Effect is removed when switching weapons.', 20.00, 251.04, 20.00, 250.00, '/assets/images/weapons/sacred-favour.png'),
('w028', 'Sacrosanct Chorus', 'Neutral', 'Dual Pistols', 'Slash', 'CRIT Chance (+50% / 60% / 70% / 80% / 90% / 100%). Dealing CRIT Damage with this weapon grants (+6.2% / 7.44% / 8.68% / 9.92% / 11.16% / 12.5%) Multishot for 12s (up to 10 stacks). Effect is removed when switching weapons.', 18.00, 225.94, 25.00, 200.00, '/assets/images/weapons/sacrosanct-chorus.png'),
('w029', 'Sacrosanct Decree', 'Neutral', 'Pistol', 'Spike', 'Multishot (+37.5% / 45% / 52.5% / 60% / 67.5% / 75%). When this weapon triggers a bonus effect on hit, increases Melee Weapon DMG by (35.0% / 42% / 49% / 56% / 63% / 70%) for 12.0s.', 18.00, 225.94, 25.00, 205.00, '/assets/images/weapons/sacrosanct-decree.png'),
('w030', 'Screamshot', 'Neutral', 'Shotgun', 'Spike', 'Skill Duration (+18% / 21.6% / 25.2% / 28.8% / 32.4% / 36%).', 18.00, 225.94, 20.00, 180.00, '/assets/images/weapons/screamshot.png'),
('w031', 'Searing Sandwhisper', 'Neutral', 'Bow', 'Spike', 'ATK Speed (+25% / 30% / 35% / 40% / 45% / 50%). Each enemy struck by a single arrow increases the arrow\'s damage by (9% / 10.8% / 12.6% / 14.4% / 16.2% / 18%), with a maximum increase of (45% / 54% / 63% / 72% / 81% / 90%).', 17.00, 213.39, 19.00, 200.00, '/assets/images/weapons/searing-sandwhisper.png'),
('w032', 'Shackle of Lonewolf', 'Hydro', 'Sword', 'Spike', 'Trigger Probability (+75.0% / 90% / 105% / 120% / 135% / 150%). When a Hydro character triggers a bonus effect with this weapon, other allies gain (+33.0% / 39.6% / 46.2% / 52.8% / 59.4% / 66%) ATK for 6.0s.', 20.00, 251.04, 22.00, 215.00, '/assets/images/weapons/shackle-of-lonewolf.png'),
('w033', 'Silent Sower', 'Neutral', 'Shotgun', 'Smash', 'CRIT Chance (+50.0% / 60% / 70% / 80% / 90% / 100%). The projectiles it shoots attaches to the target and explodes after 3s. Projectiles attached to one another in the same position will stack up, increasing the damage and the range of the incoming explosion. When 1 / 2 / 3 projectiles are stacked, it deals (217.0% / 227.75% / 238.5% / 249.25% / 260%) / (383.0% / 398.4% / 413.8% / 429.2% / 444.6% / 460%) / (592.0% / 615.6% / 639.2% / 662.8% / 686.4% / 710%) of the original damage.', 16.00, 200.84, 16.00, 180.00, '/assets/images/weapons/silent-sower.png'),
('w034', 'Silverwhite Edict', 'Neutral', 'Grenade Launcher', 'Spike', 'ATK Speed (+25% / 30% / 35% / 40% / 45% / 50%). When this weapon triggers a bonus effect on hit, grants (+5.0% / 6% / 7% / 8% / 9% / 10%) ATK Speed for 12.0s (up to 10.0 stacks). Effect is removed when switching weapons.', 19.00, 238.49, 25.00, 235.00, '/assets/images/weapons/silverwhite-edict.png'),
('w035', 'Siren\'s Kiss', 'Neutral', 'Polearm', 'Spike', 'Skill Range (+30% / 36% / 42% / 48% / 54% / 60%). When performing Normal Attacks with this weapon, grants a (3.6% / 4.32% / 5.04% / 5.76% / 6.48% / 7.2%) ATK Speed Increase for 15.0s (up to 12.0 stacks). Effect is removed when switching weapons.', 21.00, 263.60, 22.00, 220.00, '/assets/images/weapons/sirens-kiss.png'),
('w036', 'Soulrend', 'Neutral', 'Bow', 'Smash', 'Skill Range (+36% / 43.2% / 50.4% / 57.6% / 64.8% / 72%).', 19.00, 238.49, 22.00, 205.00, '/assets/images/weapons/soulrend.png'),
('w037', 'Stellar Finality', 'Neutral', 'Grenade Launcher', 'Smash', 'Explosion Range (+0.2 / 0.26 / 0.32 / 0.38 / 0.44 / 0.5). When it\'s projectiles explode, they split into 6 additional projectiles that explode and deal damage. When defeating a target with this weapon, grants 1 stack that increased CRIT Damage by (8.8% / 10.56% / 12.32% / 14.08% / 15.84% / 17.5%) for 15s, up to 10 stacks. This effect is removed when switching to another weapon.', 14.00, 175.75, 20.00, 240.00, '/assets/images/weapons/stellar-finality.png'),
('w038', 'Submerged Serenade', 'Neutral', 'Assault Rifle', 'Slash', 'CRIT Damage (+62.5% / 75% / 87.5% / 100% / 112.5% / 125%). Projectiles that hit the environment or travel a certain distance return to the user\'s position and increase the Ammo Count by 1. for each additional Ammo Count gained, the damage dealt by this weapon is increased by (4.5% / 5.4% / 6.3% / 7.2% / 8.1% / 9%), up to a maximum increase of (45% / 54% / 63% / 72% / 81% / 90%).', 16.00, 200.84, 22.00, 220.00, '/assets/images/weapons/submerged-serenade.png'),
('w039', 'Tetherlash', 'Neutral', 'Whipsword', 'Smash', 'Skill Duration (+18% / 21.6% / 25.2% / 28.8% / 32.4% / 36%).', 19.00, 238.49, 18.00, 215.00, '/assets/images/weapons/tetherlash.png'),
('w040', 'Undying Oneiros', 'Neutral', 'Whipsword', 'Spike', 'Max HP (+50.0% / 60% / 70% / 80% / 90% / 100%). When this weapon triggers a bonus effect on hit, grants (+8.6% / 10.32% / 12.04% / 13.76% / 15.48% / 17.2%) Max HP for 15.0s (up to 10.0 stacks).', 21.00, 263.60, 20.00, 225.00, '/assets/images/weapons/undying-oneiros.png'),
('w041', 'Vernal Jade Halberd', 'Neutral', 'Polearm', 'Spike', 'ATK Speed (+25.0% / 30% / 35% / 40% / 45% / 50%). Deals (+45.0% / 54% / 63% / 72% / 81% / 90%) damage to targets afflicted with bonus effects.', 18.00, 225.94, 24.00, 215.00, '/assets/images/weapons/vernal-jade-halberd.png'),
('w042', 'Viridis Reefs', 'Neutral', 'Whipsword', 'Spike', 'Trigger Probability (+75.0% / 90% / 105% / 120% / 135% / 150%). Charged Attacks with this weapon grants (+44.0% / 52.8% / 61.6% / 70.4% / 79.2% / 88%) ATK Speed for 6.0s. Effect is removed when switching weapons.', 17.00, 213.39, 26.00, 235.00, '/assets/images/weapons/viridis-reefs.png'),
('w043', 'Wandering Rose', 'Neutral', 'Sword', 'Spike', 'ATK Speed (+25.0% / 30% / 35% / 40% / 45% / 50%). When a performing a Charged Attack with this weapon, there is a (28.0% / 33.6% / 39.2% / 44.8% / 50.4% / 56%) chance to reduce Resonance Support CD by 3.0s.', 20.00, 251.04, 23.00, 210.00, '/assets/images/weapons/wandering-rose.png'),
('w044', 'Wanewraith', 'Neutral', 'Polearm', 'Slash', 'Skill Damage (+24% / 28.8% / 33.6% / 38.4% / 43.2% / 48%).', 19.00, 238.49, 25.00, 200.00, '/assets/images/weapons/wanewraith.png'),
('w045', 'Withershade', 'Neutral', 'Katana', 'Smash', 'Skill Range (+36% / 43.2% / 50.4% / 57.6% / 64.8% / 72%).', 17.00, 213.39, 23.00, 215.00, '/assets/images/weapons/withershade.png');

-- Données de la table `users`
INSERT INTO `users` (`id`, `username`, `password`, `role`, `created_at`) VALUES
(1, 'adrien', '$2b$10$vzDwZ3VRDKSaNuSUBSJvDuTUYchkxqDMe0uiKdfyL5usUk9wxjjJ.', 'admin', '2025-12-03 09:56:56'),
(2, 'testuser', '$2b$10$e0J.pA3BfAjxtW7B7ehhZuWY9nTraeoAfEiKwA5.iQ/gS7/LzmK8e', 'user', '2025-12-03 13:40:15'),
(3, 'exemple', '$2b$10$/NktYrbO2FUogdxRY284ueZNLxvdEz94mHlHxEY2y6yrnEIhunMbC', 'user', '2025-12-04 11:48:38'),
(4, 'test', '$2b$10$nC9LBDR..kL9RzlTD94k3uylsdDwsjW5diAaHsQjNwlGGy6O1aQPO', 'user', '2025-12-04 11:54:56'),
(5, 'test2', '$2b$10$v/P8adXHRXroQhPlOUyqbO.q.pua8lVJBTG5HlNzsU7Ujpymn3rnC', 'user', '2025-12-09 10:29:51');

-- Données de la table `character_weapons`
INSERT INTO `character_weapons` (`id`, `character_id`, `weapon_id`, `is_best_in_slot`, `notes`) VALUES
(1, 'c003', 'w004', 1, 'Build Umbro : Berenica + Blast Artistry'),
(2, 'c005', 'w015', 1, 'Build Electro : Sibylle + Exiled Thunderwyrm'),
(3, 'c001', 'w001', 0, 'Main Character M peut utiliser Arclight Apocalypse');