// Core Phaser 3 Game Logic: Cat Survivor (Dynamic Battle Arena Edition)

class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        const V = '?v=3.8';
        // Environment & Map Elements
        this.load.image('tile_floor', 'assets/tile_floor.png' + V);
        this.load.image('map_plaza', 'assets/map_plaza.png' + V);
        this.load.image('boundary_wall', 'assets/boundary_wall.png' + V);
        this.load.image('decal_flowers', 'assets/decal_flowers.png' + V);
        this.load.image('decal_manhole', 'assets/decal_manhole.png' + V);
        this.load.image('shadow_char', 'assets/shadow_char.png' + V);
        this.load.image('enemy_threat_ring', 'assets/enemy_threat_ring.png' + V);
        this.load.image('helipad_zone', 'assets/helipad_zone.png' + V);
        this.load.image('cat_chopper', 'assets/cat_chopper.png' + V);
        this.load.image('chopper_rotor', 'assets/chopper_rotor.png' + V);
        this.load.spritesheet('cat_chopper_fly', 'assets/cat_chopper_fly.png' + V, { frameWidth: 128, frameHeight: 104 });
        this.load.spritesheet('fx_chopper_downwash', 'assets/fx_chopper_downwash.png' + V, { frameWidth: 96, frameHeight: 96 });
        this.load.image('cat_barsik', 'assets/cat_barsik.png' + V);
        this.load.image('cat_murzik', 'assets/cat_murzik.png' + V);
        this.load.image('cat_pukhlyash', 'assets/cat_pukhlyash.png' + V);

        // Animated Heroes Spritesheets
        this.load.spritesheet('cat_barsik_run', 'assets/cat_barsik_run.png' + V, { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('cat_barsik_idle', 'assets/cat_barsik_idle.png' + V, { frameWidth: 64, frameHeight: 64 });
        this.load.image('cat_barsik_hurt', 'assets/cat_barsik_hurt.png' + V);

        this.load.spritesheet('cat_murzik_run', 'assets/cat_murzik_run.png' + V, { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('cat_murzik_idle', 'assets/cat_murzik_idle.png' + V, { frameWidth: 64, frameHeight: 64 });
        this.load.image('cat_murzik_hurt', 'assets/cat_murzik_hurt.png' + V);

        this.load.spritesheet('cat_pukhlyash_run', 'assets/cat_pukhlyash_run.png' + V, { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('cat_pukhlyash_idle', 'assets/cat_pukhlyash_idle.png' + V, { frameWidth: 64, frameHeight: 64 });
        this.load.image('cat_pukhlyash_hurt', 'assets/cat_pukhlyash_hurt.png' + V);
        
        // Obstacles & Interactive World Objects
        this.load.image('obstacle_crate', 'assets/obstacle_crate.png' + V);
        this.load.image('obstacle_rock', 'assets/obstacle_rock.png' + V);
        this.load.image('obstacle_bush', 'assets/obstacle_bush.png' + V);
        this.load.image('obstacle_barrel', 'assets/obstacle_barrel.png' + V);
        this.load.image('obstacle_wall_h', 'assets/obstacle_wall_h.png' + V);
        this.load.image('obstacle_wall_v', 'assets/obstacle_wall_v.png' + V);
        this.load.image('obstacle_fence', 'assets/obstacle_fence.png' + V);
        this.load.image('obstacle_monument', 'assets/obstacle_monument.png' + V);

        // Enemies & Bosses (Static fallback + Animated Spritesheets)
        this.load.image('enemy_mouse', 'assets/enemy_mouse.png' + V);
        this.load.image('enemy_dog', 'assets/enemy_dog.png' + V);
        this.load.image('enemy_cucumber', 'assets/enemy_cucumber.png' + V);
        this.load.image('enemy_pigeon', 'assets/enemy_pigeon.png' + V);
        this.load.image('enemy_spitter', 'assets/enemy_spitter.png' + V);
        this.load.image('boss_vacuum', 'assets/boss_vacuum.png' + V);
        this.load.image('boss_bulldozer', 'assets/boss_bulldozer.png' + V);

        this.load.spritesheet('enemy_mouse_walk', 'assets/enemy_mouse_walk.png' + V, { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet('enemy_dog_run', 'assets/enemy_dog_run.png' + V, { frameWidth: 56, frameHeight: 56 });
        this.load.spritesheet('enemy_cucumber_hop', 'assets/enemy_cucumber_hop.png' + V, { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet('enemy_pigeon_fly', 'assets/enemy_pigeon_fly.png' + V, { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet('enemy_spitter_walk', 'assets/enemy_spitter_walk.png' + V, { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet('boss_vacuum_move', 'assets/boss_vacuum_move.png' + V, { frameWidth: 80, frameHeight: 80 });
        this.load.spritesheet('boss_bulldozer_move', 'assets/boss_bulldozer_move.png' + V, { frameWidth: 96, frameHeight: 96 });

        // Projectiles
        this.load.image('proj_fish', 'assets/proj_fish.png' + V);
        this.load.image('proj_yarn', 'assets/proj_yarn.png' + V);
        this.load.image('proj_slipper', 'assets/proj_slipper.png' + V);
        this.load.image('proj_laser', 'assets/proj_laser.png' + V);
        this.load.image('proj_enemy_acid', 'assets/proj_enemy_acid.png' + V);
        this.load.image('aura_wave', 'assets/aura_wave.png' + V);

        // New Weapons & Skills Projectiles
        this.load.image('proj_claw_slash', 'assets/proj_claw_slash.png' + V);
        this.load.image('proj_valerian', 'assets/proj_valerian.png' + V);
        this.load.image('proj_mine', 'assets/proj_mine.png' + V);
        this.load.image('skill_static', 'assets/skill_static.png' + V);

        // Animated Valerian & Mine Spritesheets
        this.load.spritesheet('proj_valerian_spin', 'assets/proj_valerian_spin.png' + V, { frameWidth: 56, frameHeight: 56 });
        this.load.spritesheet('evo_valerian_spin', 'assets/evo_valerian_spin.png' + V, { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('fx_valerian_splash', 'assets/fx_valerian_splash.png' + V, { frameWidth: 96, frameHeight: 96 });
        this.load.spritesheet('fx_valerian_puddle_loop', 'assets/fx_valerian_puddle_loop.png' + V, { frameWidth: 96, frameHeight: 96 });
        this.load.spritesheet('fx_valerian_vortex_loop', 'assets/fx_valerian_vortex_loop.png' + V, { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('proj_mine_sheet', 'assets/proj_mine_sheet.png' + V, { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet('fx_mine_explosion', 'assets/fx_mine_explosion.png' + V, { frameWidth: 96, frameHeight: 96 });

        // Evolutions
        this.load.image('evo_shark', 'assets/evo_shark.png' + V);
        this.load.image('evo_web', 'assets/evo_web.png' + V);
        this.load.image('evo_dome', 'assets/evo_dome.png' + V);
        this.load.image('evo_beam', 'assets/evo_beam.png' + V);
        this.load.image('evo_barrage', 'assets/evo_barrage.png' + V);
        this.load.image('evo_wolverine', 'assets/evo_wolverine.png' + V);
        this.load.image('evo_valerian_storm', 'assets/evo_valerian_storm.png' + V);

        // Drops & FX
        this.load.image('drop_xp', 'assets/drop_xp.png' + V);
        this.load.image('drop_coin', 'assets/drop_coin.png' + V);
        this.load.image('drop_heal', 'assets/drop_heal.png' + V);
        this.load.image('drop_bomb', 'assets/drop_bomb.png' + V);
        this.load.image('drop_clock', 'assets/drop_clock.png' + V);
        this.load.image('drop_chest', 'assets/drop_chest.png' + V);
        this.load.image('fx_dust', 'assets/fx_dust.png' + V);
    }

    create() {
        console.log('[Game] All assets loaded, starting GameScene');
        this.scene.start('GameScene');
    }
}

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    init() {
        this.arenaSize = 2800;
        this.player = null;
        this.selectedHeroId = window.selectedHeroId || 'barsik';
        this.heroConfig = CHARACTERS.find(c => c.id === this.selectedHeroId) || CHARACTERS[0];
        
        // Meta-upgrades & Stats
        this.metaTalents = window.metaTalents || { hp: 0, dmg: 0, speed: 0, greed: 0, magnet: 0 };
        this.maxHp = this.heroConfig.maxHp + (this.metaTalents.hp * 20);
        this.hp = this.maxHp;
        this.baseSpeed = this.heroConfig.speed * (1 + this.metaTalents.speed * 0.08);
        this.speed = this.baseSpeed;
        this.damageMultiplier = 1 + (this.metaTalents.dmg * 0.1);
        this.greedMultiplier = 1 + (this.metaTalents.greed * 0.2);
        this.pickupRadius = 110 * (1 + this.metaTalents.magnet * 0.25);
        this.attackSpeedMultiplier = 1.0;
        this.damageReduction = 0;

        // Run progression
        this.level = 1;
        this.xp = 0;
        this.xpNeeded = 25;
        this.kills = 0;
        this.coins = 0;
        this.survivalTime = 0;
        this.isGameOver = false;
        this.isPaused = false;
        this.invulnerableTimer = 0;
        this.freezeTimer = 0;
        this.activeBoss = null;

        // Dash Ability
        this.dashCooldownTime = 2600;
        this.lastDashTime = -3000;
        this.isDashing = false;
        this.dashDuration = 220;
        this.dashSpeedMultiplier = 3.2;

        // Active Skills & Evolutions
        this.activeSkills = {};
        this.weaponTimers = {};
        this.orbitingSharks = [];
        this.orbitingBeams = [];
        this.valerianPuddles = [];

        // Hardcore mode for Barsik (1st cat)
        this.isHardcoreHero = (this.selectedHeroId === 'barsik');

        // Anti-AFK / Standing still Enrage Tracker
        this.lastPlayerPos = { x: this.arenaSize / 2, y: this.arenaSize / 2 };
        this.afkTimer = 0;
        this.isAfkEnraged = false;
        this.afkWarningCooldown = 0;

        // Starting weapon
        this.addOrUpgradeSkill(this.heroConfig.startingWeapon);

        // Evacuation & Victory Progression
        this.evacTargetTime = this.heroConfig.evacTargetSeconds || 600;
        this.evacTriggered = false;
        this.evacCompleted = false;
        this.isEndlessMode = false;
        this.evacCountdown = 30;
        this.helipad = null;
        this.chopper = null;
        this.chopperRotor = null;
        this.chopperShadow = null;
        this.chopperDownwash = null;
        this.evacIndicator = null;
        this.spawnedBossTimes = new Set();

        // Joystick
        this.joystick = { active: false, startX: 0, startY: 0, currentX: 0, currentY: 0, moveX: 0, moveY: 0 };
    }

    create() {
        // Register character animations
        ['barsik', 'murzik', 'pukhlyash'].forEach(heroId => {
            this.anims.create({
                key: `${heroId}_run`,
                frames: this.anims.generateFrameNumbers(`cat_${heroId}_run`, { start: 0, end: 3 }),
                frameRate: 10,
                repeat: -1
            });
            this.anims.create({
                key: `${heroId}_idle`,
                frames: this.anims.generateFrameNumbers(`cat_${heroId}_idle`, { start: 0, end: 1 }),
                frameRate: 3,
                repeat: -1
            });
        });

        // Register enemy animations
        this.anims.create({
            key: 'mouse_walk',
            frames: this.anims.generateFrameNumbers('enemy_mouse_walk', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'dog_run',
            frames: this.anims.generateFrameNumbers('enemy_dog_run', { start: 0, end: 3 }),
            frameRate: 12,
            repeat: -1
        });
        this.anims.create({
            key: 'cucumber_hop',
            frames: this.anims.generateFrameNumbers('enemy_cucumber_hop', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'pigeon_fly',
            frames: this.anims.generateFrameNumbers('enemy_pigeon_fly', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'spitter_walk',
            frames: this.anims.generateFrameNumbers('enemy_spitter_walk', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'vacuum_move',
            frames: this.anims.generateFrameNumbers('boss_vacuum_move', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'bulldozer_move',
            frames: this.anims.generateFrameNumbers('boss_bulldozer_move', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1
        });

        // Valerian & Meow Mine Animated Effects
        this.anims.create({
            key: 'valerian_spin',
            frames: this.anims.generateFrameNumbers('proj_valerian_spin', { start: 0, end: 7 }),
            frameRate: 18,
            repeat: -1
        });
        this.anims.create({
            key: 'valerian_storm_spin',
            frames: this.anims.generateFrameNumbers('evo_valerian_spin', { start: 0, end: 7 }),
            frameRate: 20,
            repeat: -1
        });
        this.anims.create({
            key: 'valerian_splash',
            frames: this.anims.generateFrameNumbers('fx_valerian_splash', { start: 0, end: 7 }),
            frameRate: 18,
            repeat: 0
        });
        this.anims.create({
            key: 'valerian_puddle_anim',
            frames: this.anims.generateFrameNumbers('fx_valerian_puddle_loop', { start: 0, end: 5 }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'valerian_vortex_anim',
            frames: this.anims.generateFrameNumbers('fx_valerian_vortex_loop', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'mine_arm_pulse',
            frames: this.anims.generateFrameNumbers('proj_mine_sheet', { start: 1, end: 3 }),
            frameRate: 6,
            repeat: -1
        });
        this.anims.create({
            key: 'mine_explosion',
            frames: this.anims.generateFrameNumbers('fx_mine_explosion', { start: 0, end: 4 }),
            frameRate: 16,
            repeat: 0
        });

        // Helicopter Evacuation Animations
        this.anims.create({
            key: 'chopper_flight',
            frames: this.anims.generateFrameNumbers('cat_chopper_fly', { start: 0, end: 7 }),
            frameRate: 14,
            repeat: -1
        });
        this.anims.create({
            key: 'chopper_downwash_anim',
            frames: this.anims.generateFrameNumbers('fx_chopper_downwash', { start: 0, end: 7 }),
            frameRate: 14,
            repeat: -1
        });

        // 1. Arena Bounds & Background
        this.physics.world.setBounds(0, 0, this.arenaSize, this.arenaSize);
        const tile = this.add.tileSprite(this.arenaSize / 2, this.arenaSize / 2, this.arenaSize, this.arenaSize, 'tile_floor');
        tile.setDepth(0);

        // Central Royal Cat Sanctuary Plaza
        const plaza = this.add.image(this.arenaSize / 2, this.arenaSize / 2, 'map_plaza');
        plaza.setDepth(1);

        // Ground Decals (Flower patches, ancient stone manholes)
        this.setupMapDecals();

        // Fortress Boundary Walls along the perimeter
        this.setupBoundaryWalls();

        // 2. Physics Groups
        this.enemies = this.physics.add.group();
        this.projectiles = this.physics.add.group();
        this.enemyProjectiles = this.physics.add.group();
        this.meowMines = this.physics.add.group();
        this.drops = this.physics.add.group();
        this.obstacles = this.physics.add.staticGroup();
        this.bushes = this.physics.add.staticGroup();

        // 3. Generate Procedural Obstacles & Landmarks
        this.generateMapObstacles();

        // 4. Player Creation (Spawned in front of the Cat Guardian Monument)
        const startX = this.arenaSize / 2;
        const startY = this.arenaSize / 2 + 75;
        this.playerShadow = this.add.image(startX, startY + 18, 'shadow_char');
        this.playerShadow.setDepth(7);
        this.playerShadow.setAlpha(0.65);
        this.player = this.physics.add.sprite(startX, startY, `cat_${this.selectedHeroId}_idle`);
        this.player.play(`${this.selectedHeroId}_idle`);
        this.player.hurtTimer = 0;
        this.player.setCollideWorldBounds(true);
        this.player.setDepth(10);
        this.player.body.setSize(34, 40);
        this.player.body.setOffset(15, 17);

        // Aura visual sprite attached to player
        this.auraVisual = this.add.sprite(startX, startY, 'aura_wave');
        this.auraVisual.setDepth(9);
        this.auraVisual.setAlpha(0);

        // 5. Camera Follow
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        this.cameras.main.setBounds(0, 0, this.arenaSize, this.arenaSize);

        // 6. Controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = {
            up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
            dash: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
        };

        this.wasd.dash.on('down', () => this.tryDash());
        this.setupVirtualJoystick();

        // 7. Collisions & Overlaps
        this.physics.add.collider(this.player, this.obstacles);
        this.physics.add.collider(this.enemies, this.obstacles);
        this.physics.add.overlap(this.player, this.bushes, this.handleBushSlow, null, this);
        this.physics.add.overlap(this.player, this.enemies, this.handlePlayerEnemyCollision, null, this);
        this.physics.add.overlap(this.projectiles, this.enemies, this.handleProjectileEnemyHit, null, this);
        this.physics.add.overlap(this.projectiles, this.obstacles, this.handleProjectileObstacleHit, null, this);
        this.physics.add.overlap(this.meowMines, this.enemies, this.handleMineHit, null, this);
        this.physics.add.overlap(this.enemyProjectiles, this.player, this.handleEnemyProjectilePlayerHit, null, this);
        this.physics.add.overlap(this.enemyProjectiles, this.obstacles, (p, o) => p.destroy(), null, this);
        this.physics.add.overlap(this.player, this.drops, (p, d) => this.collectDrop(d), null, this);

        // 8. Timers
        this.spawnTimer = this.time.addEvent({
            delay: this.isHardcoreHero ? 1100 : 1500,
            callback: this.spawnEnemyWave,
            callbackScope: this,
            loop: true
        });

        this.secondTimer = this.time.addEvent({
            delay: 1000,
            callback: this.onSecondTick,
            callbackScope: this,
            loop: true
        });

        this.dustTimer = this.time.addEvent({
            delay: 140,
            callback: this.emitFootstepDust,
            callbackScope: this,
            loop: true
        });

        // Start BGM
        if (window.soundManager) {
            window.soundManager.startMusic();
        }

        const vig = document.getElementById('damage-vignette');
        if (vig) vig.classList.remove('active', 'low-hp-pulse');

        if (window.uiManager) {
            window.uiManager.onGameStart(this);
            window.uiManager.updateHUD();
        }

        if (this.isHardcoreHero) {
            this.time.delayedCall(800, () => {
                this.showDamageText(this.player.x, this.player.y - 50, '💀 ХАРДКОР: БАРСИК 💀', '#ff3333');
            });
        }

        if (window.soundManager) window.soundManager.playMeow();
    }

    setupBoundaryWalls() {
        const sz = this.arenaSize;
        const wallThickness = 18;

        // Top & Bottom fortress walls
        for (let x = 32; x < sz; x += 64) {
            const topW = this.add.image(x, wallThickness, 'boundary_wall');
            topW.setDepth(2);
            const botW = this.add.image(x, sz - wallThickness, 'boundary_wall');
            botW.setDepth(2);
        }
        // Left & Right fortress walls (rotated 90 deg)
        for (let y = 32; y < sz; y += 64) {
            const leftW = this.add.image(wallThickness, y, 'boundary_wall');
            leftW.setAngle(90);
            leftW.setDepth(2);
            const rightW = this.add.image(sz - wallThickness, y, 'boundary_wall');
            rightW.setAngle(90);
            rightW.setDepth(2);
        }

        // Decorative stone boundary line
        const boundsGraphics = this.add.graphics();
        boundsGraphics.lineStyle(6, 0x8a7258, 0.9);
        boundsGraphics.strokeRect(36, 36, sz - 72, sz - 72);
        boundsGraphics.setDepth(3);
    }

    setupMapDecals() {
        const sz = this.arenaSize;
        const center = sz / 2;

        // Spread flower patches
        for (let i = 0; i < 28; i++) {
            const fx = Phaser.Math.Between(80, sz - 80);
            const fy = Phaser.Math.Between(80, sz - 80);
            if (Phaser.Math.Distance.Between(fx, fy, center, center) < 230) continue;
            const decal = this.add.image(fx, fy, 'decal_flowers');
            decal.setDepth(1);
            decal.setAlpha(0.85);
            decal.setRotation(Phaser.Math.FloatBetween(0, Math.PI * 2));
        }

        // Spread manholes
        for (let i = 0; i < 16; i++) {
            const mx = Phaser.Math.Between(100, sz - 100);
            const my = Phaser.Math.Between(100, sz - 100);
            if (Phaser.Math.Distance.Between(mx, my, center, center) < 230) continue;
            const decal = this.add.image(mx, my, 'decal_manhole');
            decal.setDepth(1);
            decal.setAlpha(0.9);
        }
    }

    generateMapObstacles() {
        const center = this.arenaSize / 2;
        const sz = this.arenaSize;

        // 1. Central Sanctuary Monument (Grand Cat Guardian Fountain)
        const monument = this.obstacles.create(center, center - 10, 'obstacle_monument');
        monument.setDepth(4);
        monument.isMonument = true;
        monument.body.setSize(58, 58);
        monument.refreshBody();

        // Helper to add obstacle
        const addObs = (x, y, key, opts = {}) => {
            if (Phaser.Math.Distance.Between(x, y, center, center) < 230) return null;
            if (x < 90 || x > sz - 90 || y < 90 || y > sz - 90) return null;

            const obs = (opts.isBush ? this.bushes : this.obstacles).create(x, y, key);
            obs.setDepth(opts.isBush ? 3 : 4);
            if (opts.isCrate) {
                obs.isCrate = true;
                obs.hp = 30;
                obs.body.setSize(40, 40);
            } else if (opts.isBarrel) {
                obs.isBarrel = true;
                obs.hp = 35;
                obs.body.setSize(38, 38);
            } else if (opts.isWallH) {
                obs.isWall = true;
                obs.body.setSize(76, 28);
            } else if (opts.isWallV) {
                obs.isWall = true;
                obs.body.setSize(28, 76);
            } else if (opts.isFence) {
                obs.isFence = true;
                obs.body.setSize(60, 20);
            } else if (opts.isRock) {
                obs.isRock = true;
                obs.body.setSize(38, 38);
            } else if (opts.isBush) {
                obs.body.setSize(42, 42);
            }
            obs.refreshBody();
            return obs;
        };

        // 2. Structured Themed Quadrants
        // NW Quadrant: "The Royal Gardens" (Hedges, garden stone walls, rocks)
        for (let i = 0; i < 7; i++) {
            const cx = Phaser.Math.Between(180, center - 240);
            const cy = Phaser.Math.Between(180, center - 240);
            addObs(cx, cy, 'obstacle_bush', { isBush: true });
            addObs(cx + 44, cy, 'obstacle_bush', { isBush: true });
            if (Math.random() < 0.6) {
                addObs(cx + 88, cy, 'obstacle_bush', { isBush: true });
            }
            if (Math.random() < 0.5) {
                addObs(cx, cy + 60, 'obstacle_wall_h', { isWallH: true });
            } else {
                addObs(cx - 30, cy + 50, 'obstacle_rock', { isRock: true });
            }
        }

        // NE Quadrant: "Fish Port & Warehouse" (Brick walls, fish barrels, crates)
        for (let i = 0; i < 7; i++) {
            const cx = Phaser.Math.Between(center + 240, sz - 180);
            const cy = Phaser.Math.Between(180, center - 240);
            if (Math.random() < 0.5) {
                addObs(cx, cy, 'obstacle_wall_h', { isWallH: true });
                addObs(cx - 30, cy + 36, 'obstacle_barrel', { isBarrel: true });
                addObs(cx + 30, cy + 36, 'obstacle_crate', { isCrate: true });
            } else {
                addObs(cx, cy, 'obstacle_wall_v', { isWallV: true });
                addObs(cx + 34, cy - 20, 'obstacle_barrel', { isBarrel: true });
                addObs(cx + 34, cy + 24, 'obstacle_barrel', { isBarrel: true });
            }
        }

        // SW Quadrant: "Ancient Catacombs" (Brick walls, boulders, secret caches)
        for (let i = 0; i < 7; i++) {
            const cx = Phaser.Math.Between(180, center - 240);
            const cy = Phaser.Math.Between(center + 240, sz - 180);
            if (Math.random() < 0.5) {
                addObs(cx, cy, 'obstacle_wall_v', { isWallV: true });
                addObs(cx + 48, cy, 'obstacle_rock', { isRock: true });
            } else {
                addObs(cx, cy, 'obstacle_wall_h', { isWallH: true });
                addObs(cx, cy + 44, 'obstacle_rock', { isRock: true });
                addObs(cx + 44, cy + 44, 'obstacle_crate', { isCrate: true });
            }
        }

        // SE Quadrant: "Village Farmstead" (Wooden fences, hay/supply crates, barrels)
        for (let i = 0; i < 7; i++) {
            const cx = Phaser.Math.Between(center + 240, sz - 180);
            const cy = Phaser.Math.Between(center + 240, sz - 180);
            addObs(cx, cy, 'obstacle_fence', { isFence: true });
            if (Math.random() < 0.6) {
                addObs(cx + 56, cy, 'obstacle_fence', { isFence: true });
            }
            if (Math.random() < 0.5) {
                addObs(cx + 20, cy + 38, 'obstacle_crate', { isCrate: true });
            } else {
                addObs(cx + 20, cy + 38, 'obstacle_barrel', { isBarrel: true });
            }
            if (Math.random() < 0.4) {
                addObs(cx - 36, cy + 30, 'obstacle_bush', { isBush: true });
            }
        }

        // 3. Random Scattered Points of Interest across the map
        for (let i = 0; i < 22; i++) {
            const rx = Phaser.Math.Between(150, sz - 150);
            const ry = Phaser.Math.Between(150, sz - 150);
            const roll = Math.random();
            if (roll < 0.25) {
                addObs(rx, ry, 'obstacle_barrel', { isBarrel: true });
            } else if (roll < 0.5) {
                addObs(rx, ry, 'obstacle_crate', { isCrate: true });
            } else if (roll < 0.75) {
                addObs(rx, ry, 'obstacle_rock', { isRock: true });
            } else {
                addObs(rx, ry, 'obstacle_bush', { isBush: true });
            }
        }
    }

    handleBushSlow(player, bush) {
        // Slow down slightly while moving inside bushes
        player.inBush = true;
    }

    handleProjectileObstacleHit(proj, obstacle) {
        if (!proj.active || !obstacle.active) return;

        if (obstacle.isCrate || obstacle.isBarrel) {
            obstacle.hp -= (proj.damage || 20);
            // Splinter shake & hit tint
            obstacle.setTint(obstacle.isBarrel ? 0x88ddff : 0xff9944);
            this.time.delayedCall(80, () => {
                if (obstacle && obstacle.active) obstacle.clearTint();
            });

            if (obstacle.hp <= 0) {
                if (window.soundManager) window.soundManager.playWoodBreak();
                if (obstacle.isBarrel) {
                    const barrelRoll = Math.random();
                    if (barrelRoll < 0.40) {
                        this.spawnDrop(obstacle.x, obstacle.y, true); // Fish heal drop
                    } else if (barrelRoll < 0.75) {
                        const coin = this.drops.create(obstacle.x, obstacle.y, 'drop_coin');
                        coin.setDepth(5);
                        coin.dropType = 'drop_coin';
                        coin.body.setSize(20, 20);
                    } else {
                        const gem = this.drops.create(obstacle.x, obstacle.y, 'drop_xp');
                        gem.setDepth(5);
                        gem.dropType = 'drop_xp';
                        gem.body.setSize(20, 20);
                    }
                } else {
                    const dropRoll = Math.random();
                    if (dropRoll < 0.35) {
                        this.spawnDrop(obstacle.x, obstacle.y, false);
                    } else {
                        const gem = this.drops.create(obstacle.x, obstacle.y, 'drop_xp');
                        gem.setDepth(5);
                        gem.dropType = 'drop_xp';
                        gem.body.setSize(20, 20);
                    }
                }
                obstacle.destroy();
            }
        }

        if (!proj.pierce && !proj.isFish) {
            proj.destroy();
        }
    }

    handleEnemyProjectilePlayerHit(player, proj) {
        if (!proj.active || this.invulnerableTimer > 0 || this.isGameOver) return;
        const px = proj.x;
        const py = proj.y;
        const rawDmg = proj.damage || 22;
        proj.destroy();

        this.applyPlayerDamage(rawDmg, px, py, true, false);
    }

    applyPlayerDamage(rawDmg, sourceX, sourceY, isAcid = false, isBoss = false) {
        if (this.invulnerableTimer > 0 || this.isGameOver) return;

        const actualDmg = Math.max(3, Math.round(rawDmg * (1 - this.damageReduction)));
        this.hp -= actualDmg;
        this.invulnerableTimer = 380; // Crisp 380ms grace period so swarms are dangerous

        // 1. Cat Visual Reactions: Red Flash, Hurt Frame & Squish
        this.player.setTint(0xff1111);
        this.player.hurtTimer = 220;
        this.player.anims.stop();
        this.player.setTexture(`cat_${this.selectedHeroId}_hurt`);
        this.tweens.add({
            targets: this.player,
            scaleX: 1.4,
            scaleY: 0.65,
            duration: 70,
            yoyo: true
        });

        // 2. Physical Knockback Impulse away from attack source
        if (sourceX !== undefined && sourceY !== undefined) {
            const angle = Phaser.Math.Angle.Between(sourceX, sourceY, this.player.x, this.player.y);
            const pushDist = isBoss ? 80 : (isAcid ? 35 : 55);
            const targetX = Phaser.Math.Clamp(this.player.x + Math.cos(angle) * pushDist, 40, this.arenaSize - 40);
            const targetY = Phaser.Math.Clamp(this.player.y + Math.sin(angle) * pushDist, 40, this.arenaSize - 40);
            this.tweens.add({
                targets: this.player,
                x: targetX,
                y: targetY,
                duration: 90,
                ease: 'Cubic.out'
            });
        }

        // 3. Screen Shake & Red Flash
        const shakeDuration = isBoss ? 280 : (isAcid ? 220 : 180);
        const shakeIntensity = isBoss ? 0.038 : (isAcid ? 0.026 : 0.022);
        this.cameras.main.shake(shakeDuration, shakeIntensity);
        this.cameras.main.flash(isBoss ? 130 : 90, 240, 20, 20, false);

        // 4. Full-screen Red Damage Vignette Flash
        const vig = document.getElementById('damage-vignette');
        if (vig) {
            vig.classList.add('active');
            clearTimeout(this.vignetteTimeout);
            this.vignetteTimeout = setTimeout(() => {
                if (vig) vig.classList.remove('active');
            }, 140);

            // Pulsating danger vignette if HP is critically low (<= 35%)
            if (this.hp / this.maxHp <= 0.35) {
                vig.classList.add('low-hp-pulse');
            } else {
                vig.classList.remove('low-hp-pulse');
            }
        }

        // 5. Impact Splashes & Particles
        if (isAcid) {
            for (let i = 0; i < 8; i++) {
                const p = this.add.circle(this.player.x, this.player.y, Phaser.Math.Between(4, 7), 0x2ecc71);
                p.setDepth(16);
                const ang = Phaser.Math.FloatBetween(0, Math.PI * 2);
                const dist = Phaser.Math.Between(25, 55);
                this.tweens.add({
                    targets: p,
                    x: p.x + Math.cos(ang) * dist,
                    y: p.y + Math.sin(ang) * dist,
                    alpha: 0,
                    scale: 0.2,
                    duration: 280,
                    onComplete: () => p.destroy()
                });
            }
        } else {
            const slash = this.add.graphics();
            slash.setDepth(16);
            slash.lineStyle(3, 0xff2222, 1.0);
            slash.lineBetween(this.player.x - 20, this.player.y - 20, this.player.x + 20, this.player.y + 20);
            slash.lineBetween(this.player.x - 25, this.player.y - 10, this.player.x + 15, this.player.y + 30);
            this.tweens.add({
                targets: slash,
                alpha: 0,
                duration: 160,
                onComplete: () => slash.destroy()
            });
        }

        // 6. Audio Feedback
        if (window.soundManager) window.soundManager.playPlayerHurt(isAcid, isBoss);

        // 7. Floating Damage Text
        this.showPlayerDamageText(this.player.x, this.player.y - 32, isAcid ? `-${actualDmg} 🧪` : `-${actualDmg} HP`, isAcid ? '#2ecc71' : '#ff2233');

        // 8. Update HUD & Check Death
        if (window.uiManager) window.uiManager.updateHUD();

        if (this.hp <= 0) {
            this.triggerGameOver();
        }
    }

    showPlayerDamageText(x, y, text, color = '#ff2233') {
        const dmgText = this.add.text(x, y, text, {
            fontSize: '24px',
            fontFamily: 'Impact, Arial, sans-serif',
            fontStyle: 'bold',
            fill: color,
            stroke: '#000000',
            strokeThickness: 5
        });
        dmgText.setOrigin(0.5);
        dmgText.setDepth(25);
        dmgText.setScale(1.4);

        this.tweens.add({
            targets: dmgText,
            scale: 1.0,
            y: y - 40,
            duration: 500,
            ease: 'Back.out',
            onComplete: () => {
                this.tweens.add({
                    targets: dmgText,
                    alpha: 0,
                    duration: 250,
                    onComplete: () => dmgText.destroy()
                });
            }
        });
    }

    setupVirtualJoystick() {
        this.input.on('pointerdown', (pointer) => {
            if (this.isGameOver || this.isPaused) return;
            this.joystick.active = true;
            this.joystick.startX = pointer.x;
            this.joystick.startY = pointer.y;
            this.joystick.currentX = pointer.x;
            this.joystick.currentY = pointer.y;
            this.joystick.moveX = 0;
            this.joystick.moveY = 0;
            if (window.uiManager) window.uiManager.showJoystick(pointer.x, pointer.y);
        });

        this.input.on('pointermove', (pointer) => {
            if (!this.joystick.active) return;
            this.joystick.currentX = pointer.x;
            this.joystick.currentY = pointer.y;
            
            const dx = pointer.x - this.joystick.startX;
            const dy = pointer.y - this.joystick.startY;
            const dist = Math.hypot(dx, dy);
            const maxDist = 55;

            if (dist > 0) {
                const angle = Math.atan2(dy, dx);
                const cappedDist = Math.min(dist, maxDist);
                this.joystick.moveX = Math.cos(angle) * (cappedDist / maxDist);
                this.joystick.moveY = Math.sin(angle) * (cappedDist / maxDist);
                if (window.uiManager) window.uiManager.updateJoystickKnob(Math.cos(angle) * cappedDist, Math.sin(angle) * cappedDist);
            }
        });

        const stopJoystick = () => {
            this.joystick.active = false;
            this.joystick.moveX = 0;
            this.joystick.moveY = 0;
            if (window.uiManager) window.uiManager.hideJoystick();
        };

        this.input.on('pointerup', stopJoystick);
        this.input.on('pointerupoutside', stopJoystick);
    }

    tryDash() {
        if (this.isGameOver || this.isPaused || this.isDashing) return;
        const now = this.time.now;
        if (now - this.lastDashTime < this.dashCooldownTime) return;

        this.lastDashTime = now;
        this.isDashing = true;
        this.invulnerableTimer = this.dashDuration + 100;

        if (window.soundManager) window.soundManager.playDash();

        for (let i = 0; i < 5; i++) {
            this.spawnDust(this.player.x + Phaser.Math.Between(-15, 15), this.player.y + Phaser.Math.Between(-10, 15), 1.3);
        }

        this.cameras.main.shake(80, 0.005);

        this.time.delayedCall(this.dashDuration, () => {
            this.isDashing = false;
        });

        if (window.uiManager) window.uiManager.onDashUsed(this.dashCooldownTime);
    }

    emitFootstepDust() {
        if (this.isGameOver || this.isPaused) return;
        const v = this.player.body.velocity;
        if (Math.abs(v.x) > 20 || Math.abs(v.y) > 20) {
            this.spawnDust(this.player.x, this.player.y + 18, 0.8);
        }
    }

    spawnDust(x, y, scale = 1.0) {
        const d = this.add.sprite(x, y, 'fx_dust');
        d.setDepth(4);
        d.setScale(scale);
        d.setAlpha(0.6);
        this.tweens.add({
            targets: d,
            scale: scale * 1.5,
            alpha: 0,
            duration: 300,
            onComplete: () => d.destroy()
        });
    }

    onSecondTick() {
        if (this.isGameOver || this.isPaused) return;
        this.survivalTime++;
        if (window.uiManager) window.uiManager.updateHUD();

        // Milk passive regen
        if (this.activeSkills.milk && this.hp < this.maxHp) {
            const healVal = 4 * this.activeSkills.milk;
            this.healPlayer(healVal);
        }

        // Check Boss status
        if (this.activeBoss && (!this.activeBoss.active || this.activeBoss.hp <= 0)) {
            this.activeBoss = null;
            if (window.uiManager) window.uiManager.hideBossBar();
        }

        // Evacuation Progression: Helicopter rescue triggers based on hero target time
        // Barsik: 10m (600s), Murzik: 15m (900s), Pukhlyash: 20m (1200s)
        const targetTime = this.evacTargetTime || 600;
        if (this.survivalTime >= targetTime && !this.evacTriggered && !this.isEndlessMode) {
            this.startEvacuationSequence();
        }

        if (this.evacTriggered && !this.evacCompleted && !this.isEndlessMode) {
            if (this.evacCountdown > 0) {
                this.evacCountdown--;
                const countEl = document.getElementById('evac-countdown');
                if (countEl) countEl.innerText = Math.max(0, this.evacCountdown);

                if (this.evacCountdown % 5 === 0 && this.evacCountdown > 0) {
                    if (window.soundManager && typeof window.soundManager.playEvacAlarm === 'function') {
                        window.soundManager.playEvacAlarm();
                    }
                }
            }

            if (this.evacCountdown <= 0) {
                const targetX = this.helipad ? this.helipad.x : (this.arenaSize / 2);
                const targetY = this.helipad ? this.helipad.y : (this.arenaSize / 2);
                const distToHelipad = Phaser.Math.Distance.Between(this.player.x, this.player.y, targetX, targetY);

                if (distToHelipad <= 85) {
                    this.executeHelicopterRescue();
                } else {
                    const banner = document.getElementById('evac-hud-banner');
                    if (banner) {
                        banner.innerHTML = `
                            <div class="evac-hud-badge" style="color: #ffd700;">🚁 ВЕРТОЛЁТ ЖДЁТ! 🚁</div>
                            <div class="evac-hud-timer" style="color: #2ecc71; font-size: 1.15rem;">⚡ ЗАЙДИ В КРУГ ПОСАДКИ! ⚡</div>
                            <div class="evac-hud-hint">Встань на вертолётную площадку со знаком «H»!</div>
                        `;
                    }
                    if (this.survivalTime % 2 === 0) {
                        this.showDamageText(this.player.x, this.player.y - 50, '🚁 ЗАЙДИ В КРУГ ПОСАДКИ! 🚁', '#f1c40f');
                        if (window.soundManager && typeof window.soundManager.playEvacAlarm === 'function') {
                            window.soundManager.playEvacAlarm();
                        }
                    }
                }
            }
        }
    }

    update(time, delta) {
        if (this.isGameOver || this.isPaused) return;

        // Invulnerability alpha blink
        if (this.invulnerableTimer > 0) {
            this.invulnerableTimer -= delta;
            this.player.setAlpha(Math.floor(time / 90) % 2 === 0 ? 0.35 : 1.0);
            if (this.invulnerableTimer <= 0) {
                this.player.setAlpha(1.0);
            }
        }

        // Freeze countdown
        if (this.freezeTimer > 0) {
            this.freezeTimer -= delta;
        }

        // 1. Player Movement & Anti-AFK Tracker
        let vx = 0;
        let vy = 0;

        if (this.cursors.left.isDown || this.wasd.left.isDown) vx -= 1;
        if (this.cursors.right.isDown || this.wasd.right.isDown) vx += 1;
        if (this.cursors.up.isDown || this.wasd.up.isDown) vy -= 1;
        if (this.cursors.down.isDown || this.wasd.down.isDown) vy += 1;

        if (this.joystick.active) {
            vx = this.joystick.moveX;
            vy = this.joystick.moveY;
        }

        if (!this.joystick.active && (vx !== 0 || vy !== 0)) {
            const len = Math.hypot(vx, vy);
            vx /= len;
            vy /= len;
        }

        let curSpd = this.speed;
        if (this.player.inBush) {
            curSpd *= 0.65;
            this.player.inBush = false;
        }
        if (this.isDashing) {
            curSpd *= this.dashSpeedMultiplier;
        }

        this.player.body.setVelocity(vx * curSpd, vy * curSpd);

        // Anti-AFK System: Detect if player is standing still
        const distFromLastPos = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.lastPlayerPos.x, this.lastPlayerPos.y);
        if (distFromLastPos < 25) {
            this.afkTimer += delta;
            if (this.afkTimer > 2500 && !this.isAfkEnraged) {
                this.isAfkEnraged = true;
                if (window.soundManager) window.soundManager.playEnrage();
                this.showDamageText(this.player.x, this.player.y - 45, '⚠️ НЕ СТОЙ! ВРАГИ В ЯРОСТИ! ⚠️', '#ff2222');
            }
        } else {
            this.lastPlayerPos.x = this.player.x;
            this.lastPlayerPos.y = this.player.y;
            this.afkTimer = 0;
            this.isAfkEnraged = false;
        }

        // Visual orientation & dynamic animations
        if (vx < 0) this.player.setFlipX(true);
        else if (vx > 0) this.player.setFlipX(false);

        // Frame-by-frame Cat Character Animations (Run vs Idle vs Hurt)
        if (this.player.hurtTimer > 0) {
            this.player.hurtTimer -= delta;
            if (this.player.hurtTimer <= 0) {
                if (vx !== 0 || vy !== 0) {
                    this.player.play(`${this.selectedHeroId}_run`, true);
                } else {
                    this.player.play(`${this.selectedHeroId}_idle`, true);
                }
            }
        } else {
            if (vx !== 0 || vy !== 0) {
                if (!this.player.anims.isPlaying || this.player.anims.currentAnim.key !== `${this.selectedHeroId}_run`) {
                    this.player.play(`${this.selectedHeroId}_run`, true);
                }
                const runCycle = Math.sin(time / 80);
                this.player.setScale(1.0 + runCycle * 0.04, 1.0 - runCycle * 0.04);
                this.player.rotation = Math.sin(time / 75) * 0.08;
            } else {
                if (!this.player.anims.isPlaying || this.player.anims.currentAnim.key !== `${this.selectedHeroId}_idle`) {
                    this.player.play(`${this.selectedHeroId}_idle`, true);
                }
                const breathe = Math.sin(time / 300) * 0.03;
                this.player.setScale(1.0 - breathe * 0.3, 1.0 + breathe);
                this.player.rotation = 0;
            }
        }

        // Aura visual attachment
        if (this.activeSkills.aura || this.activeSkills.evo_dome) {
            this.auraVisual.setPosition(this.player.x, this.player.y);
            this.auraVisual.rotation += 0.025;
        }

        // Ground shadow follows player
        if (this.playerShadow && this.playerShadow.active) {
            this.playerShadow.setPosition(this.player.x, this.player.y + 18);
        }

        // Update ground puddles (Valerian)
        this.updateValerianPuddles(time, delta);

        // 2. Weapon firing loops
        this.updateWeapons(time);

        // 3. Orbiting items update (Evo Shark & Evo Beam)
        this.updateOrbitals(time);

        // 4. Enemies AI & Ranged Attacks
        this.updateEnemies(time, delta);

        // 5. Magnet & Drops
        this.updateDrops();

        // 6. Boss health bar update
        if (this.activeBoss && this.activeBoss.active) {
            if (window.uiManager) window.uiManager.updateBossBar(this.activeBoss.hp, this.activeBoss.maxHp);
        }

        // 7. Evacuation Navigation & Realtime Helipad Landing Circle Check
        if (this.evacTriggered && !this.evacCompleted && !this.isEndlessMode) {
            const targetX = this.helipad ? this.helipad.x : (this.arenaSize / 2);
            const targetY = this.helipad ? this.helipad.y : (this.arenaSize / 2);
            const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, targetX, targetY);

            // Radius of helipad circle zone is ~85px
            const insideLandingCircle = (dist <= 85);

            // Trigger rescue video ONLY when cat enters the landing circle!
            if (this.evacCountdown <= 0 && insideLandingCircle) {
                this.executeHelicopterRescue();
                return;
            }

            // Directional arrow navigation towards the helipad circle
            if (dist > 75) {
                if (!this.evacIndicator) {
                    this.evacIndicator = this.add.graphics().setDepth(20);
                }
                const g = this.evacIndicator;
                g.clear();
                const ang = Phaser.Math.Angle.Between(this.player.x, this.player.y, targetX, targetY);
                const ax = this.player.x + Math.cos(ang) * 55;
                const ay = this.player.y + Math.sin(ang) * 55;

                const pulse = Math.sin(time / 160) * 0.2 + 0.8;
                g.fillStyle(0x2ecc71, pulse);
                g.fillCircle(ax, ay, 7);
                g.lineStyle(3, 0xffffff, 0.95);
                g.lineBetween(ax, ay, ax + Math.cos(ang) * 18, ay + Math.sin(ang) * 18);
            } else if (this.evacIndicator) {
                this.evacIndicator.clear();
            }
        } else if (this.evacIndicator) {
            this.evacIndicator.clear();
        }
    }

    updateWeapons(time) {
        // Base weapons
        if (this.activeSkills.fish && !this.activeSkills.evo_shark) {
            const data = SKILLS_DATABASE.fish;
            const lvl = this.activeSkills.fish;
            const cd = Math.max(300, (data.cooldown - (lvl - 1) * data.cooldownReduction) / this.attackSpeedMultiplier);
            if (!this.weaponTimers.fish || time - this.weaponTimers.fish > cd) {
                this.weaponTimers.fish = time;
                this.fireFish(lvl);
            }
        }

        if (this.activeSkills.yarn && !this.activeSkills.evo_web) {
            const data = SKILLS_DATABASE.yarn;
            const lvl = this.activeSkills.yarn;
            const cd = Math.max(300, (data.cooldown - (lvl - 1) * data.cooldownReduction) / this.attackSpeedMultiplier);
            if (!this.weaponTimers.yarn || time - this.weaponTimers.yarn > cd) {
                this.weaponTimers.yarn = time;
                this.fireYarn(lvl);
            }
        }

        if (this.activeSkills.aura && !this.activeSkills.evo_dome) {
            const data = SKILLS_DATABASE.aura;
            const lvl = this.activeSkills.aura;
            const cd = Math.max(250, (data.cooldown - (lvl - 1) * data.cooldownReduction) / this.attackSpeedMultiplier);
            if (!this.weaponTimers.aura || time - this.weaponTimers.aura > cd) {
                this.weaponTimers.aura = time;
                this.triggerAuraPulse(lvl);
            }
        }

        if (this.activeSkills.laser && !this.activeSkills.evo_beam) {
            const data = SKILLS_DATABASE.laser;
            const lvl = this.activeSkills.laser;
            const cd = Math.max(400, (data.cooldown - (lvl - 1) * data.cooldownReduction) / this.attackSpeedMultiplier);
            if (!this.weaponTimers.laser || time - this.weaponTimers.laser > cd) {
                this.weaponTimers.laser = time;
                this.fireLaser(lvl);
            }
        }

        if (this.activeSkills.slipper && !this.activeSkills.evo_barrage) {
            const data = SKILLS_DATABASE.slipper;
            const lvl = this.activeSkills.slipper;
            const cd = Math.max(500, (data.cooldown - (lvl - 1) * data.cooldownReduction) / this.attackSpeedMultiplier);
            if (!this.weaponTimers.slipper || time - this.weaponTimers.slipper > cd) {
                this.weaponTimers.slipper = time;
                this.fireSlipper(lvl);
            }
        }

        // Evolutions
        if (this.activeSkills.evo_web) {
            const cd = SKILLS_DATABASE.evo_web.cooldown / this.attackSpeedMultiplier;
            if (!this.weaponTimers.evo_web || time - this.weaponTimers.evo_web > cd) {
                this.weaponTimers.evo_web = time;
                this.triggerPlasmaWeb();
            }
        }

        if (this.activeSkills.evo_dome) {
            const cd = SKILLS_DATABASE.evo_dome.cooldown / this.attackSpeedMultiplier;
            if (!this.weaponTimers.evo_dome || time - this.weaponTimers.evo_dome > cd) {
                this.weaponTimers.evo_dome = time;
                this.triggerHolyDomePulse();
            }
        }

        if (this.activeSkills.evo_barrage) {
            const cd = SKILLS_DATABASE.evo_barrage.cooldown / this.attackSpeedMultiplier;
            if (!this.weaponTimers.evo_barrage || time - this.weaponTimers.evo_barrage > cd) {
                this.weaponTimers.evo_barrage = time;
                this.triggerSlipperRain();
            }
        }

        // Claws Slash & Wolverine Evolution
        if (this.activeSkills.claws_slash && !this.activeSkills.evo_wolverine) {
            const data = SKILLS_DATABASE.claws_slash;
            const lvl = this.activeSkills.claws_slash;
            const cd = Math.max(250, (data.cooldown - (lvl - 1) * data.cooldownReduction) / this.attackSpeedMultiplier);
            if (!this.weaponTimers.claws_slash || time - this.weaponTimers.claws_slash > cd) {
                this.weaponTimers.claws_slash = time;
                this.fireClawsSlash(lvl, false);
            }
        }

        if (this.activeSkills.evo_wolverine) {
            const cd = SKILLS_DATABASE.evo_wolverine.cooldown / this.attackSpeedMultiplier;
            if (!this.weaponTimers.evo_wolverine || time - this.weaponTimers.evo_wolverine > cd) {
                this.weaponTimers.evo_wolverine = time;
                this.fireClawsSlash(1, true);
            }
        }

        // Valerian Flask & Storm Evolution
        if (this.activeSkills.valerian && !this.activeSkills.evo_valerian_storm) {
            const data = SKILLS_DATABASE.valerian;
            const lvl = this.activeSkills.valerian;
            const cd = Math.max(800, (data.cooldown - (lvl - 1) * data.cooldownReduction) / this.attackSpeedMultiplier);
            if (!this.weaponTimers.valerian || time - this.weaponTimers.valerian > cd) {
                this.weaponTimers.valerian = time;
                this.throwValerian(lvl, false);
            }
        }

        if (this.activeSkills.evo_valerian_storm) {
            const cd = SKILLS_DATABASE.evo_valerian_storm.cooldown / this.attackSpeedMultiplier;
            if (!this.weaponTimers.evo_valerian_storm || time - this.weaponTimers.evo_valerian_storm > cd) {
                this.weaponTimers.evo_valerian_storm = time;
                this.throwValerian(1, true);
            }
        }

        // Meow Mine
        if (this.activeSkills.meow_mine) {
            const data = SKILLS_DATABASE.meow_mine;
            const lvl = this.activeSkills.meow_mine;
            const cd = Math.max(600, (data.cooldown - (lvl - 1) * data.cooldownReduction) / this.attackSpeedMultiplier);
            if (!this.weaponTimers.meow_mine || time - this.weaponTimers.meow_mine > cd) {
                this.weaponTimers.meow_mine = time;
                this.dropMeowMine(lvl);
            }
        }

        // Static Fur Passive Zap
        if (this.activeSkills.static_fur) {
            const data = SKILLS_DATABASE.static_fur;
            const lvl = this.activeSkills.static_fur;
            const cd = Math.max(500, (data.cooldown - (lvl - 1) * data.cooldownReduction) / this.attackSpeedMultiplier);
            if (!this.weaponTimers.static_fur || time - this.weaponTimers.static_fur > cd) {
                this.weaponTimers.static_fur = time;
                this.triggerStaticFur(lvl);
            }
        }
    }

    updateOrbitals(time) {
        const px = this.player.x;
        const py = this.player.y;

        if (this.activeSkills.evo_shark) {
            if (this.orbitingSharks.length === 0) {
                for (let i = 0; i < 2; i++) {
                    const shark = this.physics.add.sprite(px, py, 'evo_shark');
                    shark.setDepth(12);
                    shark.setScale(1.2);
                    shark.angleOffset = (Math.PI * 2 / 2) * i;
                    this.orbitingSharks.push(shark);
                }
            }

            const orbitRadius = 120;
            const orbitSpeed = 0.005;
            this.orbitingSharks.forEach(shark => {
                const ang = (time * orbitSpeed) + shark.angleOffset;
                shark.x = px + Math.cos(ang) * orbitRadius;
                shark.y = py + Math.sin(ang) * orbitRadius;
                shark.rotation = ang + Math.PI / 2;

                this.enemies.getChildren().forEach(e => {
                    if (!e.active) return;
                    if (Phaser.Math.Distance.Between(shark.x, shark.y, e.x, e.y) < 40) {
                        this.damageEnemy(e, 85 * this.damageMultiplier);
                    }
                });
            });
        }

        if (this.activeSkills.evo_beam) {
            if (this.orbitingBeams.length === 0) {
                for (let i = 0; i < 3; i++) {
                    const beamOrb = this.physics.add.sprite(px, py, 'evo_beam');
                    beamOrb.setDepth(12);
                    beamOrb.angleOffset = (Math.PI * 2 / 3) * i;
                    this.orbitingBeams.push(beamOrb);
                }
            }

            const orbitRadius = 150;
            const orbitSpeed = 0.006;
            this.orbitingBeams.forEach(orb => {
                const ang = (time * orbitSpeed) + orb.angleOffset;
                orb.x = px + Math.cos(ang) * orbitRadius;
                orb.y = py + Math.sin(ang) * orbitRadius;

                const gfx = this.add.graphics();
                gfx.setDepth(11);
                gfx.lineStyle(3, 0xff0055, 0.7);
                gfx.lineBetween(px, py, orb.x, orb.y);
                this.tweens.add({
                    targets: gfx,
                    alpha: 0,
                    duration: 50,
                    onComplete: () => gfx.destroy()
                });

                const target = this.getClosestEnemy(250, orb.x, orb.y);
                if (target) {
                    this.damageEnemy(target, 45 * this.damageMultiplier);
                }
            });
        }
    }

    getClosestEnemy(maxDist = 600, fromX = null, fromY = null) {
        const ox = fromX !== null ? fromX : this.player.x;
        const oy = fromY !== null ? fromY : this.player.y;
        let closest = null;
        let minDist = maxDist;
        this.enemies.getChildren().forEach(e => {
            if (!e.active) return;
            const d = Phaser.Math.Distance.Between(ox, oy, e.x, e.y);
            if (d < minDist) {
                minDist = d;
                closest = e;
            }
        });
        return closest;
    }

    fireFish(level) {
        const target = this.getClosestEnemy(450);
        let angle = target ? Phaser.Math.Angle.Between(this.player.x, this.player.y, target.x, target.y) : (this.player.flipX ? Math.PI : 0);

        const count = level >= 4 ? 2 : 1;
        for (let i = 0; i < count; i++) {
            const spread = (i - (count - 1) / 2) * 0.3;
            const fish = this.projectiles.create(this.player.x, this.player.y, 'proj_fish');
            fish.setDepth(11);
            fish.damage = (SKILLS_DATABASE.fish.baseDamage + (level - 1) * SKILLS_DATABASE.fish.damagePerLevel) * this.damageMultiplier;
            fish.pierce = 2 + level;
            fish.hitEnemies = new Set();
            fish.isFish = true;
            fish.originX = this.player.x;
            fish.originY = this.player.y;
            fish.returning = false;

            const finalAngle = angle + spread;
            const spd = 360;
            fish.setVelocity(Math.cos(finalAngle) * spd, Math.sin(finalAngle) * spd);
            fish.rotation = finalAngle;

            this.time.delayedCall(450, () => {
                if (fish && fish.active) fish.returning = true;
            });
        }

        if (window.soundManager) window.soundManager.playFishThrow();
    }

    fireYarn(level) {
        const target = this.getClosestEnemy(400);
        if (!target) return;

        const yarn = this.projectiles.create(this.player.x, this.player.y, 'proj_yarn');
        yarn.setDepth(11);
        yarn.damage = (SKILLS_DATABASE.yarn.baseDamage + (level - 1) * SKILLS_DATABASE.yarn.damagePerLevel) * this.damageMultiplier;
        yarn.bouncesLeft = 3 + level;
        yarn.hitEnemies = new Set();
        yarn.isYarn = true;

        const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, target.x, target.y);
        const spd = 300;
        yarn.setVelocity(Math.cos(angle) * spd, Math.sin(angle) * spd);

        this.time.delayedCall(3000, () => {
            if (yarn && yarn.active) yarn.destroy();
        });

        if (window.soundManager) window.soundManager.playYarnBounce();
    }

    triggerPlasmaWeb() {
        const enemies = this.enemies.getChildren().filter(e => e.active);
        if (enemies.length === 0) return;

        const count = Math.min(6, enemies.length);
        const shuffled = enemies.sort(() => 0.5 - Math.random()).slice(0, count);

        const gfx = this.add.graphics();
        gfx.setDepth(12);
        gfx.lineStyle(3, 0x00f0ff, 0.9);

        for (let i = 0; i < count; i++) {
            const e1 = shuffled[i];
            const e2 = shuffled[(i + 1) % count];
            gfx.lineBetween(e1.x, e1.y, e2.x, e2.y);
            this.damageEnemy(e1, 60 * this.damageMultiplier);
        }

        this.tweens.add({
            targets: gfx,
            alpha: 0,
            duration: 250,
            onComplete: () => gfx.destroy()
        });

        if (window.soundManager) window.soundManager.playLaser();
    }

    triggerAuraPulse(level) {
        const radius = (SKILLS_DATABASE.aura.radius + (level - 1) * SKILLS_DATABASE.aura.radiusPerLevel);
        const dmg = (SKILLS_DATABASE.aura.baseDamage + (level - 1) * SKILLS_DATABASE.aura.damagePerLevel) * this.damageMultiplier;

        this.auraVisual.setAlpha(0.85);
        this.auraVisual.setScale((radius * 2) / 64);
        this.tweens.add({
            targets: this.auraVisual,
            alpha: 0.15,
            duration: 350,
            ease: 'Power1'
        });

        this.enemies.getChildren().forEach(e => {
            if (!e.active) return;
            const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, e.x, e.y);
            if (dist <= radius) {
                this.damageEnemy(e, dmg);
                const ang = Phaser.Math.Angle.Between(this.player.x, this.player.y, e.x, e.y);
                e.x += Math.cos(ang) * 18;
                e.y += Math.sin(ang) * 18;
            }
        });

        if (window.soundManager) window.soundManager.playPurr();
    }

    triggerHolyDomePulse() {
        const radius = 220;
        const dmg = 45 * this.damageMultiplier;

        this.auraVisual.setAlpha(1.0);
        this.auraVisual.setScale((radius * 2) / 64);
        this.auraVisual.setTint(0xffd700);

        this.tweens.add({
            targets: this.auraVisual,
            alpha: 0.3,
            duration: 300,
            ease: 'Power1'
        });

        this.enemies.getChildren().forEach(e => {
            if (!e.active) return;
            const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, e.x, e.y);
            if (dist <= radius) {
                this.damageEnemy(e, dmg);
                const ang = Phaser.Math.Angle.Between(this.player.x, this.player.y, e.x, e.y);
                e.x += Math.cos(ang) * 50;
                e.y += Math.sin(ang) * 50;
            }
        });

        if (window.soundManager) window.soundManager.playPurr();
    }

    fireLaser(level) {
        const target = this.getClosestEnemy(SKILLS_DATABASE.laser.range);
        if (!target) return;

        const dmg = (SKILLS_DATABASE.laser.baseDamage + (level - 1) * SKILLS_DATABASE.laser.damagePerLevel) * this.damageMultiplier;
        
        const laserGfx = this.add.graphics();
        laserGfx.setDepth(12);
        laserGfx.lineStyle(4, 0xff0044, 1.0);
        laserGfx.lineBetween(this.player.x, this.player.y, target.x, target.y);
        laserGfx.lineStyle(2, 0xffffff, 1.0);
        laserGfx.lineBetween(this.player.x, this.player.y, target.x, target.y);

        this.tweens.add({
            targets: laserGfx,
            alpha: 0,
            duration: 160,
            onComplete: () => laserGfx.destroy()
        });

        const spark = this.add.sprite(target.x, target.y, 'proj_laser');
        spark.setDepth(13);
        spark.setScale(1.2);
        this.tweens.add({
            targets: spark,
            scale: 0.2,
            alpha: 0,
            duration: 200,
            onComplete: () => spark.destroy()
        });

        this.damageEnemy(target, dmg);
        if (window.soundManager) window.soundManager.playLaser();
    }

    fireSlipper(level) {
        const target = this.getClosestEnemy(500);
        let angle = target ? Phaser.Math.Angle.Between(this.player.x, this.player.y, target.x, target.y) : Phaser.Math.FloatBetween(0, Math.PI * 2);

        const slipper = this.projectiles.create(this.player.x, this.player.y, 'proj_slipper');
        slipper.setDepth(11);
        slipper.damage = (SKILLS_DATABASE.slipper.baseDamage + (level - 1) * SKILLS_DATABASE.slipper.damagePerLevel) * this.damageMultiplier;
        slipper.pierce = 4;
        slipper.hitEnemies = new Set();
        slipper.isSlipper = true;

        const spd = 400;
        slipper.setVelocity(Math.cos(angle) * spd, Math.sin(angle) * spd);

        this.tweens.add({
            targets: slipper,
            rotation: 12,
            duration: 1500
        });

        this.time.delayedCall(1600, () => {
            if (slipper && slipper.active) slipper.destroy();
        });

        if (window.soundManager) window.soundManager.playSlipper();
    }

    triggerSlipperRain() {
        for (let i = 0; i < 4; i++) {
            this.time.delayedCall(i * 120, () => {
                const bounds = this.cameras.main.worldView;
                const rx = Phaser.Math.Between(bounds.left + 50, bounds.right - 50);
                const ry = bounds.top - 60;
                const targetY = Phaser.Math.Between(bounds.top + 100, bounds.bottom - 50);

                const slipper = this.projectiles.create(rx, ry, 'evo_barrage');
                slipper.setDepth(14);
                slipper.setScale(1.4);
                slipper.damage = 90 * this.damageMultiplier;
                slipper.hitEnemies = new Set();

                this.tweens.add({
                    targets: slipper,
                    y: targetY,
                    rotation: 8,
                    duration: 400,
                    ease: 'Power2',
                    onComplete: () => {
                        this.cameras.main.shake(100, 0.008);
                        if (window.soundManager) window.soundManager.playSlipper();
                        this.enemies.getChildren().forEach(e => {
                            if (!e.active) return;
                            if (Phaser.Math.Distance.Between(slipper.x, targetY, e.x, e.y) < 120) {
                                this.damageEnemy(e, slipper.damage);
                            }
                        });
                        slipper.destroy();
                    }
                });
            });
        }
    }

    // ==========================================
    // NEW WEAPONS & SKILLS IMPLEMENTATIONS
    // ==========================================

    fireClawsSlash(level, isEvo = false) {
        const px = this.player.x;
        const py = this.player.y;
        const dmg = (isEvo ? SKILLS_DATABASE.evo_wolverine.baseDamage : (SKILLS_DATABASE.claws_slash.baseDamage + (level - 1) * SKILLS_DATABASE.claws_slash.damagePerLevel)) * this.damageMultiplier;

        if (isEvo) {
            // Wolverine 360-degree Whirlwind of Slashes
            const bladeCount = 4;
            for (let i = 0; i < bladeCount; i++) {
                const ang = (Math.PI * 2 / bladeCount) * i;
                const slash = this.add.sprite(px + Math.cos(ang) * 45, py + Math.sin(ang) * 45, 'evo_wolverine');
                slash.setDepth(15);
                slash.setScale(1.4);
                slash.rotation = ang;
                this.tweens.add({
                    targets: slash,
                    rotation: ang + 3.5,
                    scale: 2.0,
                    alpha: 0,
                    duration: 240,
                    onComplete: () => slash.destroy()
                });
            }

            this.cameras.main.shake(90, 0.007);
            if (window.soundManager) window.soundManager.playClawSlash();

            const hitRadius = 160;
            this.enemies.getChildren().forEach(e => {
                if (!e.active) return;
                const d = Phaser.Math.Distance.Between(px, py, e.x, e.y);
                if (d <= hitRadius) {
                    this.damageEnemy(e, dmg);
                    const pushAng = Phaser.Math.Angle.Between(px, py, e.x, e.y);
                    e.x += Math.cos(pushAng) * 40;
                    e.y += Math.sin(pushAng) * 40;
                }
            });
        } else {
            // Frontal Whirlwind Claws Slash
            const slashX = px + (this.player.flipX ? -45 : 45);
            const slash = this.add.sprite(slashX, py, 'proj_claw_slash');
            slash.setDepth(14);
            slash.setScale(1.2);
            slash.setFlipX(this.player.flipX);
            slash.rotation = this.player.flipX ? 0.3 : -0.3;

            this.tweens.add({
                targets: slash,
                scaleX: 1.6,
                scaleY: 1.6,
                rotation: this.player.flipX ? -0.8 : 0.8,
                alpha: 0,
                duration: 180,
                onComplete: () => slash.destroy()
            });

            if (window.soundManager) window.soundManager.playClawSlash();

            const hitRange = 115;
            this.enemies.getChildren().forEach(e => {
                if (!e.active) return;
                const d = Phaser.Math.Distance.Between(slashX, py, e.x, e.y);
                if (d <= hitRange) {
                    this.damageEnemy(e, dmg);
                    const pushX = this.player.flipX ? -25 : 25;
                    e.x += pushX;
                }
            });
        }
    }

    throwValerian(level, isEvo = false) {
        const px = this.player.x;
        const py = this.player.y;
        const target = this.getClosestEnemy(380);
        let tx = target ? target.x : px + Phaser.Math.Between(-180, 180);
        let ty = target ? target.y : py + Phaser.Math.Between(-180, 180);

        tx = Phaser.Math.Clamp(tx, 60, this.arenaSize - 60);
        ty = Phaser.Math.Clamp(ty, 60, this.arenaSize - 60);

        const flaskKey = isEvo ? 'evo_valerian_spin' : 'proj_valerian_spin';
        const animKey = isEvo ? 'valerian_storm_spin' : 'valerian_spin';
        const flask = this.add.sprite(px, py, flaskKey);
        flask.setDepth(14);
        flask.setScale(isEvo ? 1.35 : 1.18);
        flask.play(animKey);

        const duration = 640;

        // Smooth physical tumble rotation end-over-end in flight
        this.tweens.add({
            targets: flask,
            angle: (tx >= px ? 360 : -360),
            duration: duration,
            ease: 'Linear'
        });

        // Dynamic ground shadow tracking flask flight
        const shadow = this.add.ellipse(px, py + 12, 26, 13, 0x000000, 0.45);
        shadow.setDepth(2);
        this.tweens.add({
            targets: shadow,
            x: tx,
            y: ty + 12,
            duration: duration,
            ease: 'Linear'
        });

        // Parabolic arc: X moves linearly
        this.tweens.add({
            targets: flask,
            x: tx,
            duration: duration,
            ease: 'Linear'
        });

        // Continuous streaming bubbles & sparkles trailing behind the flying vial
        const trailTimer = this.time.addEvent({
            delay: 35,
            repeat: Math.floor(duration / 35),
            callback: () => {
                if (!flask || !flask.active) return;
                const bubble = this.add.circle(
                    flask.x + Phaser.Math.Between(-5, 5),
                    flask.y + Phaser.Math.Between(-5, 5),
                    Phaser.Math.Between(3, 6),
                    isEvo ? 0xebdef0 : 0xa9dfbf,
                    0.85
                );
                bubble.setDepth(13);
                this.tweens.add({
                    targets: bubble,
                    y: bubble.y - Phaser.Math.Between(15, 28),
                    alpha: 0,
                    scale: 0.2,
                    duration: 320,
                    ease: 'Quad.easeOut',
                    onComplete: () => bubble.destroy()
                });
            }
        });

        // Y arcs upwards first then plummets down with impact
        const peakY = Math.min(py, ty) - 95;
        this.tweens.add({
            targets: flask,
            y: peakY,
            duration: duration * 0.45,
            ease: 'Quad.easeOut',
            onComplete: () => {
                if (!flask || !flask.active) {
                    if (shadow && shadow.active) shadow.destroy();
                    return;
                }
                this.tweens.add({
                    targets: flask,
                    y: ty,
                    duration: duration * 0.55,
                    ease: 'Quad.easeIn',
                    onComplete: () => {
                        if (shadow && shadow.active) shadow.destroy();
                        if (flask && flask.active) flask.destroy();

                        // Splendid animated shattering splash!
                        const splash = this.add.sprite(tx, ty, 'fx_valerian_splash');
                        splash.setDepth(14);
                        splash.setScale(isEvo ? 1.6 : 1.25);
                        if (isEvo) splash.setTint(0xd2b4de);
                        splash.play('valerian_splash');
                        splash.on('animationcomplete', () => splash.destroy());

                        this.createValerianPuddle(tx, ty, level, isEvo);
                    }
                });
            }
        });
    }

    createValerianPuddle(x, y, level, isEvo = false) {
        if (window.soundManager) window.soundManager.playFlaskBreak();

        const radius = isEvo ? 135 : 95;
        const duration = isEvo ? 6500 : 4200;
        const dmgPerTick = (isEvo ? SKILLS_DATABASE.evo_valerian_storm.baseDamage : (SKILLS_DATABASE.valerian.baseDamage + (level - 1) * SKILLS_DATABASE.valerian.damagePerLevel)) * this.damageMultiplier;

        // Animated looping ground puddle / vortex sprite
        const puddleSprite = this.add.sprite(x, y, isEvo ? 'fx_valerian_vortex_loop' : 'fx_valerian_puddle_loop');
        puddleSprite.setDepth(3);
        const targetScale = isEvo ? (radius * 2 / 128) : (radius * 2 / 96);
        puddleSprite.setScale(targetScale * 0.2);
        puddleSprite.setAlpha(0.95);
        puddleSprite.play(isEvo ? 'valerian_vortex_anim' : 'valerian_puddle_anim');

        this.tweens.add({
            targets: puddleSprite,
            scale: targetScale,
            duration: 280,
            ease: 'Back.out'
        });

        const puddle = {
            x,
            y,
            radius,
            damage: dmgPerTick,
            duration,
            maxDuration: duration,
            isEvo,
            sprite: puddleSprite,
            tickTimer: 0
        };

        this.valerianPuddles.push(puddle);

        // Animated bubbling droplets & herbal particles
        for (let i = 0; i < (isEvo ? 14 : 9); i++) {
            const part = this.add.circle(x, y, Phaser.Math.Between(3, 7), isEvo ? 0x9b59b6 : 0x2ecc71);
            part.setDepth(4);
            const ang = Phaser.Math.FloatBetween(0, Math.PI * 2);
            const dist = Phaser.Math.Between(20, radius * 0.85);
            this.tweens.add({
                targets: part,
                x: x + Math.cos(ang) * dist,
                y: y + Math.sin(ang) * dist,
                alpha: 0,
                scale: 0.2,
                duration: Phaser.Math.Between(350, 600),
                ease: 'Cubic.out',
                onComplete: () => part.destroy()
            });
        }
    }

    updateValerianPuddles(time, delta) {
        if (!this.valerianPuddles || this.valerianPuddles.length === 0) return;

        for (let i = this.valerianPuddles.length - 1; i >= 0; i--) {
            const p = this.valerianPuddles[i];
            p.duration -= delta;
            p.tickTimer += delta;

            // Smooth fade out when puddle is about to expire
            if (p.duration < 600 && p.sprite && p.sprite.active) {
                p.sprite.setAlpha((p.duration / 600) * 0.95);
            }

            if (p.duration <= 0) {
                if (p.sprite && p.sprite.active) p.sprite.destroy();
                this.valerianPuddles.splice(i, 1);
                continue;
            }

            // Gentle rising aromatic herbal bubbles/sparks drifting upward
            if (Math.random() < 0.28) {
                const bubble = this.add.circle(
                    p.x + Phaser.Math.Between(-p.radius * 0.55, p.radius * 0.55),
                    p.y + Phaser.Math.Between(-p.radius * 0.35, p.radius * 0.35),
                    Phaser.Math.Between(2, 4),
                    p.isEvo ? 0xebdef0 : 0xa9dfbf,
                    0.8
                );
                bubble.setDepth(5);
                this.tweens.add({
                    targets: bubble,
                    y: bubble.y - Phaser.Math.Between(18, 30),
                    alpha: 0,
                    scale: 0.2,
                    duration: 450,
                    ease: 'Quad.easeOut',
                    onComplete: () => bubble.destroy()
                });
            }

            // Tick damage & apply slow safely
            if (p.tickTimer >= 350) {
                p.tickTimer = 0;
                this.enemies.getChildren().forEach(e => {
                    if (!e || !e.active) return;
                    const d = Phaser.Math.Distance.Between(p.x, p.y, e.x, e.y);
                    if (d <= p.radius) {
                        e.valerianSlowTimer = 500;
                        this.damageEnemy(e, p.damage);
                    }
                });

                // Self-damage: Player takes toxic damage when standing in the valerian puddle!
                if (this.player && this.player.active) {
                    const distToPlayer = Phaser.Math.Distance.Between(p.x, p.y, this.player.x, this.player.y);
                    if (distToPlayer <= p.radius) {
                        const puddleSelfDmg = p.isEvo ? 14 : 8;
                        this.applyPlayerDamage(puddleSelfDmg, p.x, p.y, true, false);
                    }
                }
            }
        }
    }

    dropMeowMine(level) {
        // Create with frame 0 (cute sleeping cat mine)
        const mine = this.meowMines.create(this.player.x, this.player.y, 'proj_mine_sheet', 0);
        mine.setDepth(6);
        mine.setScale(1.15);
        mine.armed = false;
        mine.damage = (SKILLS_DATABASE.meow_mine.baseDamage + (level - 1) * SKILLS_DATABASE.meow_mine.damagePerLevel) * this.damageMultiplier;
        mine.body.setSize(30, 30);

        // Cute drop hop tween
        this.tweens.add({
            targets: mine,
            y: mine.y - 12,
            duration: 120,
            yoyo: true,
            ease: 'Quad.easeOut'
        });

        // Arming delay: perk ears, glow angry red eyes, start ticking pulse animation!
        this.time.delayedCall(300, () => {
            if (mine && mine.active) {
                mine.armed = true;
                mine.play('mine_arm_pulse');
                this.spawnDust(mine.x, mine.y + 10, 0.9);
            }
        });

        // Cap total active mines to 8
        if (this.meowMines.getChildren().length > 8) {
            const oldest = this.meowMines.getChildren()[0];
            if (oldest && oldest !== mine) this.detonateMine(oldest);
        }
    }

    handleMineHit(mine, enemy) {
        if (!mine.active || !mine.armed || !enemy.active) return;
        this.detonateMine(mine);
    }

    detonateMine(mine) {
        if (!mine.active) return;
        const mx = mine.x;
        const my = mine.y;
        const dmg = mine.damage || 55;
        mine.destroy();

        if (window.soundManager) window.soundManager.playMineExplosion();
        this.cameras.main.shake(160, 0.015);

        // 1. Epic Cat-Paw Explosion Spritesheet Animation!
        const exp = this.add.sprite(mx, my, 'fx_mine_explosion');
        exp.setDepth(16);
        exp.setScale(1.4);
        exp.play('mine_explosion');
        exp.on('animationcomplete', () => exp.destroy());

        // 2. Glowing expanding shockwave circle
        const shock = this.add.circle(mx, my, 18, 0xf39c12, 0.9);
        shock.setDepth(15);
        this.tweens.add({
            targets: shock,
            scale: 6.5,
            alpha: 0,
            duration: 260,
            onComplete: () => shock.destroy()
        });

        const blastRadius = 115;
        this.enemies.getChildren().forEach(e => {
            if (!e || !e.active) return;
            const d = Phaser.Math.Distance.Between(mx, my, e.x, e.y);
            if (d <= blastRadius) {
                const pushAng = Phaser.Math.Angle.Between(mx, my, e.x, e.y);
                e.x += Math.cos(pushAng) * 38;
                e.y += Math.sin(pushAng) * 38;
                this.damageEnemy(e, dmg);
            }
        });

        // Self-damage: Player caught in the bomb explosion radius takes damage & knockback!
        if (this.player && this.player.active) {
            const distToPlayer = Phaser.Math.Distance.Between(mx, my, this.player.x, this.player.y);
            if (distToPlayer <= blastRadius) {
                const proximityFactor = 1 - (distToPlayer / blastRadius) * 0.4;
                const bombSelfDmg = Math.round((dmg * 0.45) * proximityFactor);
                this.applyPlayerDamage(Math.max(12, bombSelfDmg), mx, my, false, true);
            }
        }
    }

    triggerStaticFur(level) {
        const px = this.player.x;
        const py = this.player.y;
        const zapRange = 260;
        const count = 2 + Math.min(3, level);
        const dmg = (SKILLS_DATABASE.static_fur.baseDamage + (level - 1) * SKILLS_DATABASE.static_fur.damagePerLevel) * this.damageMultiplier;

        const candidates = [];
        this.enemies.getChildren().forEach(e => {
            if (!e || !e.active) return;
            const d = Phaser.Math.Distance.Between(px, py, e.x, e.y);
            if (d <= zapRange) candidates.push({ enemy: e, dist: d });
        });

        candidates.sort((a, b) => a.dist - b.dist);
        const targets = candidates.slice(0, count);

        if (targets.length === 0) return;

        const gfx = this.add.graphics();
        gfx.setDepth(15);
        gfx.lineStyle(3, 0x00ffff, 0.95);

        targets.forEach(t => {
            if (!t.enemy || !t.enemy.active) return;
            gfx.lineBetween(px, py, t.enemy.x, t.enemy.y);
            t.enemy.setTint(0x00ffff);
            if (t.enemy.body) t.enemy.body.setVelocity(0, 0);
            this.damageEnemy(t.enemy, dmg);
            this.time.delayedCall(160, () => {
                if (t.enemy && t.enemy.active) t.enemy.clearTint();
            });
        });

        this.tweens.add({
            targets: gfx,
            alpha: 0,
            duration: 140,
            onComplete: () => gfx.destroy()
        });

        if (window.soundManager) window.soundManager.playStaticZap();
    }

    handleProjectileEnemyHit(proj, enemy) {
        if (!proj.active || !enemy.active) return;
        if (proj.hitEnemies && proj.hitEnemies.has(enemy)) return;

        if (proj.hitEnemies) proj.hitEnemies.add(enemy);
        this.damageEnemy(enemy, proj.damage);

        if (proj.isYarn && proj.bouncesLeft > 0) {
            proj.bouncesLeft--;
            let nextTarget = null;
            let minDist = 300;
            this.enemies.getChildren().forEach(e => {
                if (!e.active || e === enemy) return;
                const d = Phaser.Math.Distance.Between(enemy.x, enemy.y, e.x, e.y);
                if (d < minDist) {
                    minDist = d;
                    nextTarget = e;
                }
            });

            if (nextTarget) {
                const ang = Phaser.Math.Angle.Between(enemy.x, enemy.y, nextTarget.x, nextTarget.y);
                const spd = 320;
                proj.setVelocity(Math.cos(ang) * spd, Math.sin(ang) * spd);
                if (window.soundManager) window.soundManager.playYarnBounce();
                return;
            }
        }

        if (proj.pierce) {
            proj.pierce--;
            if (proj.pierce <= 0) proj.destroy();
        } else if (!proj.isFish) {
            proj.destroy();
        }
    }

    handlePlayerEnemyCollision(player, enemy) {
        if (!enemy.active || this.invulnerableTimer > 0 || this.isGameOver) return;

        const rawDmg = enemy.damage || 12;
        this.applyPlayerDamage(rawDmg, enemy.x, enemy.y, false, enemy.isBoss);

        // Enemy lunge bite animation!
        this.tweens.add({
            targets: enemy,
            scaleX: (enemy.isBoss ? 1.4 : 1.25),
            scaleY: (enemy.isBoss ? 1.4 : 1.25),
            duration: 80,
            yoyo: true
        });
    }

    damageEnemy(enemy, amount) {
        if (!enemy.active) return;

        enemy.hp -= amount;
        this.showDamageText(enemy.x, enemy.y - 20, Math.round(amount), '#ffffff');

        enemy.setTint(0xff5555);
        this.time.delayedCall(80, () => {
            if (enemy && enemy.active) {
                enemy.clearTint();
                if (this.freezeTimer > 0) enemy.setTint(0x77ccee);
                else if (this.isAfkEnraged) enemy.setTint(0xff3333);
            }
        });

        // Show/update mini HP bar on hit
        this.showEnemyHpBar(enemy);

        if (window.soundManager) window.soundManager.playEnemyHit();

        if (enemy.hp <= 0) {
            this.killEnemy(enemy);
        }
    }

    showEnemyHpBar(enemy) {
        if (enemy.isBoss) return;
        if (!enemy.hpBarGraphics) {
            enemy.hpBarGraphics = this.add.graphics();
            enemy.hpBarGraphics.setDepth(9);
        }
        this.updateEnemyHpBar(enemy);
    }

    updateEnemyHpBar(enemy) {
        if (!enemy.hpBarGraphics || !enemy.active) return;
        const g = enemy.hpBarGraphics;
        g.clear();
        if (enemy.hp <= 0) return;

        const w = 28;
        const h = 4;
        const bx = enemy.x - w / 2;
        const by = enemy.y - (enemy.enemyType === 'dog' ? 32 : 26);
        const pct = Phaser.Math.Clamp(enemy.hp / enemy.maxHp, 0, 1);

        // Dark background border
        g.fillStyle(0x0a0a0a, 0.85);
        g.fillRect(bx - 1, by - 1, w + 2, h + 2);
        // Depleted red
        g.fillStyle(0x441111, 0.9);
        g.fillRect(bx, by, w, h);
        // Active health fill (crimson/amber)
        g.fillStyle(pct > 0.4 ? 0xff2222 : 0xff9900, 0.95);
        g.fillRect(bx, by, Math.max(1, Math.round(w * pct)), h);
    }

    killEnemy(enemy) {
        if (!enemy.active) return;

        // Clean up attached visual elements
        if (enemy.shadow) {
            enemy.shadow.destroy();
            enemy.shadow = null;
        }
        if (enemy.threatRing) {
            enemy.threatRing.destroy();
            enemy.threatRing = null;
        }
        if (enemy.hpBarGraphics) {
            enemy.hpBarGraphics.destroy();
            enemy.hpBarGraphics = null;
        }

        this.kills++;
        const ex = enemy.x;
        const ey = enemy.y;
        const isBoss = enemy.isBoss;

        if (isBoss) {
            this.cameras.main.flash(450, 255, 255, 255);
            this.cameras.main.shake(350, 0.02);
            if (window.soundManager) window.soundManager.playExplosion();

            this.spawnChest(ex, ey);

            for (let i = 0; i < 8; i++) {
                this.spawnDrop(ex + Phaser.Math.Between(-50, 50), ey + Phaser.Math.Between(-50, 50), false);
            }

            if (window.uiManager) {
                window.uiManager.recordBossDefeat();
                window.uiManager.hideBossBar();
            }
            this.activeBoss = null;
        } else {
            this.spawnDrop(ex, ey, false);
        }

        enemy.destroy();
        if (window.uiManager) window.uiManager.updateHUD();
    }

    spawnChest(x, y) {
        const chest = this.drops.create(x, y, 'drop_chest');
        chest.setDepth(6);
        chest.dropType = 'drop_chest';
        chest.body.setSize(32, 32);

        chest.setScale(0.3);
        this.tweens.add({
            targets: chest,
            scale: 1.2,
            duration: 350,
            ease: 'Back.out'
        });
    }

    spawnDrop(x, y, isBoss) {
        const roll = Math.random();
        let type = 'drop_xp';

        if (roll < 0.16) {
            type = 'drop_coin';
        } else if (roll < 0.28) {
            type = 'drop_heal';
        } else if (roll < 0.32) {
            type = 'drop_clock';
        } else if (roll < 0.35) {
            type = 'drop_bomb';
        }

        const drop = this.drops.create(x, y, type);
        drop.setDepth(5);
        drop.dropType = type;
        drop.body.setSize(20, 20);

        drop.setScale(0.2);
        this.tweens.add({
            targets: drop,
            scale: 1.0,
            duration: 250,
            ease: 'Back.out'
        });
    }

    updateDrops() {
        const px = this.player.x;
        const py = this.player.y;
        const rad = this.pickupRadius;

        this.drops.getChildren().forEach(drop => {
            if (!drop.active) return;
            const dist = Phaser.Math.Distance.Between(px, py, drop.x, drop.y);

            if (dist <= rad) {
                const ang = Phaser.Math.Angle.Between(drop.x, drop.y, px, py);
                const spd = 480;
                drop.x += Math.cos(ang) * spd * 0.016;
                drop.y += Math.sin(ang) * spd * 0.016;
            }
        });
    }

    collectDrop(drop) {
        if (!drop.active) return;

        const type = drop.dropType;
        drop.destroy();

        if (type === 'drop_chest') {
            if (window.soundManager) window.soundManager.playChestOpen();
            this.pauseGame();
            if (window.uiManager) window.uiManager.showChestModal();
            return;
        }

        if (type === 'drop_xp') {
            this.addXp(12);
            if (window.soundManager) window.soundManager.playXpPickup();
        } else if (type === 'drop_coin') {
            const coinVal = Math.round(1 * this.greedMultiplier);
            this.coins += coinVal;
            this.showDamageText(this.player.x, this.player.y - 25, `+${coinVal} ★`, '#f1c40f');
            if (window.soundManager) window.soundManager.playCoinPickup();
        } else if (type === 'drop_heal') {
            this.healPlayer(45);
            if (window.soundManager) window.soundManager.playCoinPickup();
        } else if (type === 'drop_clock') {
            this.triggerFreeze(4500);
        } else if (type === 'drop_bomb') {
            this.triggerScreenBomb(drop.x, drop.y);
        }

        if (window.uiManager) window.uiManager.updateHUD();
    }

    healPlayer(amount) {
        this.hp = Math.min(this.maxHp, this.hp + amount);
        this.showDamageText(this.player.x, this.player.y - 30, `+${amount} HP`, '#2ecc71');
        if (this.hp / this.maxHp > 0.35) {
            const vig = document.getElementById('damage-vignette');
            if (vig) vig.classList.remove('low-hp-pulse');
        }
        if (window.uiManager) window.uiManager.updateHUD();
    }

    triggerFreeze(durationMs) {
        this.freezeTimer = durationMs;
        this.enemies.getChildren().forEach(e => {
            if (e.active) e.setTint(0x77ccee);
        });
        if (window.soundManager) window.soundManager.playFreeze();
        this.showDamageText(this.player.x, this.player.y - 45, '❄️ ЗАМОРОЗКА! ❄️', '#3498db');
    }

    triggerScreenBomb(bx = null, by = null) {
        this.cameras.main.shake(250, 0.02);
        if (window.soundManager) window.soundManager.playExplosion();

        // Epicenter explosion FX
        if (bx !== null && by !== null) {
            const exp = this.add.sprite(bx, by, 'fx_mine_explosion');
            exp.setDepth(16);
            exp.setScale(1.8);
            exp.play('mine_explosion');
            exp.on('animationcomplete', () => exp.destroy());
        }

        const bounds = this.cameras.main.worldView;
        this.enemies.getChildren().forEach(e => {
            if (!e.active) return;
            if (Phaser.Geom.Rectangle.Contains(bounds, e.x, e.y)) {
                this.damageEnemy(e, 999);
            }
        });

        this.showDamageText(this.player.x, this.player.y - 45, '💥 БОМБА! 💥', '#e74c3c');
    }

    addXp(amount) {
        this.xp += amount;
        if (this.xp >= this.xpNeeded) {
            this.xp -= this.xpNeeded;
            this.level++;
            this.xpNeeded = Math.round(this.xpNeeded * 1.30 + 15);
            this.onLevelUp();
        }
    }

    onLevelUp() {
        if (window.soundManager) window.soundManager.playLevelUp();
        this.pauseGame();
        if (window.uiManager) {
            window.uiManager.showLevelUpModal();
        }
    }

    addOrUpgradeSkill(skillId) {
        const isEvolution = skillId.startsWith('evo_');

        if (isEvolution) {
            this.activeSkills[skillId] = 1;
            if (window.soundManager) window.soundManager.playEvolution();
            if (window.uiManager) window.uiManager.recordEvolutionCreated();
            this.showDamageText(this.player.x, this.player.y - 50, '✨ ЭВОЛЮЦИЯ! ✨', '#ffd700');
        } else {
            if (!this.activeSkills[skillId]) {
                this.activeSkills[skillId] = 1;
            } else {
                this.activeSkills[skillId]++;
            }
        }

        this.recalculateStats();

        if (skillId === 'aura' && this.auraVisual) {
            this.auraVisual.setAlpha(0.2);
        }

        if (window.uiManager) window.uiManager.updateHUD();
    }

    recalculateStats() {
        const catnipLvl = this.activeSkills.catnip || 0;
        this.attackSpeedMultiplier = 1.0 + (catnipLvl * 0.15);
        this.speed = (this.heroConfig.speed * (1 + this.metaTalents.speed * 0.08)) * (1.0 + catnipLvl * 0.10);

        const clawsLvl = this.activeSkills.claws || 0;
        this.damageMultiplier = (1 + (this.metaTalents.dmg * 0.1)) * (1.0 + clawsLvl * 0.20);

        const magnetLvl = this.activeSkills.magnet || 0;
        this.pickupRadius = (110 * (1 + this.metaTalents.magnet * 0.25)) * (1.0 + magnetLvl * 0.40);

        const armorLvl = this.activeSkills.armor || 0;
        this.damageReduction = Math.min(0.65, armorLvl * 0.12);
        this.maxHp = this.heroConfig.maxHp + (this.metaTalents.hp * 20) + (armorLvl * 25);
    }

    spawnEnemyWave() {
        if (this.isGameOver || this.isPaused) return;

        // Cap max active enemies to 40
        if (this.enemies.countActive(true) >= 40) return;

        const t = this.survivalTime;
        // Moderate scaling wave size
        let count = 2 + Math.floor(t / 25);
        if (count > 8) count = 8;

        let canSpawnDog = t >= 20;
        let canSpawnSpitter = t >= 35;
        let canSpawnPigeon = t >= 55;
        let canSpawnCucumber = t >= 80;
        
        // Boss Spawns: Scheduled checkpoints and periodic elite encounters
        if (!this.activeBoss) {
            const bossIntervals = [120, 270, 420, 570, 720, 870, 1020, 1170];
            for (let bTime of bossIntervals) {
                if (t >= bTime && t < bTime + 5 && (!this.spawnedBossTimes || !this.spawnedBossTimes.has(bTime))) {
                    if (!this.spawnedBossTimes) this.spawnedBossTimes = new Set();
                    this.spawnedBossTimes.add(bTime);
                    const bType = (bTime === 120 || bTime === 420 || bTime === 720 || bTime === 1020) ? 'boss_vacuum' : 'boss_dozer';
                    this.spawnSpecificEnemy(bType);
                    break;
                }
            }
        }

        for (let i = 0; i < count; i++) {
            let type = 'mouse';
            const roll = Math.random();
            if (canSpawnCucumber && roll < 0.18) {
                type = 'cucumber';
            } else if (canSpawnSpitter && roll < 0.38) {
                type = 'spitter'; // Ranged threat!
            } else if (canSpawnPigeon && roll < 0.60) {
                type = 'pigeon';
            } else if (canSpawnDog && roll < 0.82) {
                type = 'dog';
            }
            this.spawnSpecificEnemy(type);
        }
    }

    spawnSpecificEnemy(type) {
        const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
        const dist = Phaser.Math.Between(580, 720);
        const x = Phaser.Math.Clamp(this.player.x + Math.cos(angle) * dist, 70, this.arenaSize - 70);
        const y = Phaser.Math.Clamp(this.player.y + Math.sin(angle) * dist, 70, this.arenaSize - 70);

        const t = this.survivalTime;
        let spriteKey = 'enemy_mouse_walk';
        let animKey = 'mouse_walk';
        let hp = 24 + t * 0.45;
        let speed = 95;
        let damage = Math.round(10 + t * 0.045);
        let isBoss = false;
        let isRanged = false;

        if (type === 'dog') {
            spriteKey = 'enemy_dog_run';
            animKey = 'dog_run';
            hp = 42 + t * 0.6;
            speed = 125;
            damage = Math.round(15 + t * 0.065);
        } else if (type === 'pigeon') {
            spriteKey = 'enemy_pigeon_fly';
            animKey = 'pigeon_fly';
            hp = 28 + t * 0.45;
            speed = 135;
            damage = Math.round(12 + t * 0.045);
        } else if (type === 'spitter') {
            spriteKey = 'enemy_spitter_walk';
            animKey = 'spitter_walk';
            hp = 35 + t * 0.5;
            speed = 85;
            damage = Math.round(10 + t * 0.04);
            isRanged = true;
        } else if (type === 'cucumber') {
            spriteKey = 'enemy_cucumber_hop';
            animKey = 'cucumber_hop';
            hp = 85 + t * 1.0;
            speed = 78;
            damage = Math.round(22 + t * 0.085);
        } else if (type === 'boss_vacuum') {
            spriteKey = 'boss_vacuum_move';
            animKey = 'vacuum_move';
            hp = 650 + t * 3.0;
            speed = 75;
            damage = Math.round(36 + t * 0.1);
            isBoss = true;
        } else if (type === 'boss_dozer') {
            spriteKey = 'boss_bulldozer_move';
            animKey = 'bulldozer_move';
            hp = 1400 + t * 5.0;
            speed = 80;
            damage = Math.round(52 + t * 0.15);
            isBoss = true;
        }

        // Hardcore mode buffs if playing with Barsik
        if (this.isHardcoreHero) {
            hp *= 1.15;
            speed *= 1.15;
            damage = Math.round(damage * 1.25);
        }

        const enemy = this.enemies.create(x, y, spriteKey);
        enemy.play(animKey);
        enemy.setDepth(8);
        enemy.hp = hp;
        enemy.maxHp = hp;
        enemy.baseSpeed = speed;
        enemy.damage = damage;
        enemy.isBoss = isBoss;
        enemy.isRanged = isRanged;
        enemy.enemyType = type;
        enemy.lastShootTime = this.time.now + Phaser.Math.Between(500, 2000);

        // Ground Drop Shadow under enemy
        const shadow = this.add.image(x, y + 14, 'shadow_char');
        shadow.setDepth(6);
        shadow.setAlpha(0.65);
        if (isBoss) {
            shadow.setScale(type === 'boss_dozer' ? 2.5 : 2.0, 1.8);
        } else if (type === 'pigeon') {
            shadow.setScale(0.85, 0.6);
            shadow.setAlpha(0.45);
        } else if (type === 'dog') {
            shadow.setScale(1.2, 0.9);
        }
        enemy.shadow = shadow;

        // Subtle threat indicator ring under enemies
        const threatRing = this.add.image(x, y + 14, 'enemy_threat_ring');
        threatRing.setDepth(6);
        threatRing.setAlpha(isBoss ? 0.9 : 0.45);
        if (isBoss) {
            threatRing.setScale(type === 'boss_dozer' ? 2.4 : 1.9);
            this.tweens.add({
                targets: threatRing,
                scaleX: (type === 'boss_dozer' ? 2.7 : 2.2),
                scaleY: (type === 'boss_dozer' ? 2.7 : 2.2),
                alpha: 0.6,
                yoyo: true,
                repeat: -1,
                duration: 600
            });
        } else if (type === 'spitter') {
            threatRing.setTint(0x33ff66); // Neon toxic glow under ranged spitters
        }
        enemy.threatRing = threatRing;

        if (isBoss) {
            this.activeBoss = enemy;
            if (window.soundManager) window.soundManager.playBossWarning();
            if (window.uiManager) {
                window.uiManager.showBossBar(type === 'boss_dozer' ? 'ГЕНЕРАЛ МЯСОРУБКА' : 'РОБОТ-ПЫЛЕСОС', hp);
            }
            this.cameras.main.flash(500, 255, 60, 60);
            if (type === 'boss_dozer') {
                enemy.body.setSize(80, 80);
            } else {
                enemy.setScale(1.2);
                enemy.body.setSize(60, 60);
            }
        } else {
            enemy.body.setSize(34, 34);
        }
    }

    updateEnemies(time, delta) {
        const px = this.player.x;
        const py = this.player.y;
        const isFrozen = this.freezeTimer > 0;
        const enraged = this.isAfkEnraged;

        this.enemies.getChildren().forEach(e => {
            if (!e.active) return;

            // Follow position for shadow & threat ring
            const shadowOffsetY = e.enemyType === 'pigeon' ? 22 : 14;
            if (e.shadow && e.shadow.active) {
                e.shadow.setPosition(e.x, e.y + shadowOffsetY);
            }
            if (e.threatRing && e.threatRing.active) {
                e.threatRing.setPosition(e.x, e.y + shadowOffsetY);
            }
            if (e.hpBarGraphics && e.hpBarGraphics.active) {
                this.updateEnemyHpBar(e);
            }

            if (isFrozen) {
                e.body.setVelocity(0, 0);
                return;
            }

            const dist = Phaser.Math.Distance.Between(e.x, e.y, px, py);
            let spd = e.baseSpeed;
            if (e.valerianSlowTimer > 0) {
                e.valerianSlowTimer -= delta;
                spd *= 0.55;
            }

            if (enraged) {
                spd *= 1.45;
                e.setTint(0xff3333);
            } else if (!e.isBoss) {
                if (e.valerianSlowTimer > 0) {
                    e.setTint(0x76d7c4);
                } else {
                    e.clearTint();
                }
            }

            // Ranged spitter behavior
            if (e.isRanged) {
                const targetRange = 280;
                if (dist < targetRange - 40) {
                    // Back away if player gets too close
                    const ang = Phaser.Math.Angle.Between(px, py, e.x, e.y);
                    e.body.setVelocity(Math.cos(ang) * spd, Math.sin(ang) * spd);
                } else if (dist > targetRange + 60) {
                    // Approach player
                    const ang = Phaser.Math.Angle.Between(e.x, e.y, px, py);
                    e.body.setVelocity(Math.cos(ang) * spd, Math.sin(ang) * spd);
                } else {
                    // Circle around player
                    const ang = Phaser.Math.Angle.Between(e.x, e.y, px, py) + Math.PI / 2;
                    e.body.setVelocity(Math.cos(ang) * (spd * 0.7), Math.sin(ang) * (spd * 0.7));
                }

                // Shoot acid spitball
                if (time - e.lastShootTime > (enraged ? 1500 : 2500)) {
                    e.lastShootTime = time;
                    this.fireEnemyAcidSpit(e, px, py);
                }
            } else {
                // Direct pursuit
                const ang = Phaser.Math.Angle.Between(e.x, e.y, px, py);
                e.body.setVelocity(Math.cos(ang) * spd, Math.sin(ang) * spd);
            }

            // Flip orientation
            if (e.body.velocity.x < 0) e.setFlipX(true);
            else if (e.body.velocity.x > 0) e.setFlipX(false);
        });

        // Fish return update
        this.projectiles.getChildren().forEach(proj => {
            if (proj.active && proj.isFish && proj.returning) {
                const ang = Phaser.Math.Angle.Between(proj.x, proj.y, this.player.x, this.player.y);
                const spd = 420;
                proj.setVelocity(Math.cos(ang) * spd, Math.sin(ang) * spd);
                proj.rotation = ang;

                if (Phaser.Math.Distance.Between(proj.x, proj.y, this.player.x, this.player.y) < 32) {
                    proj.destroy();
                }
            }
        });
    }

    fireEnemyAcidSpit(enemy, px, py) {
        if (!enemy.active) return;

        const spit = this.enemyProjectiles.create(enemy.x, enemy.y, 'proj_enemy_acid');
        spit.setDepth(9);
        spit.damage = Math.round(18 + this.survivalTime * 0.075);
        spit.body.setSize(16, 16);

        const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, px, py);
        const spd = 260;
        spit.setVelocity(Math.cos(angle) * spd, Math.sin(angle) * spd);

        // Acid pulse & fade
        this.tweens.add({
            targets: spit,
            rotation: 6,
            duration: 1200
        });

        this.time.delayedCall(2200, () => {
            if (spit && spit.active) spit.destroy();
        });

        if (window.soundManager) window.soundManager.playSpit();
    }

    showDamageText(x, y, text, color = '#ffffff') {
        const dmgText = this.add.text(x, y, text, {
            fontSize: '18px',
            fontFamily: 'sans-serif',
            fontStyle: 'bold',
            fill: color,
            stroke: '#000000',
            strokeThickness: 3
        });
        dmgText.setOrigin(0.5);
        dmgText.setDepth(20);

        this.tweens.add({
            targets: dmgText,
            y: y - 35,
            alpha: 0,
            duration: 650,
            ease: 'Power1',
            onComplete: () => dmgText.destroy()
        });
    }

    pauseGame() {
        this.isPaused = true;
        this.physics.pause();
    }

    resumeGame() {
        this.isPaused = false;
        this.physics.resume();
    }

    revivePlayer() {
        this.hp = Math.round(this.maxHp * 0.75);
        this.invulnerableTimer = 3500;
        this.isGameOver = false;

        this.enemies.getChildren().forEach(e => {
            if (!e.active) return;
            const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, e.x, e.y);
            if (dist < 320) {
                this.damageEnemy(e, 100);
                const ang = Phaser.Math.Angle.Between(this.player.x, this.player.y, e.x, e.y);
                e.x += Math.cos(ang) * 160;
                e.y += Math.sin(ang) * 160;
            }
        });

        const vig = document.getElementById('damage-vignette');
        if (vig) vig.classList.remove('active', 'low-hp-pulse');

        this.resumeGame();
        if (window.uiManager) {
            window.uiManager.updateHUD();
            window.uiManager.hideGameOverModal();
        }
        if (window.soundManager) window.soundManager.playMeow();
    }

    triggerGameOver() {
        this.isGameOver = true;
        this.pauseGame();

        const vig = document.getElementById('damage-vignette');
        if (vig) vig.classList.remove('active', 'low-hp-pulse');

        if (window.soundManager) window.soundManager.playGameOver();
        if (window.uiManager) window.uiManager.showGameOverModal();
    }

    startEvacuationSequence() {
        try {
            this.evacTriggered = true;
            this.evacCountdown = 30;

            const banner = document.getElementById('evac-hud-banner');
            if (banner) banner.classList.remove('hidden');

            if (window.soundManager && typeof window.soundManager.playEvacAlarm === 'function') {
                window.soundManager.playEvacAlarm();
            }

            const center = this.arenaSize / 2;
            const padX = center;
            const padY = center;

            if (!this.helipad) {
                this.helipad = this.add.image(padX, padY, 'helipad_zone');
                this.helipad.setDepth(2);
                this.helipad.setScale(1.2);
                this.tweens.add({
                    targets: this.helipad,
                    scaleX: 1.35,
                    scaleY: 1.35,
                    alpha: 0.7,
                    yoyo: true,
                    repeat: -1,
                    duration: 700
                });
            }

            this.cameras.main.flash(500, 46, 204, 113);
            this.showDamageText(this.player.x, this.player.y - 60, '🚁 ЭВАКУАЦИЯ! БОРТ «9 ЖИЗНЕЙ» НА ПОДХОДЕ! 🚁', '#2ecc71');
        } catch (err) {
            console.error('Evacuation sequence error:', err);
        }
    }

    executeHelicopterRescue() {
        if (this.evacCompleted) return;
        this.evacCompleted = true;

        try {
            const banner = document.getElementById('evac-hud-banner');
            if (banner) banner.classList.add('hidden');

            // Immunity and pause game battle
            this.invulnerableTimer = 999999;
            this.isDashing = false;
            this.pauseGame();

            // Play cinematic in-game mini video ending cutscene!
            if (window.uiManager && typeof window.uiManager.playEndingCutscene === 'function') {
                window.uiManager.playEndingCutscene(() => {
                    this.triggerVictory();
                });
            } else {
                this.triggerVictory();
            }
        } catch (err) {
            console.error('Rescue execution error:', err);
            this.triggerVictory();
        }
    }

    triggerVictory() {
        this.isGameOver = true;
        this.pauseGame();

        const vig = document.getElementById('damage-vignette');
        if (vig) vig.classList.remove('active', 'low-hp-pulse');

        if (window.uiManager) {
            window.uiManager.showVictoryModal();
        }
    }

    resumeEndlessMode() {
        this.isEndlessMode = true;
        this.isGameOver = false;
        this.evacCompleted = true;
        this.invulnerableTimer = 2500;
        this.player.setAlpha(1);
        if (this.playerShadow) this.playerShadow.setAlpha(0.65);
        this.player.setScale(1);

        if (this.chopper) {
            this.chopper.destroy();
            this.chopper = null;
        }
        if (this.chopperRotor) {
            this.chopperRotor.destroy();
            this.chopperRotor = null;
        }
        if (this.chopperShadow) {
            this.chopperShadow.destroy();
            this.chopperShadow = null;
        }
        if (this.chopperDownwash) {
            this.chopperDownwash.destroy();
            this.chopperDownwash = null;
        }

        this.resumeGame();
        if (window.soundManager) window.soundManager.startMusic();

        this.showDamageText(this.player.x, this.player.y - 50, '⚔️ БЕСКОНЕЧНЫЙ РЕЖИМ! ⚔️', '#ffd700');
    }
}

window.GameScene = GameScene;
window.BootScene = BootScene;
