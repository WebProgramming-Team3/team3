
class IntroPage {
    constructor() {
        this.container = null;
        this.currentStep = 0;
        this.isAnimating = false;
        this.autoSlideInterval = null;
        this.styleElement = null;
        
        // DOM 요소 캐싱을 위한 속성 초기화
        this.backgroundEl = null;
        this.textboxContainerEl = null;
        this.skipButtonEl = null;
        this.mainTextEl = null;
        this.subTextEl = null;
        this.buttonTextEl = null;
        this.skipIconEl = null;

        // 애니메이션 및 타이밍 상수
        this.ANIMATION_DURATION = 800;
        this.AUTO_SLIDE_INTERVAL = 5000;
        this.FADE_OUT_DURATION = 500;

        // 기본 설정 값 정의
        this.defaultBackground = 'background_intro';
        this.defaultButtonText = 'skip';

        // 스타일 색상 상수
        this.COLORS = {
            START_BUTTON_BG: '#60cd52',
            DEFAULT_BUTTON_BG: '#ffffff',
            START_BUTTON_TEXT: '#ffffff',
            DEFAULT_BUTTON_TEXT: '#737373'
        };

        // introSequence: 각 장면에 따라 변경되는 최소한의 정보만 포함
        this.introSequence = [
            { // Step 0
                mainText: '📖 옛날 옛적, 포켓몬과 사람이 함께 싸우던 시절이 있었대요.',
                subText: '하지만 지금은 포켓몬을 전투에 쓰는 건 금지된 지 오래!\n모두가 잊고 살던 그 시대의 이야기는 이제 전설처럼 전해지죠…'
            },
            { // Step 1
                mainText: '🌳 당신은 우연히 폐허가 된 연구소에서 \n이상한 책을 발견해요.',
                subText: '표지는 이렇게 쓰여 있었죠.\n"포켓몬 금기록(禁記錄)"'
            },
            { // Step 2
                mainText: '📕 그 속엔 믿기 힘든 내용이 있었어요:',
                subText: '포켓몬과 함께 싸우던 \'3인의 전설 트레이너\'의 전략, 기술, 그리고…\n전설의 몬스터볼 설계도?!'
            },
            { // Step 3
                mainText: '🧠 당신은 결심해요.',
                subText: '잊혀진 포켓몬 배틀을 되살리고,\n전설의 트레이너들의 유물을 찾아 모든 진실을 파헤치기로!'
            },
            { // Step 4
                mainText: '🎮 지금부터 포켓몬을 수집하고,',
                subText: '벽돌을 깨며 금서 도감의 비밀을 밝혀보세요.\n숨겨진 전투 기술, 봉인된 전설, 그리고…\n최후의 가위바위보?!'
            },
            { // Step 5 (Last step)
                buttonText: 'START',
                mainText: '🔥 트레이너의 귀환.',
                subText: '\n당신의 손끝에서 금기의 전설이 다시 시작됩니다.'
            }
        ];
    }

    render() {
        return `
            <div class="intro-page" id="intro-page">
                <div class="intro-container">
                    <div class="intro-background" id="intro-background"></div>
                    <div class="intro-title" id="intro-title">
                        <h1>intro</h1>
                    </div>
                    <div class="textbox-container" id="textbox-container">
                        <div class="text-content">
                            <div class="main-text" id="main-text"></div>
                            <div class="sub-text" id="sub-text"></div>
                        </div>
                    </div>
                    <button class="skip-button" id="skip-button">
                        <span class="button-text" id="button-text">skip</span>
                        <img src="assets/utils/skip.png" alt="Skip" class="skip-icon" id="skip-icon">
                    </button>
                </div>
            </div>
        `;
    }

    getStyles() {
        return `
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Bungee:wght@400&family=Do+Hyeon:wght@400&display=swap');
                
                .intro-page {
                    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                    overflow: hidden; background: #ffffff; z-index: 1000;
                    font-family: 'Do Hyeon', sans-serif;
                    display: flex; align-items: center; justify-content: center;
                }
                
                .intro-container {
                    position: relative; width: 1440px; height: 1024px;
                    background: #ffffff; overflow: hidden;
                }
                
                .intro-background {
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    background-size: cover; background-position: center; background-repeat: no-repeat;
                    z-index: 1;
                }
                .intro-background.background_intro { background-image: url('assets/background/background_intro.png'); }
                
                .intro-title {
                    position: absolute; z-index: 10; 
                    display: flex; align-items: center; justify-content: center;
                    left: 720px; 
                    top: 120px; 
                    width: 600px; 
                    height: 154px; 
                    transform: translate(-50%, -50%);
                }
                .intro-title h1 {
                    font-family: 'Bungee', cursive; font-size: 128px; font-weight: 400;
                    color: #737373; margin: 0; line-height: 1.2; text-align: center;
                    letter-spacing: 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
                }
                
                .textbox-container {
                    position: absolute; background: rgba(255,255,255,0.7);
                    border: 3px solid #e8c2d6; border-radius: 20px; z-index: 15;
                    display: flex; align-items: center;
                    justify-content: center; padding: 20px; box-sizing: border-box;
                    left: 720px; 
                    top: 550px; 
                    width: 1400px; 
                    height: 340px;
                    transform: translate(-50%, -50%);
                }
                .text-content { width: 100%; text-align: center; }
                
                /* 공통 텍스트 스타일 */
                .main-text, .sub-text {
                    font-family: 'Do Hyeon', sans-serif; font-weight: 400;
                    color: #000000; line-height: 1.25; text-align: center;
                }
                .main-text {
                    font-size: 60px; margin-bottom: 10px;
                }
                .sub-text {
                    font-size: 50px; white-space: pre-line;
                }
                
                .skip-button {
                    position: absolute; background: #ffffff;
                    border: 3px solid #60cd52; border-radius: 20px; z-index: 20;
                    cursor: pointer;
                    display: flex; align-items: center; justify-content: center;
                    padding: 15px 25px; box-sizing: border-box;
                    left: 1300px; 
                    top: 950px; 
                    height: 78px;
                    width: 207px;
                    transform: translate(-50%, -50%);
                    transition: background-color 0.3s ease, transform 0.3s ease; 
                }
                .skip-button:hover { 
                    background: #60cd52; 
                    transform: translate(-50%, -50%) scale(1.05); 
                }
                .skip-button:hover .button-text { color: #ffffff; }
                .button-text {
                    font-family: 'Bungee', cursive; font-size: 48px; font-weight: 400;
                    color: #737373; line-height: 1.2; text-align: center; 
                    transition: color 0.3s ease; 
                }
                .skip-icon { 
                    width: 48px;
                    height: 48px;
                    margin-left: 10px;
                }

                @media (max-width: 1440px) {
                    .intro-container { transform: scale(calc(100vw / 1440)); transform-origin: top left; }
                }
                @media (max-height: 1024px) {
                    .intro-container { transform: scale(calc(100vh / 1024)); transform-origin: top left; }
                }
                @media (max-width: 768px) {
                    .intro-container { transform: scale(0.5); transform-origin: top left; }
                    .intro-title h1 { font-size: min(12vw, 64px); }
                    .main-text { font-size: min(6vw, 32px); }
                    .sub-text { font-size: min(4.5vw, 24px); }
                    .button-text { font-size: min(4.5vw, 24px); } 
                }
            </style>
        `;
    }

    async mount() {
        this.container = document.querySelector('.intro-page');
        
        // DOM 요소 캐싱
        this.backgroundEl = document.getElementById('intro-background');
        this.textboxContainerEl = document.getElementById('textbox-container');
        this.skipButtonEl = document.getElementById('skip-button');
        this.mainTextEl = this.textboxContainerEl.querySelector('.main-text');
        this.subTextEl = this.textboxContainerEl.querySelector('.sub-text');
        this.buttonTextEl = document.getElementById('button-text');
        this.skipIconEl = document.getElementById('skip-icon');

        this.styleElement = document.createElement('div');
        this.styleElement.innerHTML = this.getStyles();
        document.head.appendChild(this.styleElement);
        
        this.setupEventListeners();
        this.showStep(0);
        this.startAutoSlide(); 

    }

    unmount() {
        this.stopAutoSlide();
        if (this.styleElement && this.styleElement.parentNode) {
            this.styleElement.parentNode.removeChild(this.styleElement);
        }
    }

    setupEventListeners() {
        if (this.skipButtonEl) {
            this.skipButtonEl.addEventListener('click', () => this.handleSkipClick());
        }
    }

    async showStep(stepIndex) {
        if (stepIndex < 0 || stepIndex >= this.introSequence.length) return;
        if (this.isAnimating && stepIndex !== this.currentStep) return; 

        this.isAnimating = true;
        const oldStep = this.currentStep;
        this.currentStep = stepIndex;
        
        const stepData = this.introSequence[stepIndex];
        
        // 배경 설정
        this.backgroundEl.className = `intro-background ${stepData.background || this.defaultBackground}`;
        
        this.mainTextEl.textContent = stepData.mainText;
        this.subTextEl.textContent = stepData.subText;
        
        // 버튼 텍스트 설정
        const buttonText = stepData.buttonText || this.defaultButtonText;
        this.buttonTextEl.textContent = buttonText;
        
        this.updateButtonAppearance(buttonText);
        this.handleAutoSlide(buttonText, oldStep, stepIndex);

        setTimeout(() => {
            this.isAnimating = false;
        }, this.ANIMATION_DURATION);
    }

    updateButtonAppearance(buttonText) {
        if (buttonText === 'START') {
            this.skipButtonEl.style.background = this.COLORS.START_BUTTON_BG;
            this.buttonTextEl.style.color = this.COLORS.START_BUTTON_TEXT;
            if (this.skipIconEl) this.skipIconEl.style.display = 'none';
        } else {
            this.skipButtonEl.style.background = this.COLORS.DEFAULT_BUTTON_BG;
            this.buttonTextEl.style.color = this.COLORS.DEFAULT_BUTTON_TEXT;
            if (this.skipIconEl) this.skipIconEl.style.display = 'inline-block';
        }
    }

    handleAutoSlide(buttonText, oldStep, stepIndex) {
        if (buttonText === 'START') {
            this.stopAutoSlide();
        } else {
            if (oldStep !== stepIndex) { 
                this.restartAutoSlide();
            }
        }
    }

    async handleSkipClick() {
        if (this.isAnimating) return;
        await this.navigateToHome();
    }

    async navigateToHome() {
        this.isAnimating = true;
        this.stopAutoSlide();
        if (this.container) {
            this.container.style.transition = `opacity ${this.FADE_OUT_DURATION}ms ease-out`;
            this.container.style.opacity = '0';
        }
        await new Promise(resolve => setTimeout(resolve, this.FADE_OUT_DURATION));
        if (window.router) window.router.navigate('home');
    }



    startAutoSlide() {
        if (this.autoSlideInterval) clearInterval(this.autoSlideInterval);
        this.autoSlideInterval = setInterval(() => {
            if (this.currentStep < this.introSequence.length - 1) {
                this.showStep(this.currentStep + 1);
            } else {
                this.stopAutoSlide(); 
            }
        }, this.AUTO_SLIDE_INTERVAL);
    }

    stopAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    }

    restartAutoSlide() {
        this.stopAutoSlide();
        this.startAutoSlide();
    }
} 