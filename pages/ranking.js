class RankingPage {
    constructor() {
        this.container = null;
        this.styleElement = null;
        
        // localStorage에서 랭킹 데이터 가져오기
        const storedRankings = JSON.parse(localStorage.getItem('rankings') || '[]');
        
        // 점수 기준으로 정렬하고 상위 10개만 선택
        this.rankingData = storedRankings
            .sort((a, b) => b.score - a.score)
            .slice(0, 10)
            .map((entry, index) => ({
                rank: index + 1,
                score: entry.score,
                pokemons: entry.pokemons,
                date: new Date(entry.date).toLocaleDateString()
            }));
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
                                    <th>SCORE</th>
                                    <th>POKEMONS</th>
                                    <th>DATE</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${this.rankingData.map(entry => `
                                    <tr>
                                        <td>${entry.rank}</td>
                                        <td class="score">${entry.score}</td>
                                        <td>${entry.pokemons}</td>
                                        <td>${entry.date}</td>
                                    </tr>
                                `).join('')}
                                ${this.rankingData.length === 0 ? `
                                    <tr>
                                        <td colspan="4" class="no-data">기록이 없습니다</td>
                                    </tr>
                                ` : ''}
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
                @import url('https://fonts.googleapis.com/css2?family=Bungee&family=Do+Hyeon&display=swap');

                .ranking-page {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background-color: #ffffff;
                    font-family: 'Bungee', cursive;
                    overflow: hidden;
                }
                
                .ranking-container {
                    position: relative;
                    width: 1440px;
                    height: 1024px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    background-image: url('assets/background/background_setting.png');
                    background-size: cover;
                    background-position: center;
                    overflow: hidden;
                }

                .ranking-title-container {
                    margin-top: 60px;
                    margin-bottom: 80px;
                    width: 600px;
                    height: 154px;
                }

                .ranking-title-text {
                    font-size: 128px;
                    font-weight: 400;
                    color: #737373;
                    text-align: center;
                    text-shadow: 2px 2px 4px rgba(115, 115, 115, 0.5);
                    margin: 0;
                }

                .ranking-table-container {
                    width: 1321px;
                    height: 742px;
                    background-color: rgba(255, 255, 255, 0.9);
                    border-radius: 20px;
                    padding: 0 20px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: column;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                }

                th, td {
                    padding: 20px 0;
                    height: 78px;
                    box-sizing: border-box;
                    text-align: center;
                    font-size: 48px;
                    color: #000000;
                    border-bottom: 1px solid #e0e0e0;
                }

                th {
                    font-size: 48px;
                    color: #000000;
                    font-weight: bold;
                }

                td.score {
                    color: #F54E4F;
                    font-weight: bold;
                }

                td.no-data {
                    text-align: center;
                    color: #999;
                    font-size: 36px;
                    padding: 40px 0;
                }

                tbody tr:last-child td {
                    border-bottom: none;
                }

                tbody tr:hover {
                    background-color: rgba(255, 255, 255, 0.5);
                }

                .ranking-back-button {
                    position: absolute;
                    bottom: 50px;
                    left: 50%;
                    transform: translateX(-50%);
                    padding: 10px 20px;
                    font-size: 24px;
                    font-family: 'Do Hyeon', sans-serif;
                    background-color: #60cd52;
                    color: #ffffff;
                    border: none;
                    border-radius: 10px;
                    cursor: pointer;
                    height: 60px;
                    transition: background-color 0.2s ease;
                }

                .ranking-back-button:hover {
                    background-color: #4aa040;
                }

                /* 반응형 스케일링 */
                @media (max-width: 1440px) {
                    .ranking-container { transform: scale(calc(100vw / 1440)); transform-origin: top left; }
                }
                @media (max-height: 1024px) {
                    .ranking-container { transform: scale(calc(100vh / 1024)); transform-origin: top left; }
                }
                @media (max-width: 768px) {
                    .ranking-container { 
                        transform: scale(0.5);
                        transform-origin: top left;
                    }
                    .ranking-title-text { font-size: min(15vw, 80px); }
                    .ranking-table-container { 
                        width: 90%;
                        height: 60%;
                        padding: 20px;
                    }
                    th, td { 
                        font-size: min(6vw, 30px);
                        padding: 10px;
                        height: 50px;
                    }
                    .ranking-back-button {
                        font-size: min(4vw, 18px);
                        height: 45px;
                        bottom: 30px;
                    }
                }
        `;
    }

    mount(container) {
        this.container = container;
        this.container.innerHTML = this.render();
        
        this.styleElement = document.createElement('div');
        this.styleElement.innerHTML = `<style>${this.getStyles()}</style>`;
        document.head.appendChild(this.styleElement);
        
        this.setupEventListeners();
    }

    unmount() {
        if (this.styleElement && this.styleElement.parentNode) {
            this.styleElement.parentNode.removeChild(this.styleElement);
            this.styleElement = null;
        }
    }

    setupEventListeners() {
        const backButton = document.getElementById('back-to-home-button');
        if (backButton) {
            backButton.addEventListener('click', () => {
                this.navigateToHome();
            });
        }
    }

    navigateToHome() {
        if (window.router) {
            window.router.navigate('home');
        }
    }
}
