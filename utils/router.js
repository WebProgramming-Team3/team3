class Router {
    constructor() {
        this.routes = {};
        this.currentPage = null;
        this.pageContainer = null;
        this.PAGE_TRANSITION_DURATION = 200;
    }

    /**
     * 라우터 초기화
     */
    init() {
        this.pageContainer = document.getElementById('page-content');
        
        // 기본 라우트 설정
        this.addRoute('intro', IntroPage);
        this.addRoute('home', HomePage);
        this.addRoute('game', GamePage);
        this.addRoute('settings', SettingsPage);
        this.addRoute('howtoplay', HowToPlayPage);
        this.addRoute('ranking', RankingPage);

        // 브라우저 뒤로가기/앞으로가기 처리
        window.addEventListener('popstate', (event) => {
            const page = event.state?.page || 'intro';
            this.navigate(page, false);
        });

        // 기본 페이지로 이동
        this.navigate('intro');
    }

    /**
     * 라우트 추가
     * @param {string} path - 라우트 경로
     * @param {class} pageClass - 페이지 클래스
     */
    addRoute(path, pageClass) {
        this.routes[path] = pageClass;
    }

    /**
     * 페이지 이동
     * @param {string} page - 이동할 페이지
     * @param {boolean} addToHistory - 브라우저 히스토리에 추가할지 여부
     */
    navigate(page, addToHistory = true) {
        if (!this.routes[page]) {
            console.error(`페이지를 찾을 수 없습니다: ${page}`);
            return;
        }

        // 현재 페이지 정리
        if (this.currentPage && typeof this.currentPage.unmount === 'function') {
            this.currentPage.unmount();
        }

        // 새 페이지 생성
        const PageClass = this.routes[page];
        this.currentPage = new PageClass();
        
        // 페이지 렌더링 
        this.renderPage();
        
        if (addToHistory) {
            history.pushState({ page }, '', `#${page}`);
        }

        // 현재 페이지 정보 업데이트
        document.body.setAttribute('data-page', page);
    }

    /**
     * 페이지 렌더링
     */
    renderPage() {  
        this.animatePageTransition(() => {
            this.pageContainer.innerHTML = this.currentPage.render();
            
            // 페이지별 초기화 호출 (mount로 통일)
            if (typeof this.currentPage.mount === 'function') {
                this.currentPage.mount(this.pageContainer);
            }
        });
    }

    /**
     * 페이지 전환 애니메이션
     * @param {function} callback
     */
    animatePageTransition(callback) {
        this.pageContainer.style.opacity = '0';
        this.pageContainer.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            callback();
            
            this.pageContainer.style.opacity = '1';
            this.pageContainer.style.transform = 'translateY(0)';
        }, this.PAGE_TRANSITION_DURATION);
    }

} 