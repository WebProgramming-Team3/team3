class SettingsPage {
    static currentBackgroundSetting = 'light';

    constructor() {
        this.container = null;
        this.styleElement = null;

        // 상수 정의
        this.CONSTANTS = {
            SOUNDS_OPTION_KEY: 'gameSounds',
            OPTION_LIGHT: 'light',
            OPTION_DARK: 'dark',
            OPTION_ON: 'on',
            OPTION_OFF: 'off'
        };

        // 스타일 색상 상수
        this.COLORS = {
            PAGE_BG: '#ffffff',
            TITLE_TEXT: '#737373',
            OPTION_ITEM_BG: '#ffffff',
            OPTION_ITEM_BORDER: '#60cd52',
            OPTION_TEXT: '#737373',
            OPTION_ACTIVE_TEXT: '#f64343',
            BACK_BUTTON_BG: '#60cd52',
            BACK_BUTTON_TEXT: '#ffffff',
            BACK_BUTTON_HOVER_BG: '#4aa040'
        };

        // 설정 값 초기화 시, 정적 속성 값을 사용
        this.backgroundOption = SettingsPage.currentBackgroundSetting;
        this.soundsOption = this.CONSTANTS.OPTION_ON;

        // DOM 요소 캐싱용 (mount에서 초기화)
        this.bgLightButton = null;
        this.bgDarkButton = null;
        this.soundsOnButton = null;
        this.soundsOffButton = null;
        this.backToHomeButton = null;
    }

    /**
     * 설정 페이지 렌더링
     */
    render() {
        return `
            <div class="settings-page" id="settings-page">
                <div class="settings-container">
                    <div class="settings-background"></div>
                    <div class="settings-title">
                        <h1>setting</h1>
                    </div>
                    <div class="options-container">
                        <div class="option-item">
                            <div class="option-title-text">background</div>
                            <div class="option-buttons">
                                <button id="bg-light-button" class="option-button" data-type="background" data-value="${this.CONSTANTS.OPTION_LIGHT}">light</button>
                                <span class="button-divider">/</span>
                                <button id="bg-dark-button" class="option-button" data-type="background" data-value="${this.CONSTANTS.OPTION_DARK}">dark</button>
                            </div>
                        </div>
                        <div class="option-item">
                            <div class="option-title-text">sounds</div>
                            <div class="option-buttons">
                                <button id="sounds-on-button" class="option-button" data-type="sounds" data-value="${this.CONSTANTS.OPTION_ON}">on</button>
                                <span class="button-divider">/</span>
                                <button id="sounds-off-button" class="option-button" data-type="sounds" data-value="${this.CONSTANTS.OPTION_OFF}">off</button>
                            </div>
                        </div>
                    </div>
                    <button id="back-to-home-button" class="settings-back-button">Back to Home</button>
                </div>
            </div>
        `;
    }

    /**
     * 스타일 정의 (Flexbox 기반으로 대폭 단순화)
     */
    getStyles() {
        return `
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Bungee&family=Do+Hyeon&display=swap');
                
                .settings-page {
                    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                    display: flex; justify-content: center; align-items: center;
                    background-color: ${this.COLORS.PAGE_BG};
                    font-family: 'Bungee', cursive;
                }
                .settings-container {
                    position: relative; width: 1440px; height: 1024px; /* Figma 기준 전체 프레임 */
                    display: flex; flex-direction: column; align-items: center; 
                    background-image: url('assets/background/background_setting.png');
                    background-size: cover; background-position: center;
                    overflow: hidden; /* 스케일링 시 내용 잘림 방지 */
                }
                .settings-title {
                    margin-top: 60px; /* 상단 여백 */
                    margin-bottom: 80px; /* 옵션과의 간격 */
                }
                .settings-title h1 {
                    font-size: 128px; font-weight: 400;
                    color: ${this.COLORS.TITLE_TEXT};
                    margin: 0; text-align: center;
                }
                .options-container {
                    display: flex; flex-direction: column; align-items: center;
                    width: 1000px; /* Figma 기준 options-container 너비 */
                    gap: 150px; /* 옵션 아이템 간 간격 */
                }
                .option-item {
                    display: flex; justify-content: space-between; align-items: center;
                    width: 100%;
                }
                .option-title-text {
                    width: 525px; height: 137px;
                    background-color: ${this.COLORS.OPTION_ITEM_BG};
                    border: 3px solid ${this.COLORS.OPTION_ITEM_BORDER};
                    border-radius: 20px;
                    display: flex; justify-content: center; align-items: center;
                    font-size: 64px; font-weight: 400;
                    color: ${this.COLORS.OPTION_TEXT};
                    box-sizing: border-box;
                }
                .option-buttons {
                    display: flex; align-items: center; justify-content: center;
                    width: 385px; height: 137px;
                    background-color: ${this.COLORS.OPTION_ITEM_BG};
                    border: 3px solid ${this.COLORS.OPTION_ITEM_BORDER};
                    border-radius: 20px;
                    padding: 0 15px;
                    box-sizing: border-box;
                }
                .option-button {
                    font-family: 'Bungee', cursive; font-size: 48px; font-weight: 400;
                    color: ${this.COLORS.OPTION_TEXT};
                    background-color: transparent; border: none;
                    cursor: pointer; padding: 10px;
                }
                .option-button.active {
                    color: ${this.COLORS.OPTION_ACTIVE_TEXT};
                }
                .button-divider {
                    font-family: 'Bungee', cursive; font-size: 48px;
                    color: ${this.COLORS.OPTION_TEXT};
                    margin: 0 5px;
                }
                .settings-back-button {
                    position: absolute; /* settings-container 기준 */
                    bottom: 50px; left: 50%; transform: translateX(-50%);
                    padding: 10px 20px; font-size: 24px;
                    font-family: 'Do Hyeon', sans-serif;
                    background-color: ${this.COLORS.BACK_BUTTON_BG}; color: ${this.COLORS.BACK_BUTTON_TEXT};
                    border: none; border-radius: 10px; cursor: pointer;
                    height: 60px;
                    transition: background-color 0.2s ease;
                }
                .settings-back-button:hover {
                    background-color: ${this.COLORS.BACK_BUTTON_HOVER_BG};
                }

                /* 반응형 스케일링 */
                @media (max-width: 1440px) {
                    .settings-container { transform: scale(calc(100vw / 1440)); transform-origin: top left; }
                }
                @media (max-height: 1024px) {
                    .settings-container { transform: scale(calc(100vh / 1024)); transform-origin: top left; }
                }
                 @media (max-width: 768px) {
                    .settings-container { transform: scale(0.5); transform-origin: top left; }
                    .settings-title h1 { font-size: min(15vw, 80px); }
                    .option-title-text { font-size: min(8vw, 40px); width: 65%; height: 100px;}
                    .option-buttons { font-size: min(6vw, 30px); width: 30%; height: 100px;}
                    .option-button {font-size: min(6vw, 30px);}
                    .button-divider {font-size: min(6vw, 30px);}
                    .settings-back-button {font-size:min(4vw, 18px); height: 45px; bottom: 30px;}
                    .options-container{gap:30px; margin-bottom:30px;}
                }
            </style>
        `;
    }

    /**
     * 페이지 마운트 후 초기화
     */
    async mount() {
        this.container = document.querySelector('.settings-page');
        
        this.styleElement = document.createElement('div');
        this.styleElement.innerHTML = this.getStyles();
        document.head.appendChild(this.styleElement);

        // DOM 요소 캐싱
        this.bgLightButton = document.getElementById('bg-light-button');
        this.bgDarkButton = document.getElementById('bg-dark-button');
        this.soundsOnButton = document.getElementById('sounds-on-button');
        this.soundsOffButton = document.getElementById('sounds-off-button');
        this.backToHomeButton = document.getElementById('back-to-home-button');

        this.loadSettings();
        this.setupEventListeners();
        this.updateUI();
    }

    /**
     * 이벤트 리스너 설정
     */
    setupEventListeners() {
        // 옵션 버튼들에 대한 공통 이벤트 리스너
        const optionButtons = document.querySelectorAll('.option-button');
        optionButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const type = event.target.dataset.type;
                const value = event.target.dataset.value;
                this.handleOptionChange(type, value);
            });
        });

        if (this.backToHomeButton) {
            this.backToHomeButton.addEventListener('click', () => {
                this.navigateToHome();
            });
        }
    }
    
    /**
     * 홈으로 이동 (다른 페이지와 일관성)
     */
    navigateToHome() {
        if (window.router) {
            window.router.navigate('home');
        }
    }

    /**
     * 페이지 언마운트
     */
    unmount() {
        if (this.styleElement && this.styleElement.parentNode) {
            this.styleElement.parentNode.removeChild(this.styleElement);
            this.styleElement = null;
        }
    }

    // 설정 변경 처리
    handleOptionChange(type, value) {
        if (type === 'background') {
            this.backgroundOption = value;
            SettingsPage.currentBackgroundSetting = value; // 정적 속성 업데이트
        } else if (type === 'sounds') {
            this.soundsOption = value;
            
            // 사운드 매니저에 설정 적용 
            if (window.soundManager) {
                const isEnabled = value === this.CONSTANTS.OPTION_ON;
                window.soundManager.setEnabled(isEnabled);
            }
        }
        this.updateUI();
    }

    // UI 업데이트 (버튼 활성화 및 실제 설정 적용)
    updateUI() {
        const gameContainer = document.getElementById('app');
        if (gameContainer) {
            if (this.backgroundOption === this.CONSTANTS.OPTION_DARK) {
                gameContainer.classList.add('dark-mode');
                gameContainer.classList.remove('light-mode');
            } else {
                gameContainer.classList.add('light-mode');
                gameContainer.classList.remove('dark-mode');
            }
        }
        
        // 버튼 활성 상태 업데이트
        if(this.bgLightButton) this.bgLightButton.classList.toggle('active', this.backgroundOption === this.CONSTANTS.OPTION_LIGHT);
        if(this.bgDarkButton) this.bgDarkButton.classList.toggle('active', this.backgroundOption === this.CONSTANTS.OPTION_DARK);
        if(this.soundsOnButton) this.soundsOnButton.classList.toggle('active', this.soundsOption === this.CONSTANTS.OPTION_ON);
        if(this.soundsOffButton) this.soundsOffButton.classList.toggle('active', this.soundsOption === this.CONSTANTS.OPTION_OFF);
    }

    // 현재 세션 설정 불러오기
    loadSettings() {
        // 배경 설정은 현재 세션의 정적 속성 값을 사용
        this.backgroundOption = SettingsPage.currentBackgroundSetting;
        
        // 사운드 설정은 사운드 매니저의 현재 상태를 사용
        if (window.getGameSoundsEnabled) {
            this.soundsOption = window.getGameSoundsEnabled() ? this.CONSTANTS.OPTION_ON : this.CONSTANTS.OPTION_OFF;
        } else {
            // 사운드 매니저가 아직 로드되지 않은 경우 기본값 사용
            this.soundsOption = this.CONSTANTS.OPTION_ON;
        }
    }

    // --- 정적 메서드 추가 ---
    /**
     * 현재 세션의 배경 설정을 가져옴
     * @returns {string} 'light' 또는 'dark'
     */
    static getBackgroundSetting() {
        // localStorage 대신 정적 속성 값을 반환
        return SettingsPage.currentBackgroundSetting;
    }
} 