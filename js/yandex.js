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
        const inIframe = (window.parent !== window);
        this.isInsideVK = hasVkParams || inIframe;

        // 1. Check for VK Bridge (VK Games)
        if (typeof vkBridge !== 'undefined') {
            try {
                await vkBridge.send('VKWebAppInit');
                this.platform = 'vk';
                this.isInitialized = true;
                this.lang = 'ru';
                console.log('[PlatformSDK] VK Bridge initialized successfully! Inside VK:', this.isInsideVK);

                // Show bottom banner ad if running inside VK
                if (this.isInsideVK) {
                    setTimeout(() => {
                        this.showBanner();
                    }, 3500);
                }
                return true;
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

    // VK Sticky Banner Ad
    showBanner() {
        if (this.platform === 'vk' && typeof vkBridge !== 'undefined' && this.isInsideVK) {
            vkBridge.send('VKWebAppShowBannerAd', { banner_location: 'bottom' })
                .then(data => console.log('[PlatformSDK] VK Banner shown:', data))
                .catch(err => console.warn('[PlatformSDK] VK Banner ad notice:', err));
        }
    }

    // Helper UI Notification Toast
    showToast(message, isWarning = false) {
        try {
            let toast = document.getElementById('sdk-notification-toast');
            if (!toast) {
                toast = document.createElement('div');
                toast.id = 'sdk-notification-toast';
                toast.style.position = 'fixed';
                toast.style.bottom = '80px';
                toast.style.left = '50%';
                toast.style.transform = 'translateX(-50%)';
                toast.style.background = 'rgba(25, 30, 42, 0.95)';
                toast.style.color = '#fff';
                toast.style.padding = '10px 22px';
                toast.style.borderRadius = '30px';
                toast.style.fontSize = '0.92rem';
                toast.style.fontWeight = '700';
                toast.style.boxShadow = '0 6px 20px rgba(0,0,0,0.6)';
                toast.style.zIndex = '99999';
                toast.style.pointerEvents = 'none';
                toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                toast.style.border = '2px solid #f39c12';
                toast.style.textAlign = 'center';
                document.body.appendChild(toast);
            }
            toast.innerText = message;
            toast.style.borderColor = isWarning ? '#e74c3c' : '#2ecc71';
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(-50%) translateY(0)';
            if (this._toastTimer) clearTimeout(this._toastTimer);
            this._toastTimer = setTimeout(() => {
                if (toast) {
                    toast.style.opacity = '0';
                    toast.style.transform = 'translateX(-50%) translateY(10px)';
                }
            }, 3000);
        } catch (e) {
            console.log('[PlatformSDK Toast]', message);
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
            if (!this.isInsideVK) {
                console.log('[PlatformSDK] Local test outside VK iframe - mock interstitial passed');
                this.lastInterstitialTime = Date.now();
                restoreSound();
                if (onComplete) onComplete(true);
                return;
            }

            console.log('[PlatformSDK] Requesting VK Interstitial ad...');
            vkBridge.send('VKWebAppShowNativeAds', { ad_format: 'interstitial', use_waterfall: true })
                .then(data => {
                    console.log('[PlatformSDK] VK Interstitial ad shown:', data);
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
            if (!this.isInsideVK) {
                console.log('[PlatformSDK] Test mode outside VK iframe - granting mock reward');
                restoreSound();
                this.showToast('🎁 Тестовая награда получена!');
                if (onRewarded) onRewarded();
                if (onClose) onClose(true);
                return;
            }

            console.log('[PlatformSDK] Requesting VK Rewarded ad...');
            this.showToast('Загрузка рекламы...');

            vkBridge.send('VKWebAppShowNativeAds', { ad_format: 'reward', use_waterfall: true })
                .then(data => {
                    console.log('[PlatformSDK] VK Rewarded ad result:', data);
                    restoreSound();
                    // data.result === true means ad was watched and reward earned
                    if (data && data.result) {
                        this.showToast('✨ Награда получена!');
                        if (onRewarded) onRewarded();
                        if (onClose) onClose(true);
                    } else {
                        console.warn('[PlatformSDK] VK Rewarded ad closed without reward:', data);
                        this.showToast('Реклама была пропущена', true);
                        if (onClose) onClose(false);
                    }
                })
                .catch(err => {
                    console.warn('[PlatformSDK] VK Rewarded ad error or not ready:', err);
                    restoreSound();
                    // If ad is not configured in VK console or no ad fill available, give reward with notice so user is not stuck
                    console.info('[PlatformSDK] Fallback reward granted (ad unavailable in console or region)');
                    this.showToast('Реклама недоступна — награда выдана бонусом! 🎁');
                    if (onRewarded) onRewarded();
                    if (onClose) onClose(true);
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
        this.showToast('🎁 Награда получена!');
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
