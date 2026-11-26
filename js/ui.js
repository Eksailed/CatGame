// UI, HUD, Modals, Quests, Lucky Chest, Meta-Shop & Game Flow Manager

class UIManager {
    constructor() {
        this.gameInstance = null;
        this.gameScene = null;
        this.reviveUsedInRun = false;
        this.doubleCoinsUsed = false;
        
        // Persistent Save State
        this.totalCoins = 0;
        this.unlockedHeroes = ['barsik'];
        this.selectedHeroId = 'barsik';
        this.selectedModeId = 'park';
        this.isHardcoreMode = false;
        this.metaTalents = { hp: 0, dmg: 0, speed: 0, greed: 0, magnet: 0 };
        this.claimedQuests = [];
        this.bestTime = 0;
        this.bestKills = 0;
        this.bossDefeated = false;
        this.dozerDefeated = false;
        this.evoCreated = false;
        this.discoveredEvos = [];
        this.hardcoreVictory = false;
        this.maxLevelReached = 1;
        this.dailyStreak = 0;
        this.lastDailyClaimDate = null;
        this.victoryDoubleUsed = false;

        window.selectedHeroId = this.selectedHeroId;
        window.selectedModeId = this.selectedModeId;
        window.isHardcoreMode = this.isHardcoreMode;
        window.metaTalents = this.metaTalents;

        this.init();
    }

    async init() {
        await this.loadSaveData();
        this.bindEvents();
        this.renderMainMenu();
        this.updateLocalization();
        this.updateQuestBadge();
        this.updateDailyBadge();
        // Background pre-warm Phaser engine and assets to eliminate initial freeze
        setTimeout(() => this.initPhaserGame(), 100);
    }

    async loadSaveData() {
        if (window.yandexSDK) {
            const data = await window.yandexSDK.loadProgress();
            if (data) {
                this.totalCoins = data.totalCoins || 0;
                this.unlockedHeroes = data.unlockedHeroes || ['barsik'];
                this.selectedHeroId = data.selectedHeroId || 'barsik';
                this.selectedModeId = data.selectedModeId || 'park';
                this.isHardcoreMode = Boolean(data.isHardcoreMode);
                this.metaTalents = data.metaTalents || { hp: 0, dmg: 0, speed: 0, greed: 0, magnet: 0 };
                this.claimedQuests = data.claimedQuests || [];
                this.bestTime = data.bestTime || 0;
                this.bestKills = data.bestKills || 0;
                this.bossDefeated = data.bossDefeated || false;
                this.dozerDefeated = data.dozerDefeated || false;
                this.evoCreated = data.evoCreated || false;
                this.discoveredEvos = data.discoveredEvos || [];
                this.hardcoreVictory = data.hardcoreVictory || false;
                this.maxLevelReached = data.maxLevelReached || 1;
                this.dailyStreak = data.dailyStreak || 0;
                this.lastDailyClaimDate = data.lastDailyClaimDate || null;
                window.selectedHeroId = this.selectedHeroId;
                window.selectedModeId = this.selectedModeId;
                window.isHardcoreMode = this.isHardcoreMode;
                window.metaTalents = this.metaTalents;
            }
        }
    }

    async saveGameData() {
        const data = {
            totalCoins: this.totalCoins,
            unlockedHeroes: this.unlockedHeroes,
            selectedHeroId: this.selectedHeroId,
            selectedModeId: this.selectedModeId,
            isHardcoreMode: this.isHardcoreMode,
            metaTalents: this.metaTalents,
            claimedQuests: this.claimedQuests,
            bestTime: this.bestTime,
            bestKills: this.bestKills,
            bossDefeated: this.bossDefeated,
            dozerDefeated: this.dozerDefeated,
            evoCreated: this.evoCreated,
            discoveredEvos: this.discoveredEvos,
            hardcoreVictory: this.hardcoreVictory,
            maxLevelReached: this.maxLevelReached,
            dailyStreak: this.dailyStreak,
            lastDailyClaimDate: this.lastDailyClaimDate
        };
        if (window.yandexSDK) {
            await window.yandexSDK.saveProgress(data);
        }
    }

    t(key) {
        const lang = (window.yandexSDK && window.yandexSDK.lang) ? window.yandexSDK.lang : 'ru';
        const dict = I18N[lang] || I18N.ru;
        return dict[key] || key;
    }

    updateLocalization() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            el.innerText = this.t(key);
        });
    }

    bindEvents() {
        // Hero Carousel Navigation
        const prevHeroBtn = document.getElementById('btn-prev-hero');
        const nextHeroBtn = document.getElementById('btn-next-hero');

        const cycleHero = (dir) => {
            if (window.soundManager) window.soundManager.playClick();
            let curIdx = CHARACTERS.findIndex(c => c.id === this.selectedHeroId);
            if (curIdx === -1) curIdx = 0;
            curIdx = (curIdx + dir + CHARACTERS.length) % CHARACTERS.length;
            const targetHero = CHARACTERS[curIdx];
            this.selectedHeroId = targetHero.id;
            window.selectedHeroId = targetHero.id;
            if (this.unlockedHeroes.includes(targetHero.id)) {
                this.saveGameData();
            }
            this.renderMainMenu();
        };

        if (prevHeroBtn) {
            prevHeroBtn.addEventListener('click', () => cycleHero(-1));
        }
        if (nextHeroBtn) {
            nextHeroBtn.addEventListener('click', () => cycleHero(1));
        }

        const heroBox = document.querySelector('.hero-preview-box');
        if (heroBox) {
            heroBox.style.cursor = 'pointer';
            heroBox.addEventListener('click', () => {
                if (window.soundManager) window.soundManager.playClick();
                this.showHeroesModal();
            });
        }

        // Play button
        document.getElementById('btn-play').addEventListener('click', () => {
            if (window.soundManager) window.soundManager.playClick();
            this.startGame();
        });

        // Heroes Modal button
        document.getElementById('btn-heroes').addEventListener('click', () => {
            if (window.soundManager) window.soundManager.playClick();
            this.showHeroesModal();
        });

        // Upgrades Modal button
        document.getElementById('btn-shop').addEventListener('click', () => {
            if (window.soundManager) window.soundManager.playClick();
            this.showShopModal();
        });

        // Quests Modal button
        document.getElementById('btn-quests').addEventListener('click', () => {
            if (window.soundManager) window.soundManager.playClick();
            this.showQuestsModal();
        });

        // Codex & Daily buttons
        const btnCodex = document.getElementById('btn-codex');
        if (btnCodex) {
            btnCodex.addEventListener('click', () => {
                if (window.soundManager) window.soundManager.playClick();
                this.showCodexModal();
            });
        }
        const btnDaily = document.getElementById('btn-daily');
        if (btnDaily) {
            btnDaily.addEventListener('click', () => {
                if (window.soundManager) window.soundManager.playClick();
                this.showDailyModal();
            });
        }
        const btnClaimDaily = document.getElementById('btn-claim-daily');
        if (btnClaimDaily) {
            btnClaimDaily.addEventListener('click', () => {
                this.claimDailyReward();
            });
        }

        // Hardcore Mode Toggle
        const hardcoreToggle = document.getElementById('toggle-hardcore');
        if (hardcoreToggle) {
            hardcoreToggle.checked = this.isHardcoreMode;
            hardcoreToggle.addEventListener('change', (e) => {
                if (window.soundManager) window.soundManager.playClick();
                this.isHardcoreMode = e.target.checked;
                window.isHardcoreMode = this.isHardcoreMode;
                this.saveGameData();
            });
        }

        // Close Modals
        document.getElementById('btn-close-heroes').addEventListener('click', () => {
            if (window.soundManager) window.soundManager.playClick();
            document.getElementById('modal-heroes').classList.add('hidden');
        });
        document.getElementById('btn-close-shop').addEventListener('click', () => {
            if (window.soundManager) window.soundManager.playClick();
            document.getElementById('modal-shop').classList.add('hidden');
            this.renderMainMenu();
        });
        document.getElementById('btn-close-quests').addEventListener('click', () => {
            if (window.soundManager) window.soundManager.playClick();
            document.getElementById('modal-quests').classList.add('hidden');
            this.renderMainMenu();
        });
        const btnCloseCodex = document.getElementById('btn-close-codex');
        if (btnCloseCodex) {
            btnCloseCodex.addEventListener('click', () => {
                if (window.soundManager) window.soundManager.playClick();
                document.getElementById('modal-codex').classList.add('hidden');
            });
        }
        const btnCloseDaily = document.getElementById('btn-close-daily');
        if (btnCloseDaily) {
            btnCloseDaily.addEventListener('click', () => {
                if (window.soundManager) window.soundManager.playClick();
                document.getElementById('modal-daily').classList.add('hidden');
            });
        }

        const btnPauseCodex = document.getElementById('btn-pause-codex');
        if (btnPauseCodex) {
            btnPauseCodex.addEventListener('click', () => {
                if (window.soundManager) window.soundManager.playClick();
                this.showCodexModal();
            });
        }

        // Sound Toggle
        const soundBtn = document.getElementById('btn-sound-toggle');
        soundBtn.addEventListener('click', () => {
            if (window.soundManager) {
                const isMuted = window.soundManager.toggleMute();
                soundBtn.innerText = isMuted ? '🔇' : '🔊';
            }
        });

        // Pause button
        document.getElementById('btn-pause').addEventListener('click', () => {
            this.togglePause();
        });

        // Resume button
        document.getElementById('btn-resume').addEventListener('click', () => {
            this.togglePause();
        });

        // Pause to Menu button
        document.getElementById('btn-pause-menu').addEventListener('click', () => {
            if (window.soundManager) window.soundManager.playClick();
            document.getElementById('modal-pause').classList.add('hidden');
            this.exitToMenu();
        });

        // Global Esc Key Listener for Pause and Modal Navigation
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' || e.key === 'Esc' || e.code === 'Escape') {
                // If in menu modals, close them
                const heroesModal = document.getElementById('modal-heroes');
                const shopModal = document.getElementById('modal-shop');
                const questsModal = document.getElementById('modal-quests');
                const codexModal = document.getElementById('modal-codex');
                const dailyModal = document.getElementById('modal-daily');

                if (codexModal && !codexModal.classList.contains('hidden')) {
                    if (window.soundManager) window.soundManager.playClick();
                    codexModal.classList.add('hidden');
                    return;
                }
                if (dailyModal && !dailyModal.classList.contains('hidden')) {
                    if (window.soundManager) window.soundManager.playClick();
                    dailyModal.classList.add('hidden');
                    return;
                }

                if (heroesModal && !heroesModal.classList.contains('hidden')) {
                    if (window.soundManager) window.soundManager.playClick();
                    heroesModal.classList.add('hidden');
                    return;
                }
                if (shopModal && !shopModal.classList.contains('hidden')) {
                    if (window.soundManager) window.soundManager.playClick();
                    shopModal.classList.add('hidden');
                    this.renderMainMenu();
                    return;
                }
                if (questsModal && !questsModal.classList.contains('hidden')) {
                    if (window.soundManager) window.soundManager.playClick();
                    questsModal.classList.add('hidden');
                    this.renderMainMenu();
                    return;
                }

                // In gameplay, toggle pause
                this.togglePause();
            }
        });

        // Mobile Dash & Ultimate buttons
        const dashBtn = document.getElementById('btn-hud-dash');
        if (dashBtn) {
            dashBtn.addEventListener('pointerdown', (e) => {
                e.stopPropagation();
                if (this.gameScene) this.gameScene.tryDash();
            });
        }
        const ultBtn = document.getElementById('btn-hud-ult');
        if (ultBtn) {
            ultBtn.addEventListener('pointerdown', (e) => {
                e.stopPropagation();
                if (this.gameScene) this.gameScene.tryUltimate();
            });
        }

        // Restart button in Game Over
        document.getElementById('btn-restart').addEventListener('click', () => {
            if (window.soundManager) window.soundManager.playClick();
            if (window.yandexSDK) {
                window.yandexSDK.showInterstitial(() => {
                    this.startGame();
                });
            } else {
                this.startGame();
            }
        });

        // Menu button in Game Over
        document.getElementById('btn-gameover-menu').addEventListener('click', () => {
            if (window.soundManager) window.soundManager.playClick();
            if (window.yandexSDK) {
                window.yandexSDK.showInterstitial(() => {
                    this.exitToMenu();
                });
            } else {
                this.exitToMenu();
            }
        });

        // Revive Ad Button
        document.getElementById('btn-revive').addEventListener('click', () => {
            if (this.reviveUsedInRun) return;
            if (window.soundManager) window.soundManager.playClick();
            
            const doRevive = () => {
                this.reviveUsedInRun = true;
                const scene = this.gameScene || (this.gameInstance && this.gameInstance.scene ? this.gameInstance.scene.getScene('GameScene') : null);
                if (scene && typeof scene.revivePlayer === 'function') {
                    scene.revivePlayer();
                } else {
                    this.hideGameOverModal();
                }
            };

            if (window.yandexSDK) {
                window.yandexSDK.showRewarded(() => {
                    doRevive();
                });
            } else {
                doRevive();
            }
        });

        // Double Coins Ad Button
        document.getElementById('btn-double-coins').addEventListener('click', () => {
            if (this.doubleCoinsUsed || !this.gameScene) return;
            if (window.soundManager) window.soundManager.playClick();

            if (window.yandexSDK) {
                window.yandexSDK.showRewarded(() => {
                    this.doubleCoinsUsed = true;
                    const bonus = this.gameScene.coins;
                    this.totalCoins += bonus;
                    this.gameScene.coins *= 2;
                    this.saveGameData();
                    document.getElementById('go-coins').innerHTML = `${this.gameScene.coins} <img src="assets/ui_coin.png" class="ui-coin-icon" alt="Coins" /> (x2!)`;
                    document.getElementById('btn-double-coins').style.display = 'none';
                });
            } else {
                this.doubleCoinsUsed = true;
                this.totalCoins += this.gameScene.coins;
                this.gameScene.coins *= 2;
                this.saveGameData();
                document.getElementById('go-coins').innerHTML = `${this.gameScene.coins} <img src="assets/ui_coin.png" class="ui-coin-icon" alt="Coins" /> (x2!)`;
                document.getElementById('btn-double-coins').style.display = 'none';
            }
        });

        // Victory Modal Buttons
        const btnVicMenu = document.getElementById('btn-victory-menu');
        if (btnVicMenu) {
            btnVicMenu.addEventListener('click', () => {
                if (window.soundManager) window.soundManager.playClick();
                this.hideVictoryModal();
                if (window.yandexSDK) {
                    window.yandexSDK.showInterstitial(() => this.exitToMenu());
                } else {
                    this.exitToMenu();
                }
            });
        }

        const btnVicEndless = document.getElementById('btn-victory-endless');
        if (btnVicEndless) {
            btnVicEndless.addEventListener('click', () => {
                if (window.soundManager) window.soundManager.playClick();
                this.hideVictoryModal();
                if (this.gameScene) {
                    this.gameScene.resumeEndlessMode();
                }
            });
        }

        const btnVicDouble = document.getElementById('btn-victory-double');
        if (btnVicDouble) {
            btnVicDouble.addEventListener('click', () => {
                if (this.victoryDoubleUsed || !this.gameScene) return;
                if (window.soundManager) window.soundManager.playClick();

                const grantDouble = () => {
                    this.victoryDoubleUsed = true;
                    const bonus = (this.gameScene.coins + 500);
                    this.totalCoins += bonus;
                    this.saveGameData();
                    document.getElementById('vic-coins').innerHTML = `${(this.gameScene.coins + 500) * 2} <img src="assets/ui_coin.png" class="ui-coin-icon" alt="Coins" /> (x2!)`;
                    btnVicDouble.style.display = 'none';
                };

                if (window.yandexSDK) {
                    window.yandexSDK.showRewarded(grantDouble);
                } else {
                    grantDouble();
                }
            });
        }

        // Reroll Upgrades Button
        document.getElementById('btn-reroll-upgrade').addEventListener('click', () => {
            if (window.soundManager) window.soundManager.playClick();
            if (window.yandexSDK) {
                window.yandexSDK.showRewarded(() => {
                    this.renderUpgradeCards();
                });
            } else {
                this.renderUpgradeCards();
            }
        });

        // Lucky Chest Claim Button
        document.getElementById('btn-claim-chest').addEventListener('click', () => {
            if (window.soundManager) window.soundManager.playClick();
            document.getElementById('modal-chest').classList.add('hidden');
            if (this.gameScene) this.gameScene.resumeGame();
        });
    }

    renderMainMenu() {
        document.getElementById('screen-menu').classList.remove('hidden');
        document.getElementById('screen-game').classList.add('hidden');
        document.getElementById('modal-heroes').classList.add('hidden');
        document.getElementById('modal-shop').classList.add('hidden');
        document.getElementById('modal-quests').classList.add('hidden');
        document.getElementById('modal-gameover').classList.add('hidden');
        document.getElementById('modal-levelup').classList.add('hidden');
        document.getElementById('modal-chest').classList.add('hidden');
        const codexM = document.getElementById('modal-codex');
        if (codexM) codexM.classList.add('hidden');
        const dailyM = document.getElementById('modal-daily');
        if (dailyM) dailyM.classList.add('hidden');

        // Coins & Highscore
        document.getElementById('menu-total-coins').innerHTML = `${this.totalCoins} <img src="assets/ui_coin.png" class="ui-coin-icon" alt="Coins" />`;

        const mins = Math.floor(this.bestTime / 60).toString().padStart(2, '0');
        const secs = (this.bestTime % 60).toString().padStart(2, '0');
        const recordPill = document.getElementById('menu-record-pill');
        if (recordPill) {
            recordPill.innerHTML = `<img src="assets/ui_trophy.png" class="ui-stat-icon" alt="Record" /> ${mins}:${secs} &nbsp;|&nbsp; <img src="assets/ui_skull.png" class="ui-stat-icon" alt="Kills" /> ${this.bestKills}`;
        }

        // Hero Card Preview
        const curHero = CHARACTERS.find(c => c.id === this.selectedHeroId) || CHARACTERS[0];
        const isUnlocked = this.unlockedHeroes.includes(curHero.id);

        const heroNameEl = document.getElementById('menu-selected-hero-name');
        if (heroNameEl) {
            heroNameEl.innerHTML = this.t(curHero.nameKey) + (!isUnlocked ? ` 🔒 (${curHero.price} <img src="assets/ui_coin.png" class="ui-coin-icon" alt="Coins" />)` : '');
        }

        const heroImgEl = document.getElementById('menu-selected-hero-img');
        if (heroImgEl) {
            heroImgEl.src = `assets/${curHero.sprite}.png`;
            heroImgEl.style.filter = !isUnlocked ? 'grayscale(0.7) brightness(0.7)' : 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.6))';
        }

        const hpBadge = document.getElementById('menu-hero-hp-badge');
        if (hpBadge) {
            hpBadge.innerText = `❤️ ${curHero.maxHp} HP`;
        }

        const spdBadge = document.getElementById('menu-hero-spd-badge');
        if (spdBadge) {
            spdBadge.innerText = `⚡ ${curHero.speed}`;
        }

        const ultBadge = document.getElementById('menu-hero-ult-badge');
        if (ultBadge) {
            ultBadge.innerText = `${curHero.ultIcon || '⚡'} Ульта`;
        }

        const weaponImg = document.getElementById('menu-hero-weapon-img');
        const weaponSkill = SKILLS_DATABASE[curHero.startingWeapon];
        if (weaponImg && weaponSkill) {
            weaponImg.src = `assets/${weaponSkill.icon}.png`;
            weaponImg.title = this.t(weaponSkill.nameKey);
        }

        const hardcoreToggle = document.getElementById('toggle-hardcore');
        if (hardcoreToggle) {
            hardcoreToggle.checked = this.isHardcoreMode;
        }

        this.renderModeSelector();
        this.updateQuestBadge();
        this.updateDailyBadge();
    }

    renderModeSelector() {
        const wrap = document.getElementById('mode-selector');
        if (!wrap || typeof GAME_MODES === 'undefined') return;
        wrap.innerHTML = '';

        GAME_MODES.forEach(mode => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = `mode-pill ${this.selectedModeId === mode.id ? 'active' : ''}`;
            const mins = Math.round(mode.evacSeconds / 60);
            btn.title = this.t(mode.descKey);
            btn.innerHTML = `
                <span>${mode.icon} ${this.t(mode.nameKey)}</span>
                <small>${mins} мин • x${mode.coinMult}🪙</small>
            `;
            btn.addEventListener('click', () => {
                if (window.soundManager) window.soundManager.playClick();
                this.selectedModeId = mode.id;
                window.selectedModeId = mode.id;
                this.saveGameData();
                this.renderModeSelector();
            });
            wrap.appendChild(btn);
        });
    }

    getQuestState() {
        return {
            bestTime: this.bestTime,
            bestKills: this.bestKills,
            bossDefeated: this.bossDefeated,
            dozerDefeated: this.dozerDefeated,
            evoCreated: this.evoCreated,
            discoveredEvos: this.discoveredEvos,
            hardcoreVictory: this.hardcoreVictory,
            maxLevelReached: this.maxLevelReached
        };
    }

    updateQuestBadge() {
        const state = this.getQuestState();
        const readyCount = QUESTS.filter(q => !this.claimedQuests.includes(q.id) && q.check(state)).length;
        const badge = document.getElementById('quests-badge');
        if (badge) {
            if (readyCount > 0) {
                badge.innerText = readyCount;
                badge.classList.remove('hidden');
            } else {
                badge.classList.add('hidden');
            }
        }
    }

    getTodayDateStr() {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }

    canClaimDaily() {
        return this.lastDailyClaimDate !== this.getTodayDateStr();
    }

    updateDailyBadge() {
        const badge = document.getElementById('daily-badge');
        if (badge) {
            if (this.canClaimDaily()) {
                badge.innerText = '1';
                badge.classList.remove('hidden');
            } else {
                badge.classList.add('hidden');
            }
        }
    }

    showDailyModal() {
        const grid = document.getElementById('daily-grid');
        const claimBtn = document.getElementById('btn-claim-daily');
        if (!grid || typeof DAILY_REWARDS === 'undefined') return;

        grid.innerHTML = '';
        const canClaim = this.canClaimDaily();
        const currentIdx = this.dailyStreak % DAILY_REWARDS.length;

        DAILY_REWARDS.forEach((reward, idx) => {
            const isClaimed = idx < currentIdx || (!canClaim && idx === currentIdx);
            const isToday = canClaim && idx === currentIdx;
            const card = document.createElement('div');
            card.className = `daily-card ${isClaimed ? 'claimed' : isToday ? 'today' : ''}`;
            card.innerHTML = `
                <span style="font-weight:800;">${reward.label}</span>
                <span style="color:#ffd32a; font-weight:900; font-size:0.95rem;">+${reward.coins} <img src="assets/ui_coin.png" class="ui-coin-icon" style="width:16px;height:16px;" /></span>
                <span style="font-size:0.7rem; color:${isClaimed ? '#2ecc71' : isToday ? '#ffd32a' : '#94a3b8'};">
                    ${isClaimed ? '✓' : isToday ? 'СЕГОДНЯ' : '🔒'}
                </span>
            `;
            grid.appendChild(card);
        });

        if (claimBtn) {
            claimBtn.disabled = !canClaim;
            claimBtn.className = `btn ${canClaim ? 'btn-green' : 'btn-disabled'}`;
            claimBtn.innerText = canClaim ? `ЗАБРАТЬ +${DAILY_REWARDS[currentIdx].coins} 🪙` : 'УЖЕ ПОЛУЧЕНО СЕГОДНЯ ✓';
        }

        document.getElementById('modal-daily').classList.remove('hidden');
    }

    claimDailyReward() {
        if (!this.canClaimDaily() || typeof DAILY_REWARDS === 'undefined') return;
        const currentIdx = this.dailyStreak % DAILY_REWARDS.length;
        const reward = DAILY_REWARDS[currentIdx];

        this.totalCoins += reward.coins;
        this.lastDailyClaimDate = this.getTodayDateStr();
        this.dailyStreak = (this.dailyStreak + 1) % DAILY_REWARDS.length;
        this.saveGameData();

        if (window.soundManager) window.soundManager.playLevelUp();
        this.renderMainMenu();
        this.showDailyModal();
    }

    showCodexModal() {
        const list = document.getElementById('codex-list');
        if (!list) return;
        list.innerHTML = '';

        const weaponsWithEvo = Object.values(SKILLS_DATABASE).filter(s => s.type === 'weapon' && s.evoId);
        weaponsWithEvo.forEach(w => {
            const passive = SKILLS_DATABASE[w.evoPassive];
            const evo = SKILLS_DATABASE[w.evoId];
            if (!passive || !evo) return;
            const isDiscovered = this.discoveredEvos.includes(evo.id);

            const row = document.createElement('div');
            row.className = `codex-row ${isDiscovered ? 'discovered' : ''}`;
            row.innerHTML = `
                <div class="codex-formula">
                    <img src="assets/${w.icon}.png" title="${this.t(w.nameKey)}" />
                    <span style="font-weight:900; color:#94a3b8;">+</span>
                    <img src="assets/${passive.icon}.png" title="${this.t(passive.nameKey)}" />
                    <span style="font-weight:900; color:#ffd700;">=</span>
                    <img src="assets/${evo.icon}.png" style="border:1.5px solid #ffd700;" title="${this.t(evo.nameKey)}" />
                </div>
                <div class="codex-info">
                    <h4>${this.t(evo.nameKey)} ${isDiscovered ? '🌟' : ''}</h4>
                    <p>${this.t(w.nameKey)} + ${this.t(passive.nameKey)}</p>
                </div>
            `;
            list.appendChild(row);
        });

        document.getElementById('modal-codex').classList.remove('hidden');
    }

    showQuestsModal() {
        const container = document.getElementById('quests-list');
        container.innerHTML = '';

        const state = this.getQuestState();

        QUESTS.forEach(quest => {
            const isClaimed = this.claimedQuests.includes(quest.id);
            const isCompleted = quest.check(state);

            const item = document.createElement('div');
            item.className = `quest-item ${isClaimed ? 'claimed' : isCompleted ? 'ready' : ''}`;
            item.innerHTML = `
                <div class="quest-info">
                    <h4>${this.t(quest.textKey)}</h4>
                    <span class="quest-reward">+${quest.reward} <img src="assets/ui_coin.png" class="ui-coin-icon" alt="Coins" /></span>
                </div>
                <div class="quest-action">
                    ${isClaimed 
                        ? `<button class="btn btn-sm btn-disabled" disabled>${this.t('claimed')}</button>`
                        : isCompleted
                            ? `<button class="btn btn-sm btn-accent claim-quest-btn" data-id="${quest.id}" data-reward="${quest.reward}">${this.t('claim')}</button>`
                            : `<button class="btn btn-sm btn-secondary" disabled>0 / 1</button>`
                    }
                </div>
            `;
            container.appendChild(item);
        });

        container.querySelectorAll('.claim-quest-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const reward = parseInt(btn.getAttribute('data-reward'), 10);
                this.claimedQuests.push(id);
                this.totalCoins += reward;
                this.saveGameData();
                this.renderMainMenu();
                this.showQuestsModal();
                if (window.soundManager) window.soundManager.playCoinPickup();
            });
        });

        document.getElementById('modal-quests').classList.remove('hidden');
    }

    showHeroesModal() {
        const container = document.getElementById('heroes-list');
        container.innerHTML = '';

        CHARACTERS.forEach(hero => {
            const isUnlocked = this.unlockedHeroes.includes(hero.id);
            const isSelected = this.selectedHeroId === hero.id;

            const card = document.createElement('div');
            card.className = `hero-card ${isSelected ? 'selected' : ''} ${!isUnlocked ? 'locked' : ''}`;
            card.innerHTML = `
                <img src="assets/${hero.sprite}.png" class="hero-avatar" />
                <div class="hero-info">
                    <h4>${this.t(hero.nameKey)}</h4>
                    <p class="hero-desc">${this.t(hero.descKey)}</p>
                    <div class="hero-stats">
                        <span>❤️ HP: ${hero.maxHp}</span>
                        <span>⚡ ${this.t('speed')}: ${hero.speed}</span>
                        <span>${hero.ultIcon || '⚡'} ${this.t('ult')}</span>
                    </div>
                </div>
                <div class="hero-action">
                    ${isSelected 
                        ? `<button class="btn btn-sm btn-disabled" disabled>${this.t('selected')}</button>`
                        : isUnlocked
                            ? `<button class="btn btn-sm btn-primary select-hero-btn" data-id="${hero.id}">${this.t('select')}</button>`
                            : `<button class="btn btn-sm btn-accent buy-hero-btn" data-id="${hero.id}">${hero.price} <img src="assets/ui_coin.png" class="ui-coin-icon" alt="Coins" /></button>`
                    }
                </div>
            `;
            container.appendChild(card);
        });

        container.querySelectorAll('.select-hero-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                this.selectedHeroId = id;
                window.selectedHeroId = id;
                this.saveGameData();
                this.renderMainMenu();
                this.showHeroesModal();
                if (window.soundManager) window.soundManager.playClick();
            });
        });

        container.querySelectorAll('.buy-hero-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const hero = CHARACTERS.find(c => c.id === id);
                if (hero && this.totalCoins >= hero.price) {
                    this.totalCoins -= hero.price;
                    this.unlockedHeroes.push(id);
                    this.selectedHeroId = id;
                    window.selectedHeroId = id;
                    this.saveGameData();
                    this.renderMainMenu();
                    this.showHeroesModal();
                    if (window.soundManager) window.soundManager.playCoinPickup();
                } else {
                    if (window.soundManager) window.soundManager.playNoise(0.2, 0.2);
                }
            });
        });

        document.getElementById('modal-heroes').classList.remove('hidden');
    }

    showShopModal() {
        const container = document.getElementById('shop-list');
        container.innerHTML = '';
        document.getElementById('shop-coins-val').innerText = `${this.totalCoins}`;

        TALENTS.forEach(talent => {
            const curLevel = this.metaTalents[talent.id] || 0;
            const isMax = curLevel >= talent.maxLvl;
            const cost = Math.round(talent.baseCost * Math.pow(talent.costMult, curLevel));

            const item = document.createElement('div');
            item.className = 'shop-item';
            item.innerHTML = `
                <div class="shop-item-info">
                    <h4>${this.t(talent.nameKey)} <span class="badge">Ур. ${curLevel}/${talent.maxLvl}</span></h4>
                    <p>${this.t(talent.descKey)}</p>
                </div>
                <div class="shop-item-action">
                    ${isMax 
                        ? `<button class="btn btn-sm btn-disabled" disabled>${this.t('maxLevel')}</button>`
                        : `<button class="btn btn-sm ${this.totalCoins >= cost ? 'btn-accent' : 'btn-disabled'} buy-talent-btn" data-id="${talent.id}" data-cost="${cost}">
                            ${cost} <img src="assets/ui_coin.png" class="ui-coin-icon" alt="Coins" />
                           </button>`
                    }
                </div>
            `;
            container.appendChild(item);
        });

        container.querySelectorAll('.buy-talent-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = btn.getAttribute('data-id');
                const cost = parseInt(btn.getAttribute('data-cost'), 10);
                if (this.totalCoins >= cost) {
                    this.totalCoins -= cost;
                    this.metaTalents[id] = (this.metaTalents[id] || 0) + 1;
                    window.metaTalents = this.metaTalents;
                    this.saveGameData();
                    this.showShopModal();
                    if (window.soundManager) window.soundManager.playCoinPickup();
                } else {
                    if (window.soundManager) window.soundManager.playNoise(0.2, 0.2);
                }
            });
        });

        document.getElementById('modal-shop').classList.remove('hidden');
    }

    initPhaserGame() {
        if (this.gameInstance) return;
        const config = {
            type: Phaser.AUTO,
            parent: 'game-canvas-container',
            scale: {
                mode: Phaser.Scale.RESIZE,
                width: '100%',
                height: '100%'
            },
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 0 },
                    debug: false
                }
            },
            scene: [BootScene, GameScene],
            backgroundColor: '#27ae60'
        };
        this.gameInstance = new Phaser.Game(config);
    }

    startGame() {
        if (!this.unlockedHeroes.includes(this.selectedHeroId)) {
            if (window.soundManager) window.soundManager.playNoise(0.2, 0.2);
            this.showHeroesModal();
            return;
        }

        document.getElementById('screen-menu').classList.add('hidden');
        document.getElementById('modal-gameover').classList.add('hidden');
        document.getElementById('screen-game').classList.remove('hidden');

        this.reviveUsedInRun = false;
        this.doubleCoinsUsed = false;
        this.victoryDoubleUsed = false;
        window.gameStarted = true;

        const btnVicDouble = document.getElementById('btn-victory-double');
        if (btnVicDouble) btnVicDouble.style.display = 'block';
        const comboBadge = document.getElementById('hud-combo-badge');
        if (comboBadge) comboBadge.classList.add('hidden');
        const evacBanner = document.getElementById('evac-hud-banner');
        if (evacBanner) evacBanner.classList.add('hidden');

        // Set Hero Ult icon on HUD button & show brief onboarding tip
        const curHero = CHARACTERS.find(c => c.id === this.selectedHeroId) || CHARACTERS[0];
        const ultBtn = document.getElementById('btn-hud-ult');
        if (ultBtn) {
            ultBtn.innerHTML = `${curHero.ultIcon || '⚡'}<span class="hud-key-cap">E</span>`;
            ultBtn.style.opacity = '1.0';
        }
        const onboarding = document.getElementById('hud-onboarding');
        if (onboarding) {
            onboarding.classList.remove('hidden');
            if (this._onboardingTimer) clearTimeout(this._onboardingTimer);
            this._onboardingTimer = setTimeout(() => {
                if (onboarding) onboarding.classList.add('hidden');
            }, 6000);
        }

        if (!this.gameInstance) {
            this.initPhaserGame();
        } else {
            const boot = this.gameInstance.scene.getScene('BootScene');
            const gameScene = this.gameInstance.scene.getScene('GameScene');
            if (!boot || !boot.assetsReady) {
                // BootScene.create() will start GameScene automatically because window.gameStarted is true
            } else if (gameScene && gameScene.scene.isActive()) {
                gameScene.scene.restart();
            } else {
                this.gameInstance.scene.start('GameScene');
            }
        }
    }

    onGameStart(scene) {
        this.gameScene = scene;
        this.hideBossBar();
        this.updateHUD();
    }

    updateHUD() {
        if (!this.gameScene) return;

        // Health
        const hpPercent = Math.max(0, Math.min(100, (this.gameScene.hp / this.gameScene.maxHp) * 100));
        document.getElementById('hud-hp-fill').style.width = `${hpPercent}%`;
        document.getElementById('hud-hp-text').innerText = `${Math.ceil(this.gameScene.hp)} / ${this.gameScene.maxHp}`;

        // XP
        const xpPercent = Math.max(0, Math.min(100, (this.gameScene.xp / this.gameScene.xpNeeded) * 100));
        document.getElementById('hud-xp-fill').style.width = `${xpPercent}%`;
        document.getElementById('hud-lvl').innerText = `${this.t('level')} ${this.gameScene.level}`;

        // Time
        const mins = Math.floor(this.gameScene.survivalTime / 60).toString().padStart(2, '0');
        const secs = (this.gameScene.survivalTime % 60).toString().padStart(2, '0');
        document.getElementById('hud-time').innerHTML = `<img src="assets/ui_clock.png" class="ui-stat-icon" alt="Time" /> ${mins}:${secs}`;

        // Kills & Coins
        document.getElementById('hud-kills').innerHTML = `<img src="assets/ui_skull.png" class="ui-stat-icon" alt="Kills" /> ${this.gameScene.kills}`;
        document.getElementById('hud-coins').innerHTML = `${this.gameScene.coins} <img src="assets/ui_coin.png" class="ui-coin-icon" alt="Coins" />`;

        if (this.gameScene.level > this.maxLevelReached) {
            this.maxLevelReached = this.gameScene.level;
        }

        // Active Skills bar
        this.renderSkillsTray();
    }

    renderSkillsTray() {
        const tray = document.getElementById('hud-skills-tray');
        tray.innerHTML = '';
        Object.entries(this.gameScene.activeSkills).forEach(([skillId, lvl]) => {
            const data = SKILLS_DATABASE[skillId];
            if (!data) return;
            const badge = document.createElement('div');
            badge.className = `skill-badge ${data.type === 'evolution' ? 'skill-badge-evo' : ''}`;
            badge.innerHTML = `
                <img src="assets/${data.icon}.png" alt="${this.t(data.nameKey)}" />
                <span class="skill-lvl">${data.type === 'evolution' ? 'EVO' : lvl}</span>
            `;
            tray.appendChild(badge);
        });
    }

    // Boss Bar
    showBossBar(name, maxHp) {
        const bar = document.getElementById('boss-bar-wrap');
        if (bar) {
            document.getElementById('boss-name').innerText = name;
            document.getElementById('boss-hp-fill').style.width = '100%';
            bar.classList.remove('hidden');
        }
    }

    updateBossBar(hp, maxHp) {
        const fill = document.getElementById('boss-hp-fill');
        if (fill) {
            const pct = Math.max(0, Math.min(100, (hp / maxHp) * 100));
            fill.style.width = `${pct}%`;
        }
    }

    hideBossBar() {
        const bar = document.getElementById('boss-bar-wrap');
        if (bar) {
            bar.classList.add('hidden');
        }
    }

    // Dash & Ultimate UI
    onDashUsed(cooldownMs) {
        const btn = document.getElementById('btn-hud-dash');
        if (btn) {
            btn.classList.add('dash-cooling');
            btn.style.opacity = '0.4';
            setTimeout(() => {
                btn.classList.remove('dash-cooling');
                btn.style.opacity = '1.0';
            }, cooldownMs);
        }
    }

    onUltUsed(cooldownMs) {
        const btn = document.getElementById('btn-hud-ult');
        if (btn) {
            btn.style.opacity = '0.35';
            setTimeout(() => {
                btn.style.opacity = '1.0';
            }, cooldownMs);
        }
    }

    updateCombo(count) {
        const badge = document.getElementById('hud-combo-badge');
        if (!badge) return;
        if (count >= 5) {
            badge.innerText = `🔥 x${count}`;
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    }

    // Level Up Modal
    showLevelUpModal() {
        const modal = document.getElementById('modal-levelup');
        modal.classList.remove('hidden');
        this.renderUpgradeCards();
    }

    renderUpgradeCards() {
        const container = document.getElementById('upgrade-cards');
        container.innerHTML = '';

        // Check for possible evolutions first!
        const possibleEvos = [];
        Object.values(SKILLS_DATABASE).forEach(w => {
            if (w.type === 'weapon' && w.evoId && !this.gameScene.activeSkills[w.evoId]) {
                const wLvl = this.gameScene.activeSkills[w.id] || 0;
                const pLvl = this.gameScene.activeSkills[w.evoPassive] || 0;
                if (wLvl >= 5 && pLvl >= 1) {
                    possibleEvos.push(SKILLS_DATABASE[w.evoId]);
                }
            }
        });

        // Standard available upgrades
        const available = Object.values(SKILLS_DATABASE).filter(s => {
            if (s.type === 'evolution') return false;
            const curLvl = this.gameScene.activeSkills[s.id] || 0;
            return curLvl < s.maxLevel;
        });

        // Combine: Prioritize an evolution if available
        let choices = [];
        if (possibleEvos.length > 0) {
            choices.push(possibleEvos[0]);
        }

        const remainingChoices = available.sort(() => 0.5 - Math.random());
        while (choices.length < 3 && remainingChoices.length > 0) {
            const next = remainingChoices.pop();
            if (!choices.includes(next)) {
                choices.push(next);
            }
        }

        choices.forEach(skill => {
            const isEvo = skill.type === 'evolution';
            const curLvl = this.gameScene.activeSkills[skill.id] || 0;
            const isNew = curLvl === 0 && !isEvo;

            let evoHintHtml = '';
            if (skill.type === 'weapon' && skill.evoId && skill.evoPassive) {
                const passive = SKILLS_DATABASE[skill.evoPassive];
                const evo = SKILLS_DATABASE[skill.evoId];
                if (passive && evo) {
                    evoHintHtml = `<div class="card-evo-hint"><img src="assets/${passive.icon}.png" /> + ${this.t(passive.nameKey)} → ${this.t(evo.nameKey)}</div>`;
                }
            } else if (skill.type === 'passive') {
                const matchingWeapons = Object.values(SKILLS_DATABASE).filter(w => w.type === 'weapon' && w.evoPassive === skill.id);
                if (matchingWeapons.length > 0) {
                    const names = matchingWeapons.map(w => this.t(w.nameKey)).join(', ');
                    evoHintHtml = `<div class="card-evo-hint">⚡ Эволюция: ${names}</div>`;
                }
            }

            const card = document.createElement('div');
            card.className = `upgrade-card ${isEvo ? 'upgrade-card-evo' : ''}`;
            card.innerHTML = `
                <div class="card-icon-wrap ${isEvo ? 'card-icon-evo' : ''}">
                    <img src="assets/${skill.icon}.png" class="card-icon" />
                </div>
                <div class="card-details">
                    <div class="card-title-row">
                        <h4>${this.t(skill.nameKey)}</h4>
                        <span class="badge ${isEvo ? 'badge-evo' : isNew ? 'badge-new' : ''}">
                            ${isEvo ? '🌟 ЭВОЛЮЦИЯ!' : isNew ? 'НОВОЕ!' : `Ур. ${curLvl + 1}`}
                        </span>
                    </div>
                    <p class="card-desc">${this.t(skill.descKey)}</p>
                    ${evoHintHtml}
                </div>
            `;

            card.addEventListener('click', () => {
                if (window.soundManager) window.soundManager.playClick();
                this.gameScene.addOrUpgradeSkill(skill.id);
                document.getElementById('modal-levelup').classList.add('hidden');
                this.gameScene.resumeGame();
            });

            container.appendChild(card);
        });
    }

    // Lucky Mystery Chest Modal
    showChestModal() {
        const modal = document.getElementById('modal-chest');
        modal.classList.remove('hidden');

        const rewardList = document.getElementById('chest-rewards-list');
        rewardList.innerHTML = '';

        // Bonus coins
        const bonusCoins = Phaser.Math.Between(40, 100);
        this.gameScene.coins += bonusCoins;

        // Upgrade or evolution
        const possibleEvos = [];
        Object.values(SKILLS_DATABASE).forEach(w => {
            if (w.type === 'weapon' && w.evoId && !this.gameScene.activeSkills[w.evoId]) {
                const wLvl = this.gameScene.activeSkills[w.id] || 0;
                const pLvl = this.gameScene.activeSkills[w.evoPassive] || 0;
                if (wLvl >= 5 && pLvl >= 1) {
                    possibleEvos.push(SKILLS_DATABASE[w.evoId]);
                }
            }
        });

        let grantedItem = null;
        if (possibleEvos.length > 0) {
            grantedItem = possibleEvos[0];
            this.gameScene.addOrUpgradeSkill(grantedItem.id);
        } else {
            const available = Object.values(SKILLS_DATABASE).filter(s => {
                if (s.type === 'evolution') return false;
                const curLvl = this.gameScene.activeSkills[s.id] || 0;
                return curLvl < s.maxLevel;
            });
            if (available.length > 0) {
                grantedItem = available[Math.floor(Math.random() * available.length)];
                this.gameScene.addOrUpgradeSkill(grantedItem.id);
            }
        }

        if (grantedItem) {
            rewardList.innerHTML = `
                <div class="chest-reward-item">
                    <img src="assets/${grantedItem.icon}.png" class="card-icon" />
                    <div>
                        <h4>${this.t(grantedItem.nameKey)}</h4>
                        <p>${this.t(grantedItem.descKey)}</p>
                    </div>
                </div>
                <div class="chest-reward-coins" style="display: flex; align-items: center; justify-content: center; gap: 6px;">
                    <img src="assets/ui_coin.png" class="ui-coin-icon" alt="Coins" /> +${bonusCoins} Монет!
                </div>
            `;
        } else {
            rewardList.innerHTML = `
                <div class="chest-reward-coins" style="display: flex; align-items: center; justify-content: center; gap: 6px;">
                    <img src="assets/ui_coin.png" class="ui-coin-icon" alt="Coins" /> +${bonusCoins * 2} Монет!
                </div>
            `;
            this.gameScene.coins += bonusCoins;
        }

        this.updateHUD();
    }

    recordBossDefeat(isDozer = false) {
        this.bossDefeated = true;
        if (isDozer) this.dozerDefeated = true;
        this.saveGameData();
        this.updateQuestBadge();
    }

    recordEvolutionCreated(evoId = null) {
        this.evoCreated = true;
        if (evoId && !this.discoveredEvos.includes(evoId)) {
            this.discoveredEvos.push(evoId);
        }
        this.saveGameData();
        this.updateQuestBadge();
    }

    renderDamageStats(containerId) {
        const box = document.getElementById(containerId);
        if (!box || !this.gameScene || !this.gameScene.damageStats) return;

        const entries = Object.entries(this.gameScene.damageStats).filter(([, dmg]) => dmg > 0);
        if (entries.length === 0) {
            box.classList.add('hidden');
            return;
        }

        entries.sort((a, b) => b[1] - a[1]);
        const maxDmg = entries[0][1];
        const totalDmg = entries.reduce((sum, [, d]) => sum + d, 0);

        const labelMap = {
            ult_hero: { name: 'Ульта героя', icon: 'assets/ui_trophy.png' },
            tnt_barrel: { name: 'Взрывные бочки', icon: 'assets/obstacle_tnt_barrel.png' },
            drop_bomb: { name: 'Бомбочки', icon: 'assets/drop_bomb.png' },
            revive_nova: { name: 'Воскрешение', icon: 'assets/ui_coin.png' },
            other: { name: 'Прочее', icon: 'assets/ui_skull.png' }
        };

        let html = `<div class="damage-stats-title">⚔️ ${this.t('damageStatsTitle')}</div>`;
        entries.slice(0, 6).forEach(([id, dmg]) => {
            const skill = SKILLS_DATABASE[id];
            const name = skill ? this.t(skill.nameKey) : (labelMap[id] ? labelMap[id].name : id);
            const icon = skill ? `assets/${skill.icon}.png` : (labelMap[id] ? labelMap[id].icon : 'assets/ui_skull.png');
            const pct = Math.round((dmg / maxDmg) * 100);
            const share = Math.round((dmg / totalDmg) * 100);
            html += `
                <div class="dmg-stat-row">
                    <img src="${icon}" alt="${name}" />
                    <div class="dmg-bar-wrap">
                        <div class="dmg-bar-labels">
                            <span>${name}</span>
                            <span>${dmg} (${share}%)</span>
                        </div>
                        <div class="dmg-bar-track">
                            <div class="dmg-bar-fill" style="width:${pct}%"></div>
                        </div>
                    </div>
                </div>
            `;
        });

        box.innerHTML = html;
        box.classList.remove('hidden');
    }

    showGameOverModal() {
        const modal = document.getElementById('modal-gameover');
        modal.classList.remove('hidden');

        const mins = Math.floor(this.gameScene.survivalTime / 60).toString().padStart(2, '0');
        const secs = (this.gameScene.survivalTime % 60).toString().padStart(2, '0');
        document.getElementById('go-time').innerText = `${mins}:${secs}`;
        document.getElementById('go-kills').innerText = `${this.gameScene.kills}`;
        document.getElementById('go-coins').innerHTML = `${this.gameScene.coins} <img src="assets/ui_coin.png" class="ui-coin-icon" alt="Coins" />`;
        this.renderDamageStats('go-damage-stats');

        this.totalCoins += this.gameScene.coins;
        if (this.gameScene.survivalTime > this.bestTime) this.bestTime = this.gameScene.survivalTime;
        if (this.gameScene.kills > this.bestKills) this.bestKills = this.gameScene.kills;
        this.saveGameData();

        if (window.yandexSDK) {
            window.yandexSDK.setScore(this.gameScene.kills);
        }

        const reviveBtn = document.getElementById('btn-revive');
        reviveBtn.style.display = this.reviveUsedInRun ? 'none' : 'block';

        const doubleBtn = document.getElementById('btn-double-coins');
        doubleBtn.style.display = this.gameScene.coins > 0 ? 'block' : 'none';

        this.updateQuestBadge();
    }

    hideGameOverModal() {
        document.getElementById('modal-gameover').classList.add('hidden');
    }

    playEndingCutscene(onComplete) {
        const overlay = document.getElementById('cutscene-overlay');
        const video = document.getElementById('in-game-cutscene-video');
        const skipBtn = document.getElementById('btn-skip-cutscene');

        if (!overlay || !video) {
            if (onComplete) onComplete();
            return;
        }

        overlay.classList.remove('hidden');

        // Synchronized sound effects during the in-game movie
        if (window.soundManager) {
            if (typeof window.soundManager.playEvacAlarm === 'function') {
                window.soundManager.playEvacAlarm();
            }
            if (typeof window.soundManager.playChopperRotor === 'function') {
                window.soundManager.playChopperRotor();
            }
            setTimeout(() => {
                if (window.soundManager && typeof window.soundManager.playVictoryFanfare === 'function') {
                    window.soundManager.playVictoryFanfare();
                }
            }, 4100);
        }

        let finished = false;
        const finishCutscene = () => {
            if (finished) return;
            finished = true;
            try { video.pause(); } catch (e) {}
            overlay.classList.add('hidden');
            if (onComplete) onComplete();
        };

        if (skipBtn) {
            skipBtn.onclick = (e) => {
                e.stopPropagation();
                if (window.soundManager && typeof window.soundManager.playClick === 'function') {
                    window.soundManager.playClick();
                }
                finishCutscene();
            };
        }

        video.currentTime = 0;
        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.catch(err => {
                console.warn('Cutscene video autoplay notice:', err);
            });
        }

        video.onended = () => {
            finishCutscene();
        };

        // Safety fallback timer (8s)
        setTimeout(() => {
            if (!finished) finishCutscene();
        }, 8000);
    }

    showVictoryModal() {
        const modal = document.getElementById('modal-victory');
        if (!modal) return;
        modal.classList.remove('hidden');

        const mins = Math.floor(this.gameScene.survivalTime / 60).toString().padStart(2, '0');
        const secs = (this.gameScene.survivalTime % 60).toString().padStart(2, '0');
        document.getElementById('vic-time').innerText = `${mins}:${secs}`;
        document.getElementById('vic-kills').innerText = `${this.gameScene.kills}`;
        document.getElementById('vic-coins').innerHTML = `${this.gameScene.coins} <img src="assets/ui_coin.png" class="ui-coin-icon" alt="Coins" />`;
        this.renderDamageStats('vic-damage-stats');

        // Victory bonus +500 coins!
        const victoryBonus = 500;
        this.totalCoins += this.gameScene.coins + victoryBonus;
        if (this.gameScene.survivalTime > this.bestTime) this.bestTime = this.gameScene.survivalTime;
        if (this.gameScene.kills > this.bestKills) this.bestKills = this.gameScene.kills;
        this.saveGameData();

        if (window.yandexSDK) {
            window.yandexSDK.setScore(this.gameScene.kills);
        }

        if (window.soundManager) {
            window.soundManager.playVictoryFanfare();
        }

        this.updateQuestBadge();

        const vid = document.getElementById('victory-video');
        if (vid) {
            vid.currentTime = 0;
            vid.play().catch(() => {});
        }
    }

    hideVictoryModal() {
        const modal = document.getElementById('modal-victory');
        if (modal) modal.classList.add('hidden');
        const vid = document.getElementById('victory-video');
        if (vid) vid.pause();
    }

    exitToMenu() {
        if (this.gameScene) {
            this.gameScene.scene.stop();
        }
        if (window.soundManager) {
            window.soundManager.stopMusic();
        }
        this.renderMainMenu();
    }

    togglePause() {
        if (!this.gameScene || this.gameScene.isGameOver) return;
        const pauseModal = document.getElementById('modal-pause');
        if (!pauseModal) return;

        // If game screen is hidden, do nothing
        const gameScreen = document.getElementById('screen-game');
        if (gameScreen && gameScreen.classList.contains('hidden')) return;

        // Don't toggle pause if blocking modal is active
        const lvlModal = document.getElementById('modal-levelup');
        const chestModal = document.getElementById('modal-chest');
        const goModal = document.getElementById('modal-gameover');
        const vicModal = document.getElementById('modal-victory');
        const cutscene = document.getElementById('cutscene-overlay');
        if (lvlModal && !lvlModal.classList.contains('hidden')) return;
        if (chestModal && !chestModal.classList.contains('hidden')) return;
        if (goModal && !goModal.classList.contains('hidden')) return;
        if (vicModal && !vicModal.classList.contains('hidden')) return;
        if (cutscene && !cutscene.classList.contains('hidden')) return;

        if (window.soundManager) window.soundManager.playClick();

        const isPaused = !pauseModal.classList.contains('hidden');
        if (isPaused) {
            pauseModal.classList.add('hidden');
            this.gameScene.resumeGame();
        } else {
            this.gameScene.pauseGame();
            pauseModal.classList.remove('hidden');
        }
    }

    showJoystick(x, y) {
        const base = document.getElementById('joystick-base');
        const knob = document.getElementById('joystick-knob');
        if (base && knob) {
            base.style.left = `${x}px`;
            base.style.top = `${y}px`;
            knob.style.transform = `translate(-50%, -50%) translate(0px, 0px)`;
            base.classList.remove('hidden');
        }
    }

    updateJoystickKnob(dx, dy) {
        const knob = document.getElementById('joystick-knob');
        if (knob) {
            knob.style.transform = `translate(-50%, -50%) translate(${dx}px, ${dy}px)`;
        }
    }

    hideJoystick() {
        const base = document.getElementById('joystick-base');
        if (base) {
            base.classList.add('hidden');
        }
    }
}

window.addEventListener('DOMContentLoaded', async () => {
    window.uiManager = new UIManager();
    if (window.yandexSDK) {
        try {
            await window.yandexSDK.init();
            await window.uiManager.loadSaveData();
            window.uiManager.renderMainMenu();
            window.uiManager.updateLocalization();
        } catch (e) {
            console.warn('[PlatformSDK] Init fallback:', e);
        }
    }
});
