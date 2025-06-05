class SettingsPage {
    static currentBackgroundSetting = 'light';

    constructor() {
        this.container = null;
        this.styleElement = null;
        this.settings = {
            background: localStorage.getItem('background') || 'light',
            sounds: localStorage.getItem('gameSounds') || 'on',
            difficulty: localStorage.getItem('difficulty') || 'normal'
        };

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
                                <button id="bg-light-button" class="option-button ${this.settings.background === 'light' ? 'active' : ''}" data-type="background" data-value="${this.CONSTANTS.OPTION_LIGHT}">light</button>
                                <span class="button-divider">/</span>
                                <button id="bg-dark-button" class="option-button ${this.settings.background === 'dark' ? 'active' : ''}" data-type="background" data-value="${this.CONSTANTS.OPTION_DARK}">dark</button>
                            </div>
                        </div>
                        <div class="option-item">
                            <div class="option-title-text">sounds</div>
                            <div class="option-buttons">
                                <button id="sounds-on-button" class="option-button ${this.settings.sounds === 'on' ? 'active' : ''}" data-type="sounds" data-value="${this.CONSTANTS.OPTION_ON}">on</button>
                                <span class="button-divider">/</span>
                                <button id="sounds-off-button" class="option-button ${this.settings.sounds === 'off' ? 'active' : ''}" data-type="sounds" data-value="${this.CONSTANTS.OPTION_OFF}">off</button>
                            </div>
                        </div>
                        <div class="option-item">
                            <div class="option-title-text">difficulty</div>
                            <div class="option-buttons">
                                <button id="difficulty-button" class="option-button" data-type="difficulty" data-value="${this.settings.difficulty}">${this.settings.difficulty}</button>
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
            @import url('https://fonts.googleapis.com/css2?family=Bungee:wght@400&display=swap');
            
            .settings-page {
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                display: flex; justify-content: center; align-items: center;
                background-color: ${this.COLORS.PAGE_BG};
                font-family: 'Bungee', cursive;
            }
            .settings-container {
                position: relative; width: 1440px; height: 1024px;
                display: flex; flex-direction: column; align-items: center; 
                background-image: url('assets/background/background_setting.png');
                background-size: cover; background-position: center;
                overflow: hidden;
            }
            .settings-title {
                margin-top: 60px;
                margin-bottom: 80px;
            }
            .settings-title h1 {
                font-size: 128px; font-weight: 400;
                color: ${this.COLORS.TITLE_TEXT};
                margin: 0; text-align: center;
            }
            .options-container {
                display: flex; flex-direction: column; align-items: center;
                width: 1000px;
                gap: 50px;
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
            .difficulty-buttons {
                width: 385px;
                display: flex;
                justify-content: space-between;
                padding: 0 20px;
            }
            .option-button {
                font-family: 'Bungee', cursive; font-size: 48px; font-weight: 400;
                color: ${this.COLORS.OPTION_TEXT};
                background-color: transparent; border: none;
                cursor: pointer; padding: 10px;
                transition: color 0.3s ease;
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
                position: absolute;
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
        `;
    }

    /**
     * 페이지 마운트 후 초기화
     */
    async mount(container) {
        this.container = container;
        this.container.innerHTML = this.render();
        
        this.styleElement = document.createElement('style');
        this.styleElement.textContent = this.getStyles();
        document.head.appendChild(this.styleElement);

        // DOM 요소 캐싱
        this.bgLightButton = document.getElementById('bg-light-button');
        this.bgDarkButton = document.getElementById('bg-dark-button');
        this.soundsOnButton = document.getElementById('sounds-on-button');
        this.soundsOffButton = document.getElementById('sounds-off-button');
        this.backToHomeButton = document.getElementById('back-to-home-button');

        this.setupEventListeners();
    }

    /**
     * 이벤트 리스너 설정
     */
    setupEventListeners() {
        // 옵션 버튼들에 대한 공통 이벤트 리스너
        const optionButtons = document.querySelectorAll('.option-button:not(#difficulty-button)');
        optionButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const type = event.target.dataset.type;
                const value = event.target.dataset.value;
                
                // 같은 타입의 모든 버튼에서 active 클래스 제거
                document.querySelectorAll(`[data-type="${type}"]`).forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // 클릭된 버튼에 active 클래스 추가
                event.target.classList.add('active');
                
                // 설정 저장
                this.settings[type] = value;
                localStorage.setItem(type === 'sounds' ? this.CONSTANTS.SOUNDS_OPTION_KEY : type, value);
                
                // background 설정 변경 시 정적 속성도 업데이트
                if (type === 'background') {
                    SettingsPage.currentBackgroundSetting = value;
                }
            });
        });

        // 난이도 버튼 이벤트 리스너
        const difficultyButton = document.getElementById('difficulty-button');
        if (difficultyButton) {
            difficultyButton.addEventListener('click', () => {
                const difficulties = ['easy', 'normal', 'hard'];
                const currentIndex = difficulties.indexOf(this.settings.difficulty);
                const nextIndex = (currentIndex + 1) % difficulties.length;
                const nextDifficulty = difficulties[nextIndex];
                
                // 버튼 텍스트와 value 업데이트
                difficultyButton.textContent = nextDifficulty;
                difficultyButton.dataset.value = nextDifficulty;
                
                // 설정 저장
                this.settings.difficulty = nextDifficulty;
                localStorage.setItem('difficulty', nextDifficulty);
            });
        }

        if (this.backToHomeButton) {
            this.backToHomeButton.addEventListener('click', () => {
                this.navigateToHome();
            });
        }
    }
    
    /**
     * 홈으로 이동
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

    // --- 정적 메서드 추가 ---
    /**
     * 현재 세션의 배경 설정을 가져옴
     * @returns {string} 'light' 또는 'dark'
     */
    static getBackgroundSetting() {
        return SettingsPage.currentBackgroundSetting;
    }

    static setBackground(value) {
        localStorage.setItem('background', value);
        window.location.reload();
    }

    static getDifficulty() {
        return localStorage.getItem('difficulty') || 'normal';
    }

    static setDifficulty(value) {
        localStorage.setItem('difficulty', value);
        window.location.reload();
    }
} 