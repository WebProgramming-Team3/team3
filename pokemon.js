//공 움직임 여부
var isMoving = false;

document.addEventListener('gameStart', () => {  
    

    //타이머 화면에 로드될때까지 기다림
    const waitForTimer = setInterval(() => {
    const timerElement = document.querySelector(".timer-value");
    if (timerElement) {
      clearInterval(waitForTimer);
      //화면 클릭해야 공 움직임 시작
      $(window).on("click", function(){
      isMoving = true;
      if(timer === null) timer = setInterval(calculate, 36); //주기 줄여서 공 움직임 자연스럽게
      });
    //시계
      const timerElement = document.querySelector(".timer-value");
      let timeLeft = parseInt(timerElement.textContent); // 초기 시간 (60)

      const timerInterval = setInterval(() => {
        timeLeft--;

        // 화면에 표시
        timerElement.textContent = timeLeft;

        // 시간이 0 이하가 되면 타이머 멈춤
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerElement.textContent = "0";
            // 여기서 게임 오버 처리 등 추가 가능
        }
      }, 1000);
    
    //마우스 움직임에 따라 패들 움직임
      document.addEventListener("mousemove", function(e) {
      const x = e.clientX; // 마우스 x 위치 (px)
      const screenWidth = window.innerWidth;

      const newX = Math.min(Math.max(x, 0), screenWidth);
      document.querySelector(".paddle").style.left = `${newX}px`;
      });
    }
  }, 100);
});


var ballx, bally;
var paddlex, paddley = 500;
var balldy = -6, balldx = 0;
var timer = null;

function calculate(){	//공 속도와 위치 업데이트
  ballx = parseInt($(".pokeball").css("left"));
  bally = parseInt($(".pokeball").css("top"));
  paddlex = parseInt($(".paddle").css("left"));
  if (isMoving) {
      bally += balldy;
      ballx += balldx;

       // 땅에 닿으면 게임 끝
      if (bally >= 750) {
        bally = 500;
        clearInterval(timer);
        timer = null;
        isMoving = false;
        balldy = -6;
        ballx = 700;
      }
      //위 벽에 닿으면 튕김
      if (bally <= -40) {
        bally = -40;
        balldy = 6;
      }
      // 패들에 닿으면 (각도 변하면서) 튀어오름
      if ((bally >= paddley) && (Math.abs(ballx - paddlex) <= 60) ){
        balldy = -6;
        balldx = -(ballx - paddlex)/4;
      }
      //왼쪽 벽에 맞으면 튀어오름
      if(ballx < 0){
        balldx *= -1;
        ballx = 0;
      }
      //오른쪽 벽에 맞으면 튀어오름
      if(ballx > 1400 - 43){
        balldx *= -1;
        ballx = 1400 - 43;
      }
      
      draw(ballx, bally); 
  }
}

function draw(ballx, bally){
  $(".pokeball").css("top", bally + "px");
  $(".pokeball").css("left", ballx + "px");
}

//충돌 검사
function isColliding(rect1, rect2) {
  return !(
    rect1.right < rect2.left ||
    rect1.left > rect2.right ||
    rect1.bottom < rect2.top ||
    rect1.top > rect2.bottom
  );
}

//공과 블럭 충돌
function checkBallBrickCollision(ball) {
  const bricks = document.querySelectorAll('.pokemon-brick');

  bricks.forEach((brick) => {
    const brickRect = brick.getBoundingClientRect();

    if (isColliding(ballRect, brickRect)) {
      console.log(`충돌! 벽돌 ID: ${brick.dataset.pokemon}`);
      brick.remove(); // 또는 brick.style.visibility = "hidden";
    }
  });
}

//이벤트 등록
$(document).on('click', '#play-game-button', () => {
  const gameStartEvent = new Event('gameStart');
  document.dispatchEvent(gameStartEvent);
});