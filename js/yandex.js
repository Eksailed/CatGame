// Yandex Games SDK Integration Wrapper
class YandexSDKWrapper {
    constructor() {
        this.ysdk = null;
        this.player = null;
        this.isInitialized = false;
        this.lastInterstitialTime = 0;
        this.interstitialCooldown = 65000; // 65 seconds moderation safe cooldown
        this.lang = 'ru';
    }

    async init() {
        if (typeof YaGames === 'undefined') {
            console.warn('[YandexSDK] YaGames SDK script not found, running in local fallback mode');
            this.detectBrowserLang();
            return false;
        }

        try {
            this.ysdk = await YaGames.init();
            this.isInitialized = true;
            this.lang = this.ysdk.environment.i18n.lang || 'ru';
            console.log('[YandexSDK] Initialized successfully. Language:', this.lang);

            // Init player
            try {
                this.player = await this.ysdk.getPlayer({ scopes: false });
                console.log('[YandexSDK] Player initialized');
            } catch (err) {
                console.warn('[YandexSDK] Guest player mode:', err);
            }

            // Tell Yandex that the game is ready
            this.ready();
            return true;
        } catch (e) {
            console.error('[YandexSDK] Initialization error:', e);
            this.detectBrowserLang();
            return false;
        }
    }

    detectBrowserLang() {
        const navLang = (navigator.language || navigator.userLanguage || 'ru').toLowerCase();
        this.lang = navLang.startsWith('ru') ? 'ru' : 'en';
    }

    ready() {
        if (this.ysdk && this.ysdk.features && this.ysdk.features.LoadingAPI) {
            try {
                this.ysdk.features.LoadingAPI.ready();
                console.log('[YandexSDK] LoadingAPI.ready() signaled');
            } catch (e) {
                console.warn('[YandexSDK] Error calling ready():', e);
            }
        }
    }

    // Interstitial Ad with safe cooldown and sound auto-pause
    showInterstitial(onComplete = null) {
        const now = Date.now();
        if (now - this.lastInterstitialTime < this.interstitialCooldown) {
            console.log('[YandexSDK] Interstitial skipped due to cooldown');
            if (onComplete) onComplete(false);
            return;
        }

        if (!this.ysdk || !this.ysdk.adv) {
            console.log('[YandexSDK] Interstitial (Mock/Fallback)');
            if (onComplete) onComplete(true);
            return;
        }

        // Mute sound during ad
        const wasMuted = window.soundManager ? window.soundManager.muted : false;
        if (window.soundManager) window.soundManager.setMuted(true);

        this.ysdk.adv.showFullscreenAdv({
            callbacks: {
                onOpen: () => {
                    console.log('[YandexSDK] Interstitial opened');
                },
                onClose: (wasShown) => {
                    console.log('[YandexSDK] Interstitial closed, wasShown:', wasShown);
                    this.lastInterstitialTime = Date.now();
                    if (!wasMuted && window.soundManager) window.soundManager.setMuted(false);
                    if (onComplete) onComplete(wasShown);
                },
                onError: (error) => {
                    console.warn('[YandexSDK] Interstitial error:', error);
                    if (!wasMuted && window.soundManager) window.soundManager.setMuted(false);
                    if (onComplete) onComplete(false);
                }
            }
        });
    }

    // Rewarded Video Ad
    showRewarded(onRewarded, onClose = null) {
        if (!this.ysdk || !this.ysdk.adv) {
            console.log('[YandexSDK] Rewarded Ad (Mock fallback - granting reward)');
            if (onRewarded) onRewarded();
            if (onClose) onClose(true);
            return;
        }

        const wasMuted = window.soundManager ? window.soundManager.muted : false;
        if (window.soundManager) window.soundManager.setMuted(true);

        let rewarded = false;

        this.ysdk.adv.showRewardedVideo({
            callbacks: {
                onOpen: () => {
                    console.log('[YandexSDK] Rewarded ad opened');
                },
                onRewarded: () => {
                    console.log('[YandexSDK] User earned reward');
                    rewarded = true;
                    if (onRewarded) onRewarded();
                },
                onClose: () => {
                    console.log('[YandexSDK] Rewarded ad closed');
                    if (!wasMuted && window.soundManager) window.soundManager.setMuted(false);
                    if (onClose) onClose(rewarded);
                },
                onError: (e) => {
                    console.warn('[YandexSDK] Rewarded ad error:', e);
                    if (!wasMuted && window.soundManager) window.soundManager.setMuted(false);
                    if (onClose) onClose(false);
                }
            }
        });
    }

    // Cloud / Local Save
    async saveProgress(data) {
        const jsonStr = JSON.stringify(data);
        localStorage.setItem('cat_survivor_save', jsonStr);

        if (this.player) {
            try {
                await this.player.setData({ cat_survivor_save: jsonStr }, true);
                console.log('[YandexSDK] Cloud save successful');
            } catch (e) {
                console.warn('[YandexSDK] Cloud save failed, using local only:', e);
            }
        }
    }

    // Cloud / Local Load
    async loadProgress() {
        let rawData = null;

        if (this.player) {
            try {
                const cloudData = await this.player.getData(['cat_survivor_save']);
                if (cloudData && cloudData.cat_survivor_save) {
                    rawData = cloudData.cat_survivor_save;
                    console.log('[YandexSDK] Cloud save loaded');
                }
            } catch (e) {
                console.warn('[YandexSDK] Cloud load failed, fallback to local:', e);
            }
        }

        if (!rawData) {
            rawData = localStorage.getItem('cat_survivor_save');
        }

        if (rawData) {
            try {
                return JSON.parse(rawData);
            } catch (e) {
                console.error('Error parsing save data:', e);
            }
        }

        return null;
    }

    // Leaderboard submit score
    async setScore(score) {
        if (!this.ysdk) return;
        try {
            const lb = await this.ysdk.getLeaderboards();
            await lb.setLeaderboardScore('survivor_kills', score);
            console.log('[YandexSDK] Score submitted:', score);
        } catch (e) {
            console.warn('[YandexSDK] Leaderboard not available or failed:', e);
        }
    }
}

window.yandexSDK = new YandexSDKWrapper();
