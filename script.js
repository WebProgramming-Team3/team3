
class PokemonBrickApp {
    constructor() {
    }

    /* 앱 초기화 */
    async init() {        
        try {           
            // 모든 필요한 컴포넌트들이 로드될 때까지 대기
            await this.waitForDOMContentLoaded();
            
            this.initializeRouter();
            
        } catch (error) {
            console.error('초기화 실패:', error);
        }
    }

    /* DOM 로드 대기 */
    waitForDOMContentLoaded() {
        return new Promise((resolve) => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }

    /* 라우터 초기화 */
    initializeRouter() {
        try {            
            if (!window.router) {
                window.router = new Router();
            }
            window.router.init();
            
        } catch (error) {
            console.error('라우터 초기화 실패:', error.message);
            throw new Error(`라우터 초기화 실패: ${error.message}`);
        }
    }
}

/**
 * 앱 시작점
 * DOM이 로드되면 앱을 초기화
 */
document.addEventListener('DOMContentLoaded', async () => {
    // 전역 앱 인스턴스 생성
    window.pokemonBrickApp = new PokemonBrickApp();
    
    // 앱 초기화
    await window.pokemonBrickApp.init();
});
