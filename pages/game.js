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
        this.currentStage = 1; // 현재 스테이지
        this.brickImageCounts = { 1: 2, 2: 5, 3: 5 }; // 스테이지별 벽돌 이미지 개수
        this.paddle = {
            width: 120,
            height: 120,
            x: (this.canvasWidth - 120) / 2, // 가로 중앙 정렬
            y: this.canvasHeight - this.footerHeight - 120 // 하단 footer 위
        };

        // 난이도별 공 속도 설정
        this.ballSpeeds = {
            'easy': 1,
            'normal': 2,
            'hard': 4
        };
        
        // 현재 난이도 가져오기
        this.difficulty = typeof SettingsPage !== 'undefined' ? 
        SettingsPage.getDifficulty() : 'normal';
        
        // 새 게임 시작 시 초기화
        if (this.currentStage === 1) {
            localStorage.removeItem('gameScore');
            localStorage.removeItem('collectedPokemons');
            localStorage.removeItem('ballLevel');
            localStorage.removeItem('ballPower');
        }
        
        const ballSpeed = this.ballSpeeds[this.difficulty];
        this.ball = {
            x: this.paddle.x + this.paddle.width / 2,
            y: this.paddle.y - 25,
            dx: ballSpeed,
            dy: -ballSpeed,
            radius: 25,
            level: this.currentStage === 1 ? 1 : (parseInt(localStorage.getItem('ballLevel')) || 1),
            power: this.currentStage === 1 ? 1 : (parseInt(localStorage.getItem('ballPower')) || 1)
        };

        this.score = this.currentStage === 1 ? 0 : (parseInt(localStorage.getItem('gameScore')) || 0);
        this.images = {};
        this.imagesLoaded = false;
        this.brickGroups = [];
        this.timeLeft = 60;
        this.lastTime = null;
        this.isGameOver = false;
        this.isGameOverHandled = false;
        this.gameResult = null;
        this.pokemons = [];
        this.collectedPokemons = this.currentStage === 1 ? [] : (JSON.parse(localStorage.getItem('collectedPokemons')) || []);
        
        // 스크롤 관련 속성
        this.scrollX = 0;
        this.scrollSpeed = 0.3;
        this.totalGroups = 15;
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
            
            // 엔딩 버튼 이미지 추가
            'go_home': './assets/utils/go_home.png',
            'go_mini_game': './assets/utils/go_mini_game.png',
            'add_ranking': './assets/utils/add_ranking.png',
            'button_next': './assets/utils/button_next.png', // 다음 스테이지 버튼 추가
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
        this.scrollX = 0;
        
        for (let groupIndex = 1; groupIndex <= this.totalGroups; groupIndex++) {
            const maxBrickIndexForStage = this.brickImageCounts[this.currentStage] || 1;
            const chosenRandomBrickIndex = Math.floor(Math.random() * maxBrickIndexForStage) + 1;
            
            const brickGroup = {
                groupIndex: groupIndex,
                brickImageKey: `brick_lev${this.currentStage}_${chosenRandomBrickIndex}`,
                pokemonImageKey: `poke_lev${this.currentStage}_${((groupIndex - 1) % 3) + 1}`,
                brickGroups: []
            };

            const stageHealth = this.currentStage === 3 ? 4 : this.currentStage;
            for (let i = 0; i < 9; i++) {
                brickGroup.brickGroups.push({
                    isPokemon: i === 4,
                    health: stageHealth,
                    maxHealth: stageHealth,
                    opacity: 1,
                    caught: false
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
        const spacing = 50; // 그룹 간 간격 축소
        
        this.brickGroups.forEach((group, index) => {
            const baseX = index * (groupWidth + spacing) - this.scrollX; // 스크롤도 계산해야함
            
            // 화면 밖의 그룹은 렌더링 X
            if (baseX < -groupWidth || baseX > this.canvasWidth) return;
            
            this.drawBrickGroup(group, { x: baseX, y: startY });
        });

        // 스크롤 갱신
        if (!this.isGameOver) {
            this.scrollX += this.scrollSpeed;
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

            // 벽돌 좌표 정보 업데이트
            brick.x = x;
            brick.y = y;
            brick.width = cellSize;
            brick.height = cellSize;

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
            const ballSpeed = this.ballSpeeds[this.difficulty];
            this.ball.dx = hitPoint * (ballSpeed * 2.5); // 난이도별 속도에 비례하여 조정
        }

        // 헤더 충돌 체크
        if (this.ball.y - this.ball.radius <= this.headerHeight &&
            this.ball.dy < 0) {
            this.ball.dy = Math.abs(this.ball.dy);
        }

        // 벽돌 및 포켓몬 충돌 체크
        let collisionFound = false;
        
        for (const group of this.brickGroups) {
            if (collisionFound) break;

            const baseX = group.groupIndex * (365 + 50) - this.scrollX;
            
            if (baseX < -500 || baseX > this.canvasWidth + 500) continue;

            for (const brick of group.brickGroups) {
                if (brick.opacity <= 0 || (brick.isPokemon && brick.caught)) continue;

                if (this.isCircleRectColliding(this.ball, brick)) {
                    collisionFound = true;

                    // 충돌 방향 계산 및 반사 처리 (기존 코드 유지)
                    const ballCenterX = this.ball.x;
                    const ballCenterY = this.ball.y;
                    const brickCenterX = brick.x + brick.width / 2;
                    const brickCenterY = brick.y + brick.height / 2;

                    const angle = Math.atan2(ballCenterY - brickCenterY, ballCenterX - brickCenterX);
                    const PI = Math.PI;

                    if (angle > -PI/4 && angle < PI/4) {
                        this.ball.dx = Math.abs(this.ball.dx);
                    } else if (angle > PI/4 && angle < 3*PI/4) {
                        this.ball.dy = Math.abs(this.ball.dy);
                    } else if (angle > -3*PI/4 && angle < -PI/4) {
                        this.ball.dy = -Math.abs(this.ball.dy);
                    } else {
                        this.ball.dx = -Math.abs(this.ball.dx);
                    }

                    if (brick.isPokemon) {
                        // 포켓몬 포획 처리 - 5점 추가
                        brick.caught = true;
                        this.score += 5; // 포켓몬 포획 점수
                        this.updateBallLevel();
                        
                        // 포획한 포켓몬 저장
                        this.collectedPokemons.push({
                            imageKey: group.pokemonImageKey,
                            stage: this.currentStage,
                            groupIndex: group.groupIndex
                        });
                        
                        // localStorage에 저장
                        localStorage.setItem('collectedPokemons', JSON.stringify(this.collectedPokemons));
                    } else {
                        // 일반 벽돌 데미지 처리
                        brick.health -= this.ball.power;
                        brick.opacity = Math.max(0, brick.health / brick.maxHealth);
                        
                        // 벽돌이 완전히 깨졌을 때 1점 추가
                        if (brick.health <= 0) {
                            this.score += 1;
                        }
                    }
                    
                    // 점수 저장
                    localStorage.setItem('gameScore', this.score.toString());
                    break;
                }
            }
        }
    }

    isCircleRectColliding(circle, rect) {
        // 원의 중심과 사각형의 가장 가까운 점 찾기
        const closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
        const closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));
    
        // 원의 중심과 가장 가까운 점 사이의 거리 계산
        const distanceX = circle.x - closestX;
        const distanceY = circle.y - closestY;
        const distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);
    
        // 거리가 원의 반지름보다 작거나 같으면 충돌
        return distanceSquared <= (circle.radius * circle.radius);
    }

    endGame(status) {
        this.isGameOver = true;
        this.isGameOverHandled = true;
        this.stopGameLoop();
        this.stopTimer();
        this.gameResult = status;

        // 게임 패배 시 모든 상태 초기화
        if (status === 'lose') {
            this.score = 0;
            this.collectedPokemons = [];
            this.ball.level = 1;
            this.ball.power = 1;
            localStorage.removeItem('gameScore');
            localStorage.removeItem('collectedPokemons');
            localStorage.removeItem('ballLevel');
            localStorage.removeItem('ballPower');
        }
    
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

            // win 상태이고 현재 스테이지가 3 미만일 때 next 버튼 추가
            if (status === 'win' && this.currentStage < 3) {
                const nextButtonImage = this.images['button_next'];
                if (nextButtonImage) {
                    // 원본 비율 유지 (252:118)하면서 높이를 100px로 설정
                    const buttonHeight = 100;
                    const buttonWidth = Math.floor((252 * buttonHeight) / 118); // 약 213px
                    const buttonX = imgX + imgWidth + 20; // win 이미지 우측에 배치
                    const buttonY = imgY + (imgHeight - buttonHeight) / 2; // win 이미지와 수직 중앙 정렬
                    
                    // next 버튼 영역 정보 저장
                    this.nextButton = {
                        x: buttonX,
                        y: buttonY,
                        width: buttonWidth,
                        height: buttonHeight,
                        action: 'next_stage'
                    };
                    
                    // next 버튼 그리기
                    this.context.drawImage(nextButtonImage, buttonX, buttonY, buttonWidth, buttonHeight);
                }
            }
        }
    
        // 점수 텍스트
        this.context.font = '24px Bungee, cursive';
        this.context.fillStyle = 'white';
        this.context.textAlign = 'center';
        this.context.fillText(`최종 점수: ${this.score}`, this.canvas.width/2, this.canvas.height/2 + 100);
        this.context.fillText(`포획한 포켓몬: ${this.collectedPokemons.length}마리`, this.canvas.width/2, this.canvas.height/2 + 140);

        // 버튼 이미지 설정
        const buttonImages = status === 'win' ? 
            ['go_home', 'go_mini_game', 'add_ranking'] : 
            ['go_home', 'add_ranking'];
        
        // 버튼 이미지 원본 크기 (4:1 비율)
        const buttonWidth = 400;
        const buttonHeight = 100;
        const buttonSpacing = 40;
        const totalWidth = buttonImages.length * buttonWidth + (buttonImages.length - 1) * buttonSpacing;
        let startX = (this.canvas.width - totalWidth) / 2;
        const buttonY = this.canvas.height/2 + 200;

        // 버튼 영역 정보 저장
        this.endGameButtons = buttonImages.map((key, index) => {
            const buttonX = startX + (buttonWidth + buttonSpacing) * index;
            return {
                x: buttonX,
                y: buttonY,
                width: buttonWidth,
                height: buttonHeight,
                action: key
            };
        });

        // 버튼 이미지 그리기
        this.endGameButtons.forEach(button => {
            const buttonImage = this.images[button.action];
            if (buttonImage) {
                this.context.drawImage(buttonImage, button.x, button.y, button.width, button.height);
            }
        });

        // 클릭 이벤트 리스너 추가
        const handleClick = (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;

            // next 버튼 클릭 체크
            if (this.nextButton && 
                clickX >= this.nextButton.x && clickX <= this.nextButton.x + this.nextButton.width &&
                clickY >= this.nextButton.y && clickY <= this.nextButton.y + this.nextButton.height) {
                
                // 현재 상태 저장
                localStorage.setItem('gameScore', this.score.toString());
                localStorage.setItem('collectedPokemons', JSON.stringify(this.collectedPokemons));
                localStorage.setItem('ballLevel', this.ball.level.toString());
                localStorage.setItem('ballPower', this.ball.power.toString());
                
                // 다음 스테이지로 이동
                this.currentStage++;
                this.resetGame();
                return;
            }

            // 기존 버튼들 클릭 체크
            for (const button of this.endGameButtons) {
                if (clickX >= button.x && clickX <= button.x + button.width &&
                    clickY >= button.y && clickY <= button.y + button.height) {
                    
                    // 클릭 이벤트 리스너 제거
                    this.canvas.removeEventListener('click', handleClick);

                    switch (button.action) {
                        case 'go_home':
                            if (window.router) {
                                window.router.navigate('home');
                            }
                            break;
                        case 'add_ranking':
                            // 랭킹에 점수 추가
                            const rankings = JSON.parse(localStorage.getItem('rankings') || '[]');
                            rankings.push({
                                score: this.score,
                                pokemons: this.collectedPokemons.length,
                                date: new Date().toISOString()
                            });
                            localStorage.setItem('rankings', JSON.stringify(rankings));
                            if (window.router) {
                                window.router.navigate('home');
                            }
                            break;
                        case 'go_mini_game':
                            // 미니게임 기능은 아직 구현하지 않음
                            break;
                    }
                    break;
                }
            }
        };

        this.canvas.addEventListener('click', handleClick);
    }

    resetGame() {
        // 스테이지 변경 시에도 점수와 포켓몬 컬렉션, 볼 레벨 유지
        this.timeLeft = 60;
        this.isGameOver = false;
        this.isGameOverHandled = false;
        this.gameResult = null;
        this.nextButton = null; // next 버튼 정보 초기화
    
        this.paddle.x = (this.canvasWidth - this.paddle.width) / 2;
        this.paddle.y = this.canvasHeight - this.footerHeight - this.paddle.height;
    
        const ballSpeed = this.ballSpeeds[this.difficulty];
        this.ball.x = this.paddle.x + this.paddle.width / 2;
        this.ball.y = this.paddle.y - this.ball.radius;
        this.ball.dx = ballSpeed;
        this.ball.dy = -ballSpeed;
    
        // 스크롤 위치 초기화
        this.scrollX = 0;
    
        // 벽돌 그룹 초기화
        this.initializeBrickGroups();
    
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
            this.ball.power = newLevel === 3 ? 4 : newLevel;
            // 볼 레벨과 파워 저장
            localStorage.setItem('ballLevel', this.ball.level.toString());
            localStorage.setItem('ballPower', this.ball.power.toString());
        }
    }
} 