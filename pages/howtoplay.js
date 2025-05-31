
class HowToPlayPage {
    constructor() {
        this.container = null;
        this.styleElement = null;
        
        // 스타일 색상 상수
        this.COLORS = {
            BACKGROUND: '#ffffff',
            CONTENT_BOX_BG: 'rgba(255, 255, 255, 0.9)',
            CONTENT_BOX_BORDER: '#60cd52',
            TITLE_COLOR: '#4a4a4a',
            SECTION_TITLE_COLOR: '#333333',
            SECTION_TEXT_COLOR: '#000000',
            BUTTON_BG: '#60cd52',
            BUTTON_HOVER_BG: '#4aa040',
            BUTTON_TEXT: '#ffffff'
        };
    }

    /**
     * 페이지 렌더링
     */
    render() {
        return `
            <div class="how-to-play-page" id="how-to-play-page">
                <div class="how-to-play-container">
                    <div class="how-to-play-title">
                        <h1>HOW TO PLAY</h1>
                    </div>
                    <div class="how-to-play-content-box">
                        <div class="content-section">
                            <h2>⌨️ 조작 방법</h2>
                            <p>마우스를 좌우로 움직여 패들(손바닥 이미지)을 조종해요.<br>몬스터볼을 튕겨서 위쪽의 포켓몬 벽돌을 맞추세요!</p>
                        </div>
                        <div class="content-section">
                            <h2>🎯 목표</h2>
                            <p>제한 시간 60초 안에 가능한 많은 <br>포켓몬 벽돌을 부수고 점수를 모으세요!<br>벽돌을 부수면 포켓몬을 수집할 수 있어요.<br>3개의 목숨이 다하면 게임 오버!</p>
                        </div>
                        <div class="content-section">
                            <h2>🧱 벽돌</h2>
                            <p>레벨에 따라 부서지는 횟수가 달라요!<br>
                                💠레벨 1: 1번 맞으면 부서짐<br>
                                💠레벨 2: 1번 맞으면 부서짐<br>
                                💠레벨 3: 1번 맞으면 부서짐
                            </p>
                        </div>
                        <div class="content-section">
                            <h2>⚽ 공(몬스터볼)</h2>
                            <p>점수가 오를수록 더 강력한 몬스터볼로 업그레이드돼요!<br>레벨이 올라갈수록 더 강한 공격력을 가집니다.</p>
                        </div>
                        <div class="content-section">
                            <h2>🧩 포켓몬 수집</h2>
                            <p>각 벽돌엔 포켓몬이 들어있어요.<br>부수면 해당 포켓몬이 당신의 팀에 추가돼요!</p>
                        </div>
                        <div class="content-section">
                            <h2>💥 배틀</h2>
                            <p>게임이 끝나면 수집한 포켓몬끼리 랜덤 대결을 펼칩니다!<br>마지막 가위바위보로 전설의 포켓몬과 한 판 승부?</p>
                        </div>
                    </div>
                    <button id="htp-back-to-home-button" class="how-to-play-button">Back to Home</button>
                </div>
            </div>
        `;
    }

    /**
     * 스타일 정의
     */
    getStyles() {
        return `
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Bungee&family=Do+Hyeon&display=swap');
                
                .how-to-play-page {
                    width: 100%; min-height: 100vh; 
                    display: flex; flex-direction: column; align-items: center; 
                    padding: 20px 0; box-sizing: border-box;
                    background-color: ${this.COLORS.BACKGROUND};
                }
                
                .how-to-play-container {
                    position: relative; width: 1440px; max-width: 100%;
                    display: flex; flex-direction: column; align-items: center;
                    background-image: url('assets/background/background_setting.png'); 
                    background-size: 100% auto; background-repeat: repeat-y; 
                    background-position: top center;
                    padding: 20px; padding-bottom: 50px;
                    box-sizing: border-box;
                }

                .how-to-play-title {
                    width: 800px; max-width: 100%;
                    margin-top: 60px; margin-bottom: 25px; 
                    text-align: center;
                }
                .how-to-play-title h1 {
                    font-family: 'Bungee', cursive; font-size: 90px; font-weight: 400;
                    color: ${this.COLORS.TITLE_COLOR}; margin: 0;
                    text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
                }
                
                .how-to-play-content-box {
                    width: calc(100% - 60px); max-width: 1000px; 
                    background-color: ${this.COLORS.CONTENT_BOX_BG}; 
                    border: 5px solid ${this.COLORS.CONTENT_BOX_BORDER};
                    border-radius: 25px; padding: 30px;
                    box-sizing: border-box; margin-bottom: 30px; 
                }

                .content-section {
                    margin-bottom: 25px;
                }
                .content-section:last-child {
                    margin-bottom: 0;
                }
                .content-section h2 {
                    font-family: 'Do Hyeon', sans-serif; font-size: 50px;
                    color: ${this.COLORS.SECTION_TITLE_COLOR};
                    margin: 0 0 10px 0;
                    text-align: center;
                }
                .content-section p {
                    font-family: 'Do Hyeon', sans-serif; font-size: 36px;
                    color: ${this.COLORS.SECTION_TEXT_COLOR};
                    line-height: 1.7; margin: 0;
                    text-align: center;
                }
                
                .how-to-play-button {
                    margin-top: 20px; padding: 10px 20px; 
                    font-size: 24px; font-family: 'Do Hyeon', sans-serif; 
                    background-color: ${this.COLORS.BUTTON_BG}; color: ${this.COLORS.BUTTON_TEXT};
                    border: none; border-radius: 10px; cursor: pointer;
                    height: 60px;
                    transition: background-color 0.2s ease;
                }
                .how-to-play-button:hover {
                    background-color: ${this.COLORS.BUTTON_HOVER_BG};
                }

                @media (max-width: 1440px) {
                    .how-to-play-container { transform: scale(calc(100vw / 1440)); transform-origin: top; }
                }
                @media (max-width: 768px) {
                    .how-to-play-container { transform: scale(0.6); transform-origin: top; }
                    .how-to-play-title h1 { font-size: min(12vw, 60px); }
                    .content-section h2 { font-size: min(6vw, 35px); }
                    .content-section p { font-size: min(4vw, 25px); }
                }
            </style>
        `;
    }

    /**
     * 페이지 마운트 후 초기화
     */
    async mount() {
        this.container = document.querySelector('.how-to-play-page');
        
        this.styleElement = document.createElement('div');
        this.styleElement.innerHTML = this.getStyles();
        document.head.appendChild(this.styleElement);
        
        this.setupEventListeners();
    }

    /**
     * 페이지 언마운트
     */
    unmount() {
        if (this.styleElement && this.styleElement.parentNode) {
            this.styleElement.parentNode.removeChild(this.styleElement);
        }
    }

    /**
     * 이벤트 리스너 설정
     */
    setupEventListeners() {
        const backButton = document.getElementById('htp-back-to-home-button');
        
        if (backButton) {
            backButton.addEventListener('click', () => {
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

    
} 