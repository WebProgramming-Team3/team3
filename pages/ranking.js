class RankingPage {
    constructor() {
        this.container = null;
        this.styleElement = null;
        // 임시 랭킹 데이터
        this.rankingData = [
            { rank: 1, userName: 'USER1', score: 100 },
            { rank: 2, userName: 'USER2', score: 90 },
            { rank: 3, userName: 'USER3', score: 80 },
            { rank: 4, userName: 'USER4', score: 70 },
            { rank: 5, userName: 'USER5', score: 60 },
            { rank: 5, userName: 'USER5', score: 60 }, 
        ];
    }

    render() {
        return `
            <div class="ranking-page">
                <div class="ranking-container">
                    <div class="ranking-title-container">
                        <h1 class="ranking-title-text">RANKING</h1>
                    </div>
                    <div class="ranking-table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>RANK</th>
                                    <th>USER NAME</th>
                                    <th>SCORE</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${this.rankingData.map(entry => `
                                    <tr>
                                        <td>${entry.rank}</td>
                                        <td>${entry.userName}</td>
                                        <td>${entry.score}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                    <button id="back-to-home-button" class="ranking-back-button">Back to Home</button>
                </div>
            </div>
        `;
    }

    getStyles() {
        return `
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Bungee&display=swap');

                .ranking-page {
                    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                    display: flex; justify-content: center; align-items: center;
                    background-color: #ffffff;
                    font-family: 'Bungee', cursive;
                    overflow: hidden; /* 추가 스크롤 방지 */
                }
                
                .ranking-container {
                    position: relative; 
                    width: 1440px; height: 1024px; /* settings.js와 동일한 Figma 기준 전체 프레임 */
                    display: flex; flex-direction: column; align-items: center;
                    background-image: url('assets/background/background_setting.png');
                    background-size: cover; background-position: center;
                    overflow: hidden; /* 스케일링 시 내용 잘림 방지 */
                }

                .ranking-title-container {
                    margin-top: 20px; /* 상단 여백 */
                    margin-bottom: 30px;
                    width: 600px;
                    height: 154px;
                }

                .ranking-title-text {
                    font-size: 128px; 
                    font-weight: 400;
                    color: #737373; /* 타이틀 색상 */
                    text-align: center;
                    text-shadow: 2px 2px 4px #737373;
                    margin: 0;
                }

                .ranking-table-container {
                    width: 1321px; /* 원래 테이블 컨테이너 너비 유지 */
                    height: 742px; /* 원래 테이블 컨테이너 높이 유지 */
                    background-color: rgba(255, 255, 255, 0.9); /* 반투명 흰색 배경 */
                    border-radius: 20px;
                    padding: 0px 20px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                    box-sizing: border-box;
                    display: flex; flex-direction: column;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                }

                th, td {
                    padding: 20px 0px 15px 0px ;
                    height: 78px;
                    box-sizing: border-box;
                    text-align: left;
                    font-size: 48px;
                    color: #000000;
                    border-bottom: 1px solid #e0e0e0;
                }

                th {
                    font-size: 48px;
                    color: #000000;
                    font-weight: bold;
                }
                
                th:nth-child(1), td:nth-child(1) {
                    text-align: center; /* RANK 중앙 정렬 */
                }
                th:nth-child(2), td:nth-child(2) {
                    text-align: center; /* USER NAME 중앙 정렬 */
                }
                th:nth-child(3), td:nth-child(3) {
                    text-align: center; /* SCORE 중앙 정렬 */
                    color: #F54E4F; /* SCORE 텍스트 색상 */
                    font-weight: bold;
                }

                tbody tr:last-child td {
                    border-bottom: none; /* 마지막 행 하단 선 제거 */
                }

                tbody tr:hover {
                    background-color: #f9f9f9; /* 행 호버 효과 */
                }

                .ranking-back-button {
                    position: absolute; /* ranking-container 기준 */
                    bottom: 10px; left: 48%; transform: translateX(-50%);
                    padding: 10px 20px; font-size: 24px;
                    font-family: 'Do Hyeon', sans-serif;
                    background-color: #60cd52; color: #ffffff;
                    border: none; border-radius: 10px; cursor: pointer;
                    height: 60px;
                    transition: background-color 0.2s ease;
                }
                .ranking-back-button:hover {
                    background-color: #4aa040;
                }

                /* 반응형 스케일링 (settings.js와 동일) */
                @media (max-width: 1440px) {
                    .ranking-container { transform: scale(calc(100vw / 1440)); transform-origin: top left; }
                }
                @media (max-height: 1024px) {
                    .ranking-container { transform: scale(calc(100vh / 1024)); transform-origin: top left; }
                }
                @media (max-width: 768px) {
                    .ranking-container { 
                        transform: scale(min(calc(100vw / 1440), calc(100vh / 1024), 0.5)); 
                        transform-origin: center center; 
                    }
                    .ranking-title-text { font-size: min(15vw, 60px); }
                    .ranking-table-container { 
                        width: 90%; 
                        height: 60%;
                        padding: 20px;
                    }
                    th, td { 
                        font-size: min(4vw, 18px); 
                        padding: 10px;
                        height: 50px;
                    }
                    th { font-size: min(5vw, 20px); }
                    .ranking-back-button {
                        font-size: min(4vw, 18px); 
                        height: 45px; 
                        bottom: 30px;
                    }
                }
            </style>
        `;
    }

    mount() {
        this.container = document.querySelector('.ranking-page');
        
        this.styleElement = document.createElement('div');
        this.styleElement.innerHTML = this.getStyles();
        document.head.appendChild(this.styleElement);
        
        this.setupEventListeners();
    }

    unmount() {
        if (this.styleElement && this.styleElement.parentNode) {
            this.styleElement.parentNode.removeChild(this.styleElement);
        }
    }

    setupEventListeners() {
        const backToHomeButton = document.getElementById('back-to-home-button');
        if (backToHomeButton) {
            backToHomeButton.addEventListener('click', () => {
                this.navigateToHome();
            });
        }
    }

    /**
     * 홈으로 이동 (settings.js와 동일)
     */
    navigateToHome() {
        if (window.router) {
            window.router.navigate('home');
        }
    }
}
