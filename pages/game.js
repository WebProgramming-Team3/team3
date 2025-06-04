class GamePage {
    constructor() {
        // 캔버스 크기 및 레이아웃 설정
        this.canvasWidth = 1440;
        this.canvasHeight = 1024;
        this.headerHeight = 137;
        this.footerHeight = 120;

        this.container = null;
        this.canvas = null;
        this.context = null;
        this.currentStage = 3; // 현재 스테이지
        this.brickImageCounts = { 1: 2, 2: 5, 3: 5 }; // 스테이지별 벽돌 이미지 개수
        this.paddle = {
            width: 120,
            height: 120,
            x: (this.canvasWidth - 120) / 2, // 가로 중앙 정렬
            y: this.canvasHeight - this.footerHeight - 120 // 하단 footer 위
        };
        this.ball = {
            x: this.paddle.x + this.paddle.width / 2,
            y: this.paddle.y - 25,
            dx: 4,
            dy: -4,
            radius: 25,
            level: 1,
            power: 1  // 초기 데미지
        };
        this.score = 0; // 점수 
        this.images = {}; // 이미지 캐시
        this.imagesLoaded = false;
        this.brickGroups = []; // 벽돌 그룹 정보 저장
        this.timeLeft = 5; // 게임 시작 시 남은 시간 (초)
        this.lastTime = null; // 이전 프레임 시간 저장용
        this.isGameOver = false;
        this.isGameOverHandled = false;
        this.gameResult = null; // 'win' or 'lose'
        this.pokemons = [];
        this.collectedPokemons = []; // 수집된 포켓몬 배열 추가
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
            'lose': './assets/utils/lose.png',
            'win': './assets/utils/win.png',
            
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
                <canvas id="gameCanvas" width="${this.canvasWidth}" height="${this.canvasHeight}"></canvas>
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
            const stageHealth = this.currentStage === 3 ? 4 : this.currentStage; // 스테이지 3은 체력 4
            for (let i = 0; i < 9; i++) {
                brickGroup.brickGroups.push({
                    isPokemon: i === 4, // 중앙(인덱스 4)이 포켓몬
                    health: stageHealth,
                    maxHealth: stageHealth,
                    opacity: 1
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
        this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

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
            this.context.drawImage(backgroundImage, 0, 0, this.canvasWidth, this.canvasHeight);
        }
    }

    /**
     * 헤더 영역 그리기
     */
    drawHeader() {
        // 헤더 배경 (반투명 흰색)
        this.context.fillStyle = 'rgba(255, 255, 255, 0.6)';
        this.context.fillRect(0, 0, this.canvasWidth, this.headerHeight);

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

            // 벽돌 좌표 정보
            brick.x = x;
            brick.y = y;
            brick.width = cellSize;  // 모든 요소의 크기를 동일하게
            brick.height = cellSize; // 모든 요소의 크기를 동일하게

            if (brick.isPokemon) {
                // 중앙에 포켓몬 이미지 (포획되지 않은 경우에만 표시)
                if (pokemonImage && !brick.caught) {
                    this.context.drawImage(pokemonImage, x, y, cellSize, cellSize);
                }
            } else {
                // 벽돌 그리기
                if (brickImage) {
                    this.context.save();
                    this.context.globalAlpha = brick.opacity;
                    this.context.drawImage(brickImage, x, y, cellSize, cellSize);
                    this.context.restore();
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

        this.context.strokeStyle = '#60CD52'; // 경계선
        this.context.lineWidth = 2;
        this.context.strokeRect(this.paddle.x, this.paddle.y, this.paddle.width, this.paddle.height);
    }

    moveBall() {
        this.ball.x += this.ball.dx;
        this.ball.y += this.ball.dy;

        // 왼쪽 벽
        if (this.ball.x - this.ball.radius <= 0) {
            this.ball.x = this.ball.radius;
            this.ball.dx = Math.abs(this.ball.dx);
        }

        // 오른쪽 벽
        if (this.ball.x + this.ball.radius >= this.canvas.width) {
            this.ball.x = this.canvas.width - this.ball.radius;
            this.ball.dx = -Math.abs(this.ball.dx);
        }

        // 바닥(footer)에 닿으면 게임 오버 처리
        const gameBottomY = this.canvas.height - this.footerHeight;
        if (this.ball.y + this.ball.radius > gameBottomY) {
            this.isGameOver = true;
            this.isGameOverHandled = true;
            this.stopGameLoop();
            this.endGame('lose');
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
        if (
            this.ball.y - this.ball.radius <= this.headerHeight &&
            this.ball.dy < 0 // 위로 올라가는 중일 때만
        ) {
            this.ball.dy = Math.abs(this.ball.dy); // 아래로 튕기기
        }

        // 벽돌 충돌 체크
        this.brickGroups.forEach(group => {
            group.brickGroups.forEach(brick => {
                // 이미 부서진 벽돌이나 포획된 포켓몬은 충돌 체크하지 않음
                if (brick.opacity <= 0 || (brick.isPokemon && brick.caught)) return;
        
                if (this.isCircleRectColliding(this.ball, brick)) {
                    // 충돌 처리
                    this.ball.dy = -this.ball.dy;
                    if (!brick.isPokemon) {
                        brick.health -= this.ball.power;
                        brick.opacity = Math.max(0, brick.health / brick.maxHealth);
                    }
                }
            });
        });

        // 포켓몬 충돌 체크
        this.brickGroups.forEach(group => {
            const pokemon = group.brickGroups[4]; // 중앙(인덱스 4)이 포켓몬
            if (pokemon.isPokemon && !pokemon.caught) {
                if (this.isCircleRectColliding(this.ball, pokemon)) {
                    pokemon.caught = true;
                    
                    // 포켓몬 레벨에 따른 점수 부여
                    const pokemonLevel = parseInt(group.pokemonImageKey.split('_')[1].substring(3));
                    this.score += pokemonLevel;
                    this.updateBallLevel(); // 점수가 올랐을 때만 볼 레벨 업데이트
                    
                    // 수집된 포켓몬 목록에 추가
                    this.collectedPokemons.push({
                        imageKey: group.pokemonImageKey,
                        stage: this.currentStage,
                        groupIndex: group.groupIndex
                    });
                }
            }
        });
    }

    isCircleRectColliding(circle, rect) {
        const closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
        const closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));
    
        const dx = circle.x - closestX;
        const dy = circle.y - closestY;
    
        return (dx * dx + dy * dy) <= (circle.radius * circle.radius);
    }

    endGame(status) {
        this.isGameOver = true;
        this.isGameOverHandled = true;
        this.stopGameLoop();
        this.stopTimer();
        this.gameResult = status;
    
        // 캔버스 전체 덮기
        this.context.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
        // 중앙 이미지 출력 (lose or win)
        const resultImageKey = status === 'win' ? 'win' : 'lose';
        const resultImage = this.images[resultImageKey];
        if (resultImage) {
            const imgWidth = 753;
            const imgHeight = 360;
            const imgX = (this.canvas.width - imgWidth) / 2;
            const imgY = (this.canvas.height - imgHeight) / 2 - 100;
            this.context.drawImage(resultImage, imgX, imgY, imgWidth, imgHeight);
        }
    
        // 텍스트
        this.context.font = '24px Bungee, cursive';
        this.context.fillStyle = 'white';
        this.context.textAlign = 'center';
        this.context.fillText(`최종 점수: ${this.score}`, this.canvas.width/2, this.canvas.height/2 + 100);
    
        const caught = this.collectedPokemons.length;
        this.context.fillText(`포획한 포켓몬: ${caught}마리`, this.canvas.width/2, this.canvas.height/2 + 140);
    
        // 버튼 설정
        const buttonWidth = 200;
        const buttonHeight = 50;
        const buttonX = this.canvas.width/2 - buttonWidth/2;
        const buttonY = this.canvas.height/2 + 200;
    
        // 승리했을 때와 패배했을 때 다른 버튼 표시
        if (status === 'win') {
            if (this.currentStage < 3) {
                // 다음 스테이지 버튼
                this.context.fillStyle = '#60CD52';
                this.context.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
                this.context.fillStyle = 'white';
                this.context.fillText('다음 스테이지', this.canvas.width/2, buttonY + 32);
            } else {
                // 스테이지 3에서는 메인화면으로 이동 버튼
                this.context.fillStyle = '#60CD52';
                this.context.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
                this.context.fillStyle = 'white';
                this.context.fillText('메인으로', this.canvas.width/2, buttonY + 32);
            }
        } else {
            // 패배했을 때는 재시작 버튼
            this.context.fillStyle = '#60CD52';
            this.context.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
            this.context.fillStyle = 'white';
            this.context.fillText('다시 시작', this.canvas.width/2, buttonY + 32);
        }
    
        // 게임 재시작/다음 스테이지/메인화면 버튼 이벤트
        const buttonHandler = (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;
        
            if (clickX > buttonX && clickX < buttonX + buttonWidth &&
                clickY > buttonY && clickY < buttonY + buttonHeight) {
                this.canvas.removeEventListener('click', buttonHandler);
                
                if (status === 'win') {
                    if (this.currentStage < 3) {
                        // 다음 스테이지로 이동
                        this.currentStage++;
                        this.resetGame();
                    } else {
                        // 메인화면으로 이동
                        if (window.router) {
                            window.router.navigate('home');
                        }
                    }
                } else {
                    // 패배했을 때는 현재 스테이지 재시작
                    this.resetGame();
                }
            }
        };
        
        this.canvas.addEventListener('click', buttonHandler);
    }

    resetGame() {
        // 기본 상태 초기화
        this.score = 0;
        this.timeLeft = 60;
        this.isGameOver = false;
        this.isGameOverHandled = false;
        this.gameResult = null;
    
        // 패들 위치 초기화
        this.paddle.x = (this.canvasWidth - this.paddle.width) / 2;
        this.paddle.y = this.canvasHeight - this.footerHeight - this.paddle.height;
    
        // 공 위치 및 속도 초기화
        this.ball.x = this.paddle.x + this.paddle.width / 2;
        this.ball.y = this.paddle.y - this.ball.radius;
        this.ball.dx = 4;
        this.ball.dy = -4;
        this.ball.level = 1;
        this.ball.power = 1; // 볼 파워 초기화
    
        // 포켓몬 포획 정보 초기화
        if (Array.isArray(this.pokemons)) {
            this.pokemons.forEach(p => p.caught = false);
        }
    
        // 벽돌 그룹 초기화
        this.initializeBrickGroups();
    
        // 게임 루프 재시작
        this.startGameLoop();
        this.startTimer();
    }

    /**
     * 푸터 그리기
     */
    drawFooter() {
        const footerY = this.canvasHeight - this.footerHeight;

        // 푸터 배경 (반투명 흰색)
        this.context.fillStyle = 'rgba(255, 255, 255, 0.6)';
        this.context.fillRect(0, footerY, this.canvasWidth, this.footerHeight);

        // 정보 박스
        const boxWidth = 350;
        const boxHeight = 100;
        const boxX = this.canvasWidth - boxWidth - 20;
        const boxY = footerY + (this.footerHeight - boxHeight) / 2;

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

        // 수집된 포켓몬 표시
        if (this.collectedPokemons.length > 0) {
            const pokemonSize = 60;
            const padding = 10;
            const startX = boxX + padding;
            const startY = boxY + (boxHeight - pokemonSize) / 2;

            // 최대 5개까지만 표시
            const displayCount = Math.min(5, this.collectedPokemons.length);
            
            for (let i = 0; i < displayCount; i++) {
                const pokemon = this.collectedPokemons[i];
                const pokemonImage = this.images[pokemon.imageKey];
                if (pokemonImage) {
                    this.context.drawImage(
                        pokemonImage,
                        startX + i * (pokemonSize + padding),
                        startY,
                        pokemonSize,
                        pokemonSize
                    );
                }
            }

            // 더 많은 포켓몬이 있을 경우 +N 표시
            if (this.collectedPokemons.length > 5) {
                this.context.font = '20px Bungee';
                this.context.fillStyle = '#4F4F4F';
                this.context.textAlign = 'left';
                const plusX = startX + 5 * (pokemonSize + padding);
                this.context.fillText(
                    `+${this.collectedPokemons.length - 5}`,
                    plusX,
                    startY + pokemonSize/2
                );
            }
        } else {
            // 빈 컬렉션 텍스트
            this.context.fillStyle = '#aaa';
            this.context.font = '18px Bungee';
            this.context.textAlign = 'center';
            this.context.fillText('포획한 포켓몬이 없습니다', boxX + boxWidth / 2, boxY + boxHeight / 2);
        }
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
                    width: ${this.canvasWidth}px;
                    height: ${this.canvasHeight}px;
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
                if (!this.isGameOver) {  // 아직 게임오버되지 않았다면
                    this.endGame('win');
                    return;
                }
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
            if (this.isGameOver) {
                this.stopGameLoop();
                return;
            }

            this.drawDesign();
            this.moveBall();
            this.checkCollisions();
            
            if (!this.isGameOver) {
                this.animationFrameId = requestAnimationFrame(loop);
            }
        };
        this.animationFrameId = requestAnimationFrame(loop);
    }
    
    stopGameLoop() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
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

    // 볼 레벨 업데이트
    updateBallLevel() {
        const newLevel = Math.floor(this.score / 10) + 1;
        if (newLevel !== this.ball.level && newLevel <= 3) {
            this.ball.level = newLevel;
            this.ball.power = newLevel === 3 ? 4 : newLevel; // 레벨 3일 때는 파워 4
        }
    }
} 