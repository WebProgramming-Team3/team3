
class GamePage {
    constructor() {
        this.container = null;
        this.currentStage = 2; // 사용자가 변경한 값 유지
        this.brickImageCounts = { 1: 2, 2: 5, 3: 5 }; // 스테이지별 벽돌 이미지 개수
        this.ballPosition = { x: 620, y: 490 }; // 볼 위치 (동적 관리용)
        this.paddlePosition = { x: 620, y: 500 }; // 패들 위치 (동적 관리용)
        this.score = 0; // 점수 
    }

    /**
     * 게임 페이지 렌더링
     */
    render() {
        
        const staticTimeLeft = 60; // 시간은 아직 정적 값으로 유지

        // 설정 페이지에서 배경 설정을 가져옴
        const backgroundSetting = typeof SettingsPage !== 'undefined' && SettingsPage.getBackgroundSetting ? 
                                  SettingsPage.getBackgroundSetting() :
                                  'light'; // SettingsPage가 없거나 메소드가 없으면 기본값 light

        const backgroundImage = backgroundSetting === 'dark' ? 
                                './assets/background/background-dark.png' : 
                                './assets/background/background-light.png';

        return `
            <div class="game-page">
                <!-- 배경 -->
                <div class="game-background" style="background-image: url('${backgroundImage}');"></div>
                
                <!-- 헤더 영역 배경 -->
                <div class="header-area-background">
                    <!-- 기존 헤더 내용 -->
                    <header class="game-header">
                        <div class="stage-title">
                            <span class="stage-text header-text-large">STAGE ${this.currentStage}</span>
                        </div>
                        <div class="score-container header-box">
                            <span class="score-value header-text-large">SCORE ${this.score}</span>
                        </div>
                        <div class="timer-container header-box">
                            <img src="./assets/utils/timer.png" alt="Timer Icon" class="timer-icon">
                            <span class="timer-value header-text-large">${staticTimeLeft}</span>
                        </div>
                    </header>
                </div>

                <!-- 메인 게임 영역 -->
                <div class="game-main">
                    <div class="bricks-wrapper">
                        <!-- 첫 번째 그룹 (예: 왼쪽) -->
                        <div class="bricks-container bricks-group1">
                            ${this.renderBricks(1, this.currentStage)}
                        </div>

                        <!-- 두 번째 그룹 (예: 중앙) -->
                        <div class="bricks-container bricks-group2">
                            ${this.renderBricks(2, this.currentStage)}
                        </div>

                        <!-- 세 번째 그룹 (예: 오른쪽) -->
                        <div class="bricks-container bricks-group3">
                            ${this.renderBricks(3, this.currentStage)}
                        </div>
                    </div>

                    <!-- 게임 오브젝트들 -->
                    <div class="game-objects">
                        <div class="pokeball" style="left: ${this.ballPosition.x}px; top: ${this.ballPosition.y}px;">
                            <img src="./assets/ball/ball_lev1_1.png" alt="Pokeball">
                        </div>
                        <div class="paddle" style="left: ${this.paddlePosition.x}px; top: ${this.paddlePosition.y}px;">
                            <img src="./assets/utils/hand.png" alt="Hand Paddle">
                        </div>
                    </div>
                </div>

                <!-- 푸터 -->
                <footer class="game-footer">
                    <div class="footer-info-box">
                        ${this.renderCaughtPokemon()}
                    </div>
                </footer>
            </div>
        `;
    }

    getStyles() {
        return `
                html, body {
                    height: 100%;
                    margin: 0;
                    padding: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden; /* Prevent body scrollbars */
                }

                .game-page {
                    --font-primary: 'Bungee', cursive;
                    --color-text-main: #4F4F4F;
                    --color-text-light: #aaa;
                    --color-primary-green: #60CD52;
                    --color-white: #FFFFFF;
                    --color-white-rgb: 255, 255, 255; /* 추가된 변수 */
                    --color-light-gray: #D9D9D9;
                    --color-accent-yellow: #FFDE00;
                    --color-error-red: #E53935;
                    --color-black: #000000;
                    --color-button-green: #4CAF50;
                    --color-button-green-dark: #388E3C;
                    --color-modal-bg: rgba(0, 0, 0, 0.7);
                    --border-radius-small: 5px;
                    --border-radius-medium: 10px;
                    --border-radius-large: 20px;
                    --border-radius-xl: 30px;

                    width: 1440px;
                    height: 1024px;
                    overflow: hidden;
                    font-family: var(--font-primary);
                    position: relative; /* For absolutely positioned children */
                }

                .header-area-background {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 137px;
                    background-color: rgba(var(--color-white-rgb), 0.6);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 5; /* .game-header 보다 낮게 */
                }

                .header-text-large {
                    font-style: normal;
                    font-weight: 400;
                    font-size: 66px;
                    line-height: 66px;
                    color: var(--color-text-main);
                }

                .header-box {
                    height: 97px;
                    background: var(--color-white);
                    border: 4px solid var(--color-primary-green);
                    border-radius: var(--border-radius-large);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: absolute;
                    top: 0;
                }

                .game-background {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    /* background-image는 위에서 인라인 스타일로 설정됨 */
                    background-size: cover;
                    background-position: center;
                    background-repeat: no-repeat;
                    z-index: -1;
                }

                /* 헤더 스타일 */
                .game-header {
                    position: relative; /* 자식 absolute 요소들의 기준점 */
                    width: 1360px;
                    height: 97px;
                    padding: 0;
                    z-index: 10; /* header-area-background 보다 높게 */
                }

                .stage-title {
                    width: 300px; /* Figma 기준 width */
                    height: 57px;
                    text-align: center;
                    position: absolute;
                    right: calc(50% + (300px / 2) + 150px); /* SCORE 중앙 + SCORE너비/2 + 마진 = STAGE 오른쪽 끝 */
                    top: 50%;
                    transform: translateY(-50%);
                }

                .score-container {
                    /* Inherits from .header-box */
                    width: 336px; /* Figma 기준 width */
                    position: absolute; /* 추가 */
                    top: 0; /* 추가, .header-box와 일관성 */
                    left: 50%;
                    transform: translateX(-50%);
                }
                
                /* .score-container .score-value styles are now covered by .header-text-large */

                .timer-container {
                    /* Inherits from .header-box */
                    width: 200px; /* Figma 기준 width */
                    gap: 10px;
                    position: absolute; /* 추가 */
                    top: 0; /* 추가, .header-box와 일관성 */
                    left: calc(50% + (300px / 2) + 150px); /* SCORE 중앙 + SCORE너비/2 + 마진 = TIMER 왼쪽 끝 */
                }

                .timer-icon {
                    width: 48px;
                    height: 48px;
                }

                /* .timer-value styles are now covered by .header-text-large */

                /* 메인 게임 영역 */
                .game-main {
                    position: absolute;
                    top: 177px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 1400px;
                    height: 750px;
                }

                .bricks-wrapper {
                    display: flex;
                    justify-content: space-around;
                    align-items: flex-start;
                    width: 100%;
                    height: 365px;
                    position: relative;
                }
                
                .bricks-container {
                    width: 365px;
                    height: 365px;
                    position: relative;
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    grid-template-rows: repeat(3, 1fr);
                    gap: 5px;
                    align-items: center;
                    justify-items: center;
                }

                .pokemon-brick {
                    width: 90px;
                    height: 90px;
                    background-color: transparent; /* Default if no image */
                    border-radius: var(--border-radius-small);
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                /* Common styles for image bricks within specific groups */
                .bricks-group1 .pokemon-brick,
                .bricks-group2 .pokemon-brick,
                .bricks-group3 .pokemon-brick {
                    background-size: cover;
                    background-repeat: no-repeat;
                    background-position: center;
                    /* background-color: transparent; 이미지가 없을 경우 대비, 또는 기본 벽돌 색상 */
                }

                .pokemon-brick:hover {
                    transform: scale(1.1);
                    opacity: 0.8;
                }

                .pokemon-image {
                    width: 200px;
                    height: 200px;
                    object-fit: contain;
                    display: block;
                }

                .pokemon-image:hover {
                    transform: scale(1.1);
                    opacity: 0.8;
                }

                /* 게임 오브젝트들 */
                .game-objects {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                }

                .pokeball {
                    position: absolute;
                    width: 150px;
                    height: 150px;
                    z-index: 5;
                }

                .pokeball img { width: 100%; height: 100%; }

                .paddle {
                    position: absolute;
                    width: 200px;
                    height: 200px;
                    cursor: pointer;
                    z-index: 5;
                    pointer-events: auto;
                }

                .paddle img { width: 100%; height: 100%; }

                /* 푸터 */
                .game-footer {
                    position: absolute;
                    bottom: 0;
                    left: 0; /* game-page의 왼쪽 끝에서 시작 */
                    width: 100%; /* game-page의 전체 너비 (1440px) */
                    height: 120px;
                    background-color: rgba(255, 255, 255, 0.6); /* 흰색 배경, 60% 투명도 */
                    display: flex;
                    justify-content: flex-end; /* 자식 요소를 오른쪽으로 정렬 */
                    align-items: center;     /* 자식 요소를 수직 중앙 정렬 */
                    padding-right: 20px;     /* 오른쪽 끝에서 info-box까지의 여백 */
                    box-sizing: border-box;  /* 패딩 계산에 포함 */
                    z-index: 10;
                }

                .footer-info-box {
                    width: 350px;
                    height: 100px;
                    background: var(--color-white); /* 불투명 흰색 배경 */
                    border: 4px solid var(--color-primary-green);
                    border-radius: var(--border-radius-large);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    /* padding: 10px;  내부 텍스트용 패딩, 필요시 유지 */
                    box-sizing: border-box;
                    /* position, bottom, right 등은 제거되거나 flex item으로 동작 */
                }

                .caught-pokemon {
                    width: 60px;
                    height: 60px;
                    border-radius: var(--border-radius-small);
                    overflow: hidden;
                    flex-shrink: 0;
                    background: #f0f0f0; /* Consider var(--color-light-gray) or similar */
                }

                .caught-pokemon img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                }
                
                .empty-collection {
                    color: var(--color-text-light);
                    font-size: 18px;
                    text-align: center;
                    width: 100%;
                }
        `;
    }

    renderBricks(groupIndex, stage) {
        let brickHtml = '';
        const totalCells = 9; // 3x3 grid
        const middleCellIndex = 4; // 0-indexed middle cell
        const maxBrickIndexForStage = this.brickImageCounts[stage] || 1;

        // 해당 그룹 전체에 적용될 랜덤 벽돌 이미지 결정 (루프 밖에서 한 번만)
        const chosenRandomBrickIndex = Math.floor(Math.random() * maxBrickIndexForStage) + 1;
        const brickImageNameForThisGroup = `brick_lev${stage}_${chosenRandomBrickIndex}.png`;
        const brickStyleForThisGroup = `background-image: url('./assets/brick/${brickImageNameForThisGroup}');`;

        for (let i = 0; i < totalCells; i++) {
            if (i === middleCellIndex) {
                const pokemonName = `그룹 ${groupIndex} 포켓몬`;
                const imageName = `poke_lev${stage}_${groupIndex}.png`;
                brickHtml += `<img src="./assets/pokemon/${imageName}" alt="${pokemonName}" class="pokemon-image">`;
            } else {
                // 루프 밖에서 결정된 동일한 스타일을 모든 벽돌에 적용
                brickHtml += `<div class="pokemon-brick" style="${brickStyleForThisGroup}" data-pokemon="group${groupIndex}_brick_${i}" data-level="1"></div>`;
            }
        }
        return brickHtml;
    }

    /**
     * 수집한 포켓몬 렌더링 (초기 빈 상태 표시)
     */
    renderCaughtPokemon() {
        return '<div class="empty-collection"></div>';
    }

    mount(container) {
        this.container = container;
        this.container.innerHTML = this.render();
        
        // 스타일 처리: getStyles() 메서드에서 스타일 내용을 가져와 head에 추가
        this.styleElement = document.createElement('style');
        this.styleElement.textContent = this.getStyles();
        document.head.appendChild(this.styleElement);
        
    }

    unmount() {
        if (this.styleElement && document.head.contains(this.styleElement)) {
            document.head.removeChild(this.styleElement);
        }
        if (this.container) {
            this.container.innerHTML = '';
        }
        this.container = null;
        this.styleElement = null;
    }
} 