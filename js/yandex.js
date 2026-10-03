// Unified Platform SDK: VK Games (VK Bridge) + Yandex Games SDK Wrapper
class PlatformSDKWrapper {
    constructor() {
        this.platform = 'local'; // 'vk', 'yandex', or 'local'
        this.ysdk = null;
        this.player = null;
        this.isInitialized = false;
        this.lastInterstitialTime = 0;
        this.interstitialCooldown = 60000; // 60s cooldown
        this.lang = 'ru';
    }

    async init() {
        const urlParams = new URLSearchParams(window.location.search);
        const hasVkParams = urlParams.has('vk_user_id') || urlParams.has('vk_app_id');

        // 1. Check for VK Bridge (VK Games)
        if (typeof vkBridge !== 'undefined' || hasVkParams) {
            try {
                if (typeof vkBridge !== 'undefined') {
                    await vkBridge.send('VKWebAppInit');
                    this.platform = 'vk';
                    this.isInitialized = true;
                    this.lang = 'ru';
                    console.log('[PlatformSDK] VK Bridge initialized successfully!');

                    // Banner/Ad warm up
                    try {
                        await vkBridge.send('VKWebAppCheckNativeAds', { ad_format: 'interstitial' });
                    } catch (e) {}
                    return true;
                }
            } catch (err) {
                console.warn('[PlatformSDK] VK Bridge init error, checking fallbacks:', err);
            }
        }

        // 2. Check for Yandex Games SDK
        if (typeof YaGames !== 'undefined') {
            try {
                this.ysdk = await YaGames.init();
                this.platform = 'yandex';
                this.isInitialized = true;
                this.lang = this.ysdk.environment.i18n.lang || 'ru';
                console.log('[PlatformSDK] Yandex Games SDK initialized. Lang:', this.lang);

                try {
                    this.player = await this.ysdk.getPlayer({ scopes: false });
                } catch (err) {
                    console.warn('[PlatformSDK] Yandex guest mode:', err);
                }

                this.ready();
                return true;
            } catch (e) {
                console.error('[PlatformSDK] Yandex init error:', e);
            }
        }

        // 3. Fallback to Local Mode
        this.platform = 'local';
        this.detectBrowserLang();
        console.log('[PlatformSDK] Running in standalone local mode. Platform:', this.platform);
        return false;
    }

    detectBrowserLang() {
        const navLang = (navigator.language || navigator.userLanguage || 'ru').toLowerCase();
        this.lang = navLang.startsWith('ru') ? 'ru' : 'en';
    }

    ready() {
        if (this.platform === 'yandex' && this.ysdk && this.ysdk.features && this.ysdk.features.LoadingAPI) {
            try {
                this.ysdk.features.LoadingAPI.ready();
            } catch (e) {}
        }
    }

    // Interstitial Ad with cooldown and sound auto-pause
    showInterstitial(onComplete = null) {
        const now = Date.now();
        if (now - this.lastInterstitialTime < this.interstitialCooldown) {
            console.log('[PlatformSDK] Interstitial skipped due to cooldown');
            if (onComplete) onComplete(false);
            return;
        }

        const wasMuted = window.soundManager ? window.soundManager.muted : false;
        if (window.soundManager) window.soundManager.setMuted(true);

        const restoreSound = () => {
            if (!wasMuted && window.soundManager) window.soundManager.setMuted(false);
        };

        // VK Games Ads
        if (this.platform === 'vk' && typeof vkBridge !== 'undefined') {
            vkBridge.send('VKWebAppShowNativeAds', { ad_format: 'interstitial' })
                .then(data => {
                    this.lastInterstitialTime = Date.now();
                    restoreSound();
                    if (onComplete) onComplete(data && data.result);
                })
                .catch(err => {
                    console.warn('[PlatformSDK] VK Interstitial ad error/closed:', err);
                    restoreSound();
                    if (onComplete) onComplete(false);
                });
            return;
        }

        // Yandex Games Ads
        if (this.platform === 'yandex' && this.ysdk && this.ysdk.adv) {
            this.ysdk.adv.showFullscreenAdv({
                callbacks: {
                    onClose: (wasShown) => {
                        this.lastInterstitialTime = Date.now();
                        restoreSound();
                        if (onComplete) onComplete(wasShown);
                    },
                    onError: (error) => {
                        restoreSound();
                        if (onComplete) onComplete(false);
                    }
                }
            });
            return;
        }

        // Local Fallback
        restoreSound();
        if (onComplete) onComplete(true);
    }

    // Rewarded Video Ad
    showRewarded(onRewarded, onClose = null) {
        const wasMuted = window.soundManager ? window.soundManager.muted : false;
        if (window.soundManager) window.soundManager.setMuted(true);

        const restoreSound = () => {
            if (!wasMuted && window.soundManager) window.soundManager.setMuted(false);
        };

        // VK Games Rewarded Ads
        if (this.platform === 'vk' && typeof vkBridge !== 'undefined') {
            vkBridge.send('VKWebAppShowNativeAds', { ad_format: 'reward' })
                .then(data => {
                    restoreSound();
                    if (data && data.result) {
                        if (onRewarded) onRewarded();
                        if (onClose) onClose(true);
                    } else {
                        if (onClose) onClose(false);
                    }
                })
                .catch(err => {
                    console.warn('[PlatformSDK] VK Rewarded ad error/closed:', err);
                    restoreSound();
                    if (onClose) onClose(false);
                });
            return;
        }

        // Yandex Games Rewarded Ads
        if (this.platform === 'yandex' && this.ysdk && this.ysdk.adv) {
            let rewarded = false;
            this.ysdk.adv.showRewardedVideo({
                callbacks: {
                    onRewarded: () => {
                        rewarded = true;
                        if (onRewarded) onRewarded();
                    },
                    onClose: () => {
                        restoreSound();
                        if (onClose) onClose(rewarded);
                    },
                    onError: () => {
                        restoreSound();
                        if (onClose) onClose(false);
                    }
                }
            });
            return;
        }

        // Local Fallback (Mock reward granted)
        restoreSound();
        if (onRewarded) onRewarded();
        if (onClose) onClose(true);
    }

    // Cloud / Local Save
    async saveProgress(data) {
        const jsonStr = JSON.stringify(data);
        localStorage.setItem('cat_survivor_save', jsonStr);

        // VK Cloud Storage
        if (this.platform === 'vk' && typeof vkBridge !== 'undefined') {
            try {
                await vkBridge.send('VKWebAppStorageSet', {
                    key: 'cat_survivor_save',
                    value: jsonStr
                });
                console.log('[PlatformSDK] VK Cloud save successful');
            } catch (e) {
                console.warn('[PlatformSDK] VK Cloud save failed, using local only:', e);
            }
            return;
        }

        // Yandex Cloud Storage
        if (this.platform === 'yandex' && this.player) {
            try {
                await this.player.setData({ cat_survivor_save: jsonStr }, true);
                console.log('[PlatformSDK] Yandex Cloud save successful');
            } catch (e) {
                console.warn('[PlatformSDK] Yandex Cloud save failed, using local only:', e);
            }
        }
    }

    // Cloud / Local Load
    async loadProgress() {
        let rawData = null;

        // VK Cloud Load
        if (this.platform === 'vk' && typeof vkBridge !== 'undefined') {
            try {
                const res = await vkBridge.send('VKWebAppStorageGet', { keys: ['cat_survivor_save'] });
                if (res && res.keys && res.keys.length > 0 && res.keys[0].value) {
                    rawData = res.keys[0].value;
                    console.log('[PlatformSDK] VK Cloud save loaded');
                }
            } catch (e) {
                console.warn('[PlatformSDK] VK Cloud load failed, fallback to local:', e);
            }
        }

        // Yandex Cloud Load
        if (!rawData && this.platform === 'yandex' && this.player) {
            try {
                const cloudData = await this.player.getData(['cat_survivor_save']);
                if (cloudData && cloudData.cat_survivor_save) {
                    rawData = cloudData.cat_survivor_save;
                    console.log('[PlatformSDK] Yandex Cloud save loaded');
                }
            } catch (e) {
                console.warn('[PlatformSDK] Yandex Cloud load failed, fallback to local:', e);
            }
        }

        // Local Storage Fallback
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
        if (this.platform === 'vk' && typeof vkBridge !== 'undefined') {
            try {
                await vkBridge.send('VKWebAppShowLeaderBoardBox', { user_result: score });
            } catch (e) {}
            return;
        }

        if (this.platform === 'yandex' && this.ysdk) {
            try {
                const lb = await this.ysdk.getLeaderboards();
                await lb.setLeaderboardScore('survivor_kills', score);
            } catch (e) {}
        }
    }
}

// Aliases for seamless backwards compatibility
const platformSDK = new PlatformSDKWrapper();
window.platformSDK = platformSDK;
window.yandexSDK = platformSDK;
