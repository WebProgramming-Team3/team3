
class HomePage {
    constructor() {
        this.container = null;
        this.styleElement = null;
        
        // 스타일 색상 상수
        this.COLORS = {
            BUTTON_BG: '#ffffff',
            BUTTON_BORDER: '#60cd52',
            BUTTON_TEXT: '#737373',
            BUTTON_HOVER_BG: '#60cd52',
            BUTTON_HOVER_TEXT: '#ffffff',
            BACKGROUND: '#ffffff'
        };

        // 버튼 설정
        this.BUTTONS = [
            { id: 'play-game-button', text: 'play game', route: 'game' },
            { id: 'how-to-play-button', text: 'HOW TO PLAY', route: 'howtoplay' },
            { id: 'setting-button', text: 'setting', route: 'settings' },
            { id: 'ranking-button', text: 'Ranking', route: 'game' }
        ];
    }

    /**
     * 홈 페이지 렌더링
     */
    render() {
        return `
            <div class="home-page" id="home-page">
                <div class="home-container">
                    <div class="home-background"></div>
                    <div class="home-title">
                        <h1>Poke Bricks</h1> 
                    </div>
                    <div class="main-button-container">
                        ${this.BUTTONS.map(button => 
                            `<button id="${button.id}" class="home-main-button" data-route="${button.route}">${button.text}</button>`
                        ).join('')}
                    </div>
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
                @import url('https://fonts.googleapis.com/css2?family=Bungee&display=swap');
                
                .home-page {
                    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                    overflow: hidden; background: ${this.COLORS.BACKGROUND}; z-index: 900;
                    font-family: 'Bungee', cursive;
                    display: flex; align-items: center; justify-content: center;
                }
                
                .home-container {
                    position: relative; width: 1440px; height: 1024px;
                    background: ${this.COLORS.BACKGROUND};
                    overflow: hidden;
                    display: flex; flex-direction: column; align-items: center;
                }
                
                .home-background {
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    background-image: url('assets/background/background_setting.png');
                    background-size: cover; background-position: center; background-repeat: no-repeat;
                    z-index: 1;
                }
                
                .home-title {
                    position: relative; z-index: 10;
                    margin-top: 60px;
                    text-align: center;
                }
                .home-title h1 {
                    font-family: 'Bungee', cursive; font-size: 128px; font-weight: 400;
                    color: #737373; margin: 0; line-height: 1.2;
                    text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
                }
                
                .main-button-container {
                    position: relative; z-index: 15;
                    display: flex; flex-direction: column; align-items: center;
                    gap: 30px;
                    margin-top: 120px;
                }
                
                .home-main-button {
                    background: ${this.COLORS.BUTTON_BG};
                    border: 3px solid ${this.COLORS.BUTTON_BORDER};
                    border-radius: 20px;
                    cursor: pointer;
                    font-family: 'Bungee', cursive; font-size: 64px; font-weight: 400;
                    color: ${this.COLORS.BUTTON_TEXT};
                    line-height: 1.2; text-align: center;
                    box-sizing: border-box;
                    width: 792px; 
                    height: 137px;
                    transition: background-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
                    display: flex; align-items: center; justify-content: center;
                }
                .home-main-button:hover {
                    background-color: ${this.COLORS.BUTTON_HOVER_BG};
                    color: ${this.COLORS.BUTTON_HOVER_TEXT};
                    transform: scale(1.03);
                }
                
                @media (max-width: 1440px) {
                    .home-container { transform: scale(calc(100vw / 1440)); transform-origin: top left; }
                }
                @media (max-height: 1024px) {
                    .home-container { transform: scale(calc(100vh / 1024)); transform-origin: top left; }
                }
                @media (max-width: 768px) {
                    .home-container { transform: scale(0.5); transform-origin: top left; }
                    .home-title h1 { font-size: min(15vw, 80px); }
                    .home-main-button { 
                        font-size: min(8vw, 40px); 
                        width: 634px;
                        height: 110px;
                    }
                    .main-button-container {
                        gap: 24px;
                        margin-top: 96px;
                    }
                }
            </style>
        `;
    }

    /**
     * 페이지 마운트 후 초기화
     */
    async mount() {
        this.container = document.querySelector('.home-page');
        
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
        const buttons = document.querySelectorAll('.home-main-button');
        
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const route = button.getAttribute('data-route');
                this.navigateToPage(route);
            });
        });
    }

    /**
     * 페이지 네비게이션 공통 함수
     */
    navigateToPage(route) {
        if (window.router) {
            window.router.navigate(route);
        }
    }



    
} 