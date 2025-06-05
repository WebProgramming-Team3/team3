class MiniGamePage {
    constructor() {
        // 미니게임 관련 변수들 초기화
        this.gameData = null; // game.js에서 전달받을 데이터
        this.canvasWidth = 1440;
        this.canvasHeight = 1024;
        this.headerHeight = 181;
        this.footerHeight = 120;
        this.myScore = 0;      // 나의 점수
        this.opponentScore = 0; // 상대방 점수
        this.selectedChoice = null; // 선택된 가위바위보
        this.selected = false; //선택 여부 저장
    }

    render() {
        return `
            <div class="minigame-page">
                <!-- 배경 이미지 -->
                <div class="background-container"></div>
                
                <!-- 헤더 -->
                <div class="minigame-header">
                    <div class="stage-text">MINI GAME</div>
                    <div class="header-box score-box">
                        <span>SCORE ${this.myScore} : ${this.opponentScore}</span>
                    </div>
                </div>
                
                <!-- 메인 게임 영역 -->
                <div class="minigame-content">
                    <div class="game-area">
                        <div class="circle-box left-circle"></div>
                        <div class="game-box">
                            <div class="rps-selection">
                                <div class="rps-option" data-choice="scissors">
                                    <img src="assets/minigame/scissors.png" alt="가위" class="rps-img">
                                </div>

                                <div class="rps-option" data-choice="rock">
                                    <img src="assets/minigame/rock.png" alt="바위" class="rps-img">
                                </div>

                                <div class="rps-option" data-choice="paper">
                                    <img src="assets/minigame/paper.png" alt="보" class="rps-img">
                                </div>
                            </div>
                        </div>
                        <div class="circle-box right-circle"></div>
                    </div>
                </div>
                
                <!-- 푸터 -->
                <div class="minigame-footer">
                    <div class="pokemon-collection-box">
                        <div class="collection-content">
                            <span class="collection-text"></span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getStyles() {
        const backgroundSetting = (typeof SettingsPage !== 'undefined' && SettingsPage.getBackgroundSetting) ? 
                                  SettingsPage.getBackgroundSetting() : 'light';
        
        const backgroundImage = backgroundSetting === 'dark' ? 
                              'assets/background/background-dark.png' : 
                              'assets/background/background-light.png';

        return `
            @import url('https://fonts.googleapis.com/css2?family=Bungee:wght@400&display=swap');

            .minigame-page {
                width: ${this.canvasWidth}px;
                height: ${this.canvasHeight}px;
                position: relative;
                margin: 0 auto;
                font-family: 'Bungee', cursive;
                overflow: hidden;
                border: 1px solid #ccc;
            }

            /* 배경 */
            .background-container {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-image: url('${backgroundImage}');
                background-size: cover;
                background-position: center;
                background-repeat: no-repeat;
                z-index: 1;
            }

            /* 헤더 */
            .minigame-header {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: ${this.headerHeight}px;
                background: rgba(255, 255, 255, 0.6);
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0 100px;
                box-sizing: border-box;
                z-index: 10;
            }

            .stage-text {
                font-size: 128px;
                color: #737373;
                font-weight: 400;
                margin: 0;
                margin-left: -50px;
                align-self: center;
                margin-top: 5px;
            }

            .header-box {
                background: #FFFFFF;
                border: 4px solid #60CD52;
                border-radius: 10px;
                padding: 20px 30px;
                font-size: 55px;
                color: #737373;
                font-weight: 400;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 15px;
                margin-top: 5px;
            }

            .score-box {
                width: 400px;
                height: 97px;
                box-sizing: border-box;
                
            }

            /* 메인 콘텐츠 */
            .minigame-content {
                position: absolute;
                top: ${this.headerHeight}px;
                left: 0;
                width: 100%;
                height: ${this.canvasHeight - this.headerHeight - this.footerHeight}px;
                display: flex;
                flex-direction: column;
                z-index: 5;
            }

            .game-area {
                flex: 1;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 40px;
                gap: 30px;
            }

            .circle-box {
                width: 320px;
                height: 320px;
                background: #FFFFFF;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
            }

            .game-box {
                width: 676px;
                height: 220px;
                background: #FFFFFF;
                border-radius: 15px;
                border: 5px solid #60CD52;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 1.2rem;
                color: white;
                box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
                overflow: hidden;
            }

            .rps-selection {
                display: flex;
                justify-content: space-around;
                align-items: center;
                width: 100%;
                height: 100%;
                padding: 20px;
            }

            .rps-option {
                display: flex;
                flex-direction: column;
                align-items: center;
                cursor: pointer;
                padding: 5px;
                border-radius: 10px;
                transition: all 0.3s ease;
                border: 3px solid transparent;
                position: relative;
            }

            .rps-option:hover {
                background: none;
                border-color: transparent;
            }

            .rps-option:hover::after {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 200px;
                height: 200px;
                border: 8px solid #FFD700;
                border-radius: 50%;
                pointer-events: none;
                z-index: 10;
                animation: fadeIn 0.3s ease;
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            .rps-option.selected {
                background: rgba(63, 124, 255, 0.2);
                border-color: #3F7CFF;
                box-shadow: 0 0 10px rgba(63, 124, 255, 0.5);
            }

            .rps-img {
                width: 198px;
                height: 200px;
                object-fit: contain;
                margin-bottom: 10px;
            }

            /* 푸터 */
            .minigame-footer {
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: ${this.footerHeight}px;
                background: rgba(255, 255, 255, 0.6);
                display: flex;
                align-items: center;
                justify-content: flex-end;
                padding: 0 20px;
                box-sizing: border-box;
                z-index: 10;
            }

            .pokemon-collection-box {
                background: #FFFFFF;
                border: 4px solid #60CD52;
                border-radius: 10px;
                width: 350px;
                height: 100px;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0 10px;
                box-sizing: border-box;
            }

            .collection-content {
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .collection-text {
                color: #aaa;
                font-size: 18px;
                font-family: 'Bungee', cursive;
            }

            /* 전체 페이지 설정 */
            html, body {
                height: 100%;
                margin: 0;
                padding: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;
                background: #FFFFFF;
            }
        `;
    }

    mount(container) {
        this.container = container;
        this.container.innerHTML = this.render();
        
        // 스타일 적용
        this.styleElement = document.createElement('style');
        this.styleElement.textContent = this.getStyles();
        document.head.appendChild(this.styleElement);

        // 이벤트 리스너 추가
        this.addEventListeners();
    }

    addEventListeners() {
        // 가위바위보 선택 이벤트
        const rpsOptions = this.container.querySelectorAll('.rps-option');
        rpsOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                this.selectRPSChoice(e.currentTarget);
                this.opponentChoice();
            });
        });
    }

    selectRPSChoice(selectedOption) {
        // 모든 옵션에서 selected 클래스 제거
        const allOptions = this.container.querySelectorAll('.rps-option');
        allOptions.forEach(option => option.classList.remove('selected'));
        
        // 선택된 옵션에 selected 클래스 추가
        selectedOption.classList.add('selected');
        
        // 선택된 값 저장
        this.selectedChoice = selectedOption.dataset.choice;
        console.log('선택된 가위바위보:', this.selectedChoice);
        let img = document.createElement("img");
        //선택한 가위바위보 띄우기
        img.src = `assets/minigame/${this.selectedChoice}.png`;
        $(".circle-box.right-circle").append(img);
        this.selected = true;

    }

    opponentChoice(){
        if(this.selected === true){
            const rsp = {1:'rock', 2:'scissors', 3:'paper'};
            let num = parseInt(Math.random()*3 + 1);
            let key = rsp[num];
            let img = document.createElement("img");
            img.src = `assets/minigame/${key}.png`;
            $(".circle-box.left-circle").append(img);
            console.log("랜덤");
        }
    }

    // 점수 업데이트 메서드들
    updateMyScore(score) {
        this.myScore = score;
        this.updateScoreDisplay();
    }

    updateOpponentScore(score) {
        this.opponentScore = score;
        this.updateScoreDisplay();
    }

    updateScoreDisplay() {
        const scoreElement = this.container.querySelector('.score-box span');
        if (scoreElement) {
            scoreElement.textContent = `SCORE ${this.myScore} : ${this.opponentScore}`;
        }
    }

    // game.js에서 데이터를 받아올 메서드
    setGameData(data) {
        this.gameData = data;
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