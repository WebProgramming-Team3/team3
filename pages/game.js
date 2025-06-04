
class GamePage {
    constructor() {
        this.container = null;
        this.canvas = null;
        this.context = null;
        this.currentStage = 2; // 현재 스테이지
        this.brickImageCounts = { 1: 2, 2: 5, 3: 5 }; // 스테이지별 벽돌 이미지 개수
        this.ball = {
            x: 720,
            y: 590,
            dx: 2,
            dy: -2,
            radius: 25,
            level: 1,
            power: 1
        };
        this.paddle = {
            width: 200,
            height: 200,
            x: 720,
            y: 600
        };
        this.score = 0; // 점수 
        this.images = {}; // 이미지 캐시
        this.imagesLoaded = false;
        this.brickGroups = []; // 벽돌 그룹 정보 저장
        this.timeLeft = 60; // 게임 시작 시 남은 시간 (초)
        this.lastTime = null; // 이전 프레임 시간 저장용
    }

    /**
     * 이미지 로딩
     */
    async loadImages() {
        const imagePaths = {
            // 배경
            'background-light': './assets/background/background-light.png',
            'background-dark': './assets/background/background-dark.png',
            
            // 유틸리티
            'timer': './assets/utils/timer.png',
            'hand': './assets/utils/hand.png',
            
            // 볼
            'ball_lev1_1': './assets/ball/ball_lev1_1.png',
            'ball_lev2_1': './assets/ball/ball_lev2_1.png',
            'ball_lev2_2': './assets/ball/ball_lev2_2.png',
            'ball_lev3_1': './assets/ball/ball_lev3_1.png',
            'ball_lev3_2': './assets/ball/ball_lev3_2.png',
            'ball_lev3_3': './assets/ball/ball_lev3_3.png',
            'ball_lev3_4': './assets/ball/ball_lev3_4.png',
            
            // 포켓몬 (스테이지별)
            'poke_lev1_1': './assets/pokemon/poke_lev1_1.png',
            'poke_lev1_2': './assets/pokemon/poke_lev1_2.png',
            'poke_lev1_3': './assets/pokemon/poke_lev1_3.png',
            'poke_lev2_1': './assets/pokemon/poke_lev2_1.png',
            'poke_lev2_2': './assets/pokemon/poke_lev2_2.png',
            'poke_lev2_3': './assets/pokemon/poke_lev2_3.png',
            'poke_lev3_1': './assets/pokemon/poke_lev3_1.png',
            'poke_lev3_2': './assets/pokemon/poke_lev3_2.png',
            'poke_lev3_3': './assets/pokemon/poke_lev3_3.png',
        };

        // 벽돌 이미지들 동적 추가
        for (let stage = 1; stage <= 3; stage++) {
            const brickCount = this.brickImageCounts[stage] || 1;
            for (let i = 1; i <= brickCount; i++) {
                imagePaths[`brick_lev${stage}_${i}`] = `./assets/brick/brick_lev${stage}_${i}.png`;
            }
        }

        const loadPromises = Object.entries(imagePaths).map(([key, path]) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => {
                    this.images[key] = img;
                    resolve();
                };
                img.onerror = () => reject(new Error(`Failed to load image: ${path}`));
                img.src = path;
            });
        });

        try {
            await Promise.all(loadPromises);
            this.imagesLoaded = true;
            console.log('All images loaded successfully');
        } catch (error) {
            console.error('Error loading images:', error);
        }
    }

    /**
     * 게임 페이지 렌더링 (Canvas 기반)
     */
    render() {
        return `
            <div class="game-page">
                <canvas id="gameCanvas" width="1440" height="1024"></canvas>
            </div>
        `;
    }

    /**
     * 벽돌 그룹 정보 초기화 (게임 시작 시 한 번만)
     */
    initializeBrickGroups() {
        this.brickGroups = [];
        
        for (let groupIndex = 1; groupIndex <= 3; groupIndex++) {
            const maxBrickIndexForStage = this.brickImageCounts[this.currentStage] || 1;
            const chosenRandomBrickIndex = Math.floor(Math.random() * maxBrickIndexForStage) + 1;
            
            const brickGroup = {
                groupIndex: groupIndex,
                brickImageKey: `brick_lev${this.currentStage}_${chosenRandomBrickIndex}`,
                pokemonImageKey: `poke_lev${this.currentStage}_${groupIndex}`,
                brickGroups: [] // 개별 벽돌 상태 (파괴되었는지 등)
            };

            // 3x3 그리드의 벽돌 상태 초기화 (디자인용 - 모두 표시)
            for (let i = 0; i < 9; i++) {
                brickGroup.brickGroups.push({
                    isPokemon: i === 4 // 중앙(인덱스 4)이 포켓몬
                });
            }

            this.brickGroups.push(brickGroup);
        }
    }

    addEventListeners() {
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            
            this.paddle.x = Math.max(0, Math.min(mouseX - this.paddle.width/2, 
                this.canvas.width - this.paddle.width));
        });
    }

    /**
     * Canvas에 디자인 그리기 (정적)
     */
    drawDesign() {
        if (!this.context || !this.imagesLoaded) return;

        // 캔버스 초기화
        this.context.clearRect(0, 0, 1440, 1024);

        // 배경 그리기
        this.drawBackground();

        // 헤더 영역 그리기
        this.drawHeader();

        // 벽돌들 그리기
        this.drawbrickGroups();

        // 게임 오브젝트들 그리기
        this.drawGameObjects();

        // 푸터 그리기
        this.drawFooter();
    }

    /**
     * 배경 그리기
     */
    drawBackground() {
        const backgroundSetting = typeof SettingsPage !== 'undefined' && SettingsPage.getBackgroundSetting ? 
                                  SettingsPage.getBackgroundSetting() : 'light';
        
        const backgroundKey = backgroundSetting === 'dark' ? 'background-dark' : 'background-light';
        const backgroundImage = this.images[backgroundKey];
        
        if (backgroundImage) {
            this.context.drawImage(backgroundImage, 0, 0, 1440, 1024);
        }
    }

    /**
     * 헤더 영역 그리기
     */
    drawHeader() {
        // 헤더 배경 (반투명 흰색)
        this.context.fillStyle = 'rgba(255, 255, 255, 0.6)';
        this.context.fillRect(0, 0, 1440, 137);

        // 폰트 설정
        this.context.font = "66px 'Bungee', cursive";
        this.context.fillStyle = '#4F4F4F';
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';

        // STAGE 텍스트
        const stageX = 720 - 168 - 300; // 중앙에서 왼쪽으로 이동
        this.context.fillText(`STAGE ${this.currentStage}`, stageX, 68 + 5);

        // SCORE 박스 그리기
        this.drawHeaderBox(720, 68, 336, 97, `SCORE ${this.score}`);

        // TIMER 박스 그리기
        const timerX = 720 + 168 + 300; // 중앙에서 오른쪽으로 이동
        this.drawTimerBox(timerX, 68, 200, 97, this.timeLeft);
    }

    /**
     * 둥근 모서리 사각형 그리기 헬퍼 함수
     */
    drawRoundedRect(x, y, width, height, radius) {
        this.context.beginPath();
        this.context.moveTo(x + radius, y);
        this.context.lineTo(x + width - radius, y);
        this.context.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.context.lineTo(x + width, y + height - radius);
        this.context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.context.lineTo(x + radius, y + height);
        this.context.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.context.lineTo(x, y + radius);
        this.context.quadraticCurveTo(x, y, x + radius, y);
        this.context.closePath();
    }

    /**
     * 헤더 박스 그리기
     */
    drawHeaderBox(centerX, centerY, width, height, text) {
        const x = centerX - width / 2;
        const y = centerY - height / 2;
        const borderRadius = 10;

        // 둥근 모서리 박스 그리기
        this.drawRoundedRect(x, y, width, height, borderRadius);
        
        // 박스 배경 (흰색)
        this.context.fillStyle = '#FFFFFF';
        this.context.fill();
        
        // 박스 테두리 (녹색, 4px)
        this.context.strokeStyle = '#60CD52';
        this.context.lineWidth = 4;
        this.context.stroke();

        // 텍스트
        this.context.fillStyle = '#4F4F4F';
        this.context.fillText(text, centerX, centerY + 5);
    }

    /**
     * 타이머 박스 그리기 (아이콘 포함)
     */
    drawTimerBox(centerX, centerY, width, height, timeLeft) {
        const x = centerX - width / 2;
        const y = centerY - height / 2;
        const borderRadius = 10;

        // 둥근 모서리 박스 그리기
        this.drawRoundedRect(x, y, width, height, borderRadius);
        
        // 박스 배경 (흰색)
        this.context.fillStyle = '#FFFFFF';
        this.context.fill();
        
        // 박스 테두리 (녹색)
        this.context.strokeStyle = '#60CD52';
        this.context.lineWidth = 4;
        this.context.stroke();

        // 타이머 아이콘
        const timerImage = this.images['timer'];
        if (timerImage) {
            const iconSize = 48;
            const iconX = centerX - 80; // 텍스트 왼쪽에 아이콘
            const iconY = centerY - iconSize / 2;
            this.context.drawImage(timerImage, iconX, iconY, iconSize, iconSize);
        }

        // 시간 텍스트
        this.context.fillStyle = '#4F4F4F';
        this.context.fillText(timeLeft.toString(), centerX + 24, centerY + 5);
    }

    /**
     * 벽돌들 그리기
     */
    drawbrickGroups() {
        const startY = 177;
        const groupWidth = 365;
        const groupHeight = 365;
        const spacing = (1350 - groupWidth * 3) / 2; // 그룹 간 간격
        
        // 3개 그룹 위치 계산
        const groupPositions = [
            { x: spacing / 2, y: startY }, // 첫 번째 그룹
            { x: spacing / 2 + groupWidth + spacing, y: startY }, // 두 번째 그룹
            { x: spacing / 2 + (groupWidth + spacing) * 2, y: startY } // 세 번째 그룹
        ];

        for (let groupIndex = 0; groupIndex < 3; groupIndex++) {
            if (this.brickGroups[groupIndex]) {
                this.drawBrickGroup(this.brickGroups[groupIndex], groupPositions[groupIndex]);
            }
        }
    }

    /**
     * 개별 벽돌 그룹 그리기
     */
    drawBrickGroup(brickGroup, position) {
        const cellSize = 90;
        const gap = 40;
        const totalCells = 9; // 3x3

        // 저장된 벽돌 이미지 사용
        const brickImage = this.images[brickGroup.brickImageKey];
        const pokemonImage = this.images[brickGroup.pokemonImageKey];

        for (let i = 0; i < totalCells; i++) {
            const brick = brickGroup.brickGroups[i];
            
            const row = Math.floor(i / 3);
            const col = i % 3;
            const x = position.x + col * (cellSize + gap);
            const y = position.y + row * (cellSize + gap);

            if (brick.isPokemon) {
                // 중앙에 포켓몬 이미지
                if (pokemonImage) {
                    this.context.drawImage(pokemonImage, x - 55, y - 55, 200, 200); // 포켓몬은 더 크게
                }
            } else {
                // 벽돌 그리기
                if (brickImage) {
                    this.context.drawImage(brickImage, x, y, cellSize, cellSize);
                }
            }
        }
    }

    /**
     * 게임 오브젝트들 그리기 (볼, 패들)
     */
    drawGameObjects() {
        const ballImage = this.images[`ball_lev${this.ball.level}_1`];
        if (ballImage) {
            this.context.drawImage(
                ballImage, 
                this.ball.x - this.ball.radius,
                this.ball.y - this.ball.radius, 
                this.ball.radius * 2 ,
                this.ball.radius * 2
            );
        }

        // 패들 그리기
        const handImage = this.images['hand'];
        if (handImage) {
            this.context.drawImage(handImage, this.paddle.x, this.paddle.y, 
                this.paddle.width, this.paddle.height);
        }
    }

    moveBall() {
        this.ball.x += this.ball.dx;
        this.ball.y += this.ball.dy;

        if (this.ball.x + this.ball.radius > this.canvas.width || 
            this.ball.x - this.ball.radius < 0) {
            this.ball.dx = -this.ball.dx;
        }

        // TODO : 바닥에 닿으면 게임 오버 처리
        if (this.ball.y + this.ball.radius > this.canvas.height) {
            // this.isGameOver = true;
        }
    }

    checkCollisions() {
        // 패들 충돌 체크
        if (this.ball.y + this.ball.radius > this.paddle.y &&
            this.ball.x > this.paddle.x && 
            this.ball.x < this.paddle.x + this.paddle.width) {
            this.ball.dy = -Math.abs(this.ball.dy);
            
            const paddleCenter = this.paddle.x + this.paddle.width/2;
            const hitPoint = (this.ball.x - paddleCenter) / (this.paddle.width/2);
            this.ball.dx = hitPoint * 8;
        }

        // 헤더 충돌 체크
        const headerHeight = 137;
        if (
            this.ball.y - this.ball.radius <= headerHeight &&
            this.ball.dy < 0 // 위로 올라가는 중일 때만
        ) {
            this.ball.dy = Math.abs(this.ball.dy); // 아래로 튕기기
        }

        // TODO : 벽돌 충돌 체크

        // TODO: 포켓몬 충돌 체크
    }

    /**
     * 푸터 그리기
     */
    drawFooter() {
        const footerHeight = 120;
        const footerY = 1024 - footerHeight;

        // 푸터 배경 (반투명 흰색)
        this.context.fillStyle = 'rgba(255, 255, 255, 0.6)';
        this.context.fillRect(0, footerY, 1440, footerHeight);

        // 정보 박스
        const boxWidth = 350;
        const boxHeight = 100;
        const boxX = 1440 - boxWidth - 20; // 오른쪽 끝에서 20px 떨어진 곳
        const boxY = footerY + (footerHeight - boxHeight) / 2;

        // 둥근 모서리 박스 그리기
        const borderRadius = 10;
        this.drawRoundedRect(boxX, boxY, boxWidth, boxHeight, borderRadius);
        
        // 박스 배경 (흰색)
        this.context.fillStyle = '#FFFFFF';
        this.context.fill();

        // 박스 테두리 (녹색)
        this.context.strokeStyle = '#60CD52';
        this.context.lineWidth = 4;
        this.context.stroke();

        // 빈 컬렉션 텍스트 (임시)
        this.context.fillStyle = '#aaa';
        this.context.font = '18px Arial';
        this.context.textAlign = 'center';
        // this.context.fillText('수집한 포켓몬이 여기에 표시', boxX + boxWidth / 2, boxY + boxHeight / 2);
    }

    getStyles() {
        return `
                @import url('https://fonts.googleapis.com/css2?family=Bungee:wght@400&display=swap');

                html, body {
                    height: 100%;
                    margin: 0;
                    padding: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    font-family: 'Bungee', cursive;
                }

                .game-page {
                    width: 1440px;
                    height: 1024px;
                    position: relative;
                }

                #gameCanvas {
                    border: 1px solid #ccc;
                    display: block;
                }
        `;
    }

    startTimer() {
        this.timerIntervalId = setInterval(() => {
            this.timeLeft -= 1;
            if (this.timeLeft <= 0) {
                this.timeLeft = 0;
                this.stopTimer();
                this.onTimeOver?.();
            }
            this.drawDesign();
        }, 1000);
    }

    stopTimer() {
        if (this.timerIntervalId) {
            clearInterval(this.timerIntervalId);
            this.timerIntervalId = null;
        }
    }

    startGameLoop() {
        const loop = () => {
            this.drawDesign();
            this.moveBall();
            this.checkCollisions();
            this.animationFrameId = requestAnimationFrame(loop);
        };
        this.animationFrameId = requestAnimationFrame(loop);
    }
    
    stopGameLoop() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
    }

    async mount(container) {
        this.container = container;
        this.container.innerHTML = this.render();
        
        // 스타일 처리
        this.styleElement = document.createElement('style');
        this.styleElement.textContent = this.getStyles();
        document.head.appendChild(this.styleElement);
        
        // Canvas 초기화
        this.canvas = document.getElementById('gameCanvas');
        this.context = this.canvas.getContext('2d');
        
        // 이미지 로딩 후 벽돌 그룹 초기화 및 디자인 그리기
        await this.loadImages();
        this.initializeBrickGroups();
        this.startGameLoop();
        this.addEventListeners();
        this.startTimer();
    }

    unmount() {
        this.stopGameLoop(); 
        this.stopTimer();

        if (this.styleElement && document.head.contains(this.styleElement)) {
            document.head.removeChild(this.styleElement);
        }
        if (this.container) {
            this.container.innerHTML = '';
        }
        this.container = null;
        this.canvas = null;
        this.context = null;
        this.styleElement = null;
        this.images = {};
        this.imagesLoaded = false;
        this.brickGroups = [];
    }
} 