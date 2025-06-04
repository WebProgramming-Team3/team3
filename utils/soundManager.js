/**
 * 전역 배경음악 관리 클래스
 * 모든 페이지에서 하나의 배경음악이 지속적으로 재생
 */
class SoundManager {
    constructor() {
        this.backgroundMusic = null;
        this.isEnabled = true; // 기본값: 활성화
        this.volume = 0.3; // 고정 볼륨
        
        this.initBackgroundMusic();
    }

    /**
     * 배경음악 초기화
     */
    initBackgroundMusic() {
        this.backgroundMusic = new Audio('./assets/sound/pokemon_background_sound.mp3');
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = this.volume;
        this.backgroundMusic.preload = 'auto';
        
        // 자동 재생을 위한 사용자 상호작용 감지
        document.addEventListener('click', () => this.startMusic(), { once: true });
        document.addEventListener('keydown', () => this.startMusic(), { once: true });
    }

    /**
     * 배경음악 시작
     */
    startMusic() {
        if (this.isEnabled && this.backgroundMusic && this.backgroundMusic.paused) {
            this.backgroundMusic.play().catch(error => {
                console.warn('배경음악 재생 실패:', error);
            });
        }
    }

    /**
     * 사운드 활성화/비활성화
     */
    setEnabled(enabled) {
        this.isEnabled = enabled;
        
        if (this.backgroundMusic) {
            if (enabled) {
                this.backgroundMusic.play().catch(console.warn);
            } else {
                this.backgroundMusic.pause();
            }
        }
    }
}

// 전역 사운드 매니저 인스턴스 생성
const soundManager = new SoundManager();
window.soundManager = soundManager;

// 설정 페이지와의 연동을 위한 전역 함수
window.getGameSoundsEnabled = function() {
    return soundManager.isEnabled;
}; 