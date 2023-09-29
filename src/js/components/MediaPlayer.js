import '../../css/mediaplayer.css';

/**
 * Класс для взаимодействия с медиа (аудио, видео)  
 *
 * @param parentEl - контейнер с сообщениями
 * @param type - принимает строку ("video" || "audio")
 */

export default class MediaPlayer {
    constructor(parentEl, type) {
        if (!(type === "video" || type === "audio")) {
            throw new Error("type must be 'video' or 'audio'")
        }
        this.parentEl = parentEl;
        this.type = type;

        this.onSubmitVideoCallbacks = [];
        this.onSubmitAudioCallbacks = [];
    }
    static getVideoPlayerMarkup() {
        return `
            <div class="video-player-container stream">
                <video class="video-player" autoplay muted width="320"></video>
                <div class="video-buttons">
                    <button type="button" class="stop-video-btn disabled">Остановить запись</button>
                    <div class="timer-container disabled">
                        <span class="minutes">0</span>
                        <span>:</span>
                        <span class="seconds">0</span>
                    </div>
                    <button type="button" class="start-video-btn">Начать запись</button>
                </div>
                <span class="media-error disabled"></span>
            </div>
        `
    }
    static getAudioPlayerMarkup() {
        return `
            <div class="audio-player-container stream">
                <audio class="audio-player"></audio>
                <div class="audio-buttons">
                    <button type="button" class="stop-audio-btn disabled">Остановить запись</button>
                    <div class="timer-container disabled">
                        <span class="minutes">0</span>
                        <span>:</span>
                        <span class="seconds">0</span>
                    </div>
                    <button type="button" class="start-audio-btn">Начать запись</button>
                </div>
                <span class="media-error disabled"></span>
            </div>
        `
    }
    
    init() {
        if (this.type === 'video') {
            this.parentEl.insertAdjacentHTML('beforeend', MediaPlayer.getVideoPlayerMarkup());
            this.videoPlayerContainer = this.parentEl.querySelector('.video-player-container');
            this.videoPlayerEl = this.parentEl.querySelector('.video-player');
            this.stopVideoBtn = this.parentEl.querySelector('.stop-video-btn');
            this.startVideoBtn = this.parentEl.querySelector('.start-video-btn');
        }
        if (this.type === 'audio') {
            this.parentEl.insertAdjacentHTML('beforeend', MediaPlayer.getAudioPlayerMarkup());
            this.audioPlayerContainer = this.parentEl.querySelector('.audio-player-container');
            this.audioPlayerEl = this.parentEl.querySelector('.audio-player');
            this.stopAudioBtn = this.parentEl.querySelector('.stop-audio-btn');
            this.startAudioBtn = this.parentEl.querySelector('.start-audio-btn');
        }

        this.timerContainerEl = this.parentEl.querySelector('.timer-container');
        this.errorEl = this.parentEl.querySelector('.media-error');

        this.addListeners();
    }

    addListeners() {
        if (this.type === 'audio') {
            this.stopAudioBtn.addEventListener('click', () => this.onStopRecording());
            this.startAudioBtn.addEventListener('click', () => this.onStartMedia());
        }
        if (this.type === 'video') {
            this.stopVideoBtn.addEventListener('click', () => this.onStopRecording());
            this.startVideoBtn.addEventListener('click', () => this.onStartMedia());
        }
    }

    addOnSubmitVideoFunc(callback) {
        this.onSubmitVideoCallbacks.push(callback);
    }
    addOnSubmitAudioFunc(callback) {
        this.onSubmitAudioCallbacks.push(callback);
    }

    getUserMedia = async() => {
        try {
            if (this.type === 'video') {
                this.stream = await navigator.mediaDevices.getUserMedia({
                  video: true,
                  audio: true,
                })
            } else {
                this.stream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                  })
            }

            if (!this.errorEl.classList.contains('disabled')) {
                hideError(); // скрываем ошибку
            }
            
        } catch (error) {
            console.error(error);
            this.revealForm();
            this.activeStartMediaBtn();

            this.onError(this.type);
            return;
        }
    }

    onStartMedia = async() => {
        this.removeStartMediaBtn();
        this.hideForm();
        this.chunks = [];

        await this.getUserMedia();

        this.type === 'video'
        ? this.videoPlayerEl.srcObject = this.stream
        : this.audioPlayerEl.srcObject = this.stream

        this.startTimer();
        this.onStartRecorder();
    }

    onStartRecorder() {
        this.recorder = new MediaRecorder(this.stream);
        this.recorder.addEventListener('dataavailable', (e) => {
            this.chunks.push(e.data);
        });
        this.recorder.addEventListener('stop', () => {
            const blob = new Blob(this.chunks);

            this.type === 'video'
            ? this.onSubmitVideoCallbacks.forEach(callback => callback.call(null, URL.createObjectURL(blob)))
            : this.onSubmitAudioCallbacks.forEach(callback => callback.call(null, URL.createObjectURL(blob)));

        });

        this.recorder.start(); 
    }

    onStopRecording = () => {
        this.recorder.stop();
        this.stream.getTracks().forEach((track) => track.stop());
        clearInterval(this.intervalId);

        this.activeStartMediaBtn();

        this.type === 'video' 
        ? this.videoPlayerContainer.remove()
        : this.audioPlayerContainer.remove(); 

        this.revealForm();
    }

    removeStartMediaBtn() {
        if(this.type === 'video') {
            this.stopVideoBtn.classList.remove('disabled');
            this.startVideoBtn.classList.add('disabled');
            return;
        }

        this.stopAudioBtn.classList.remove('disabled');
        this.startAudioBtn.classList.add('disabled');
    }

    activeStartMediaBtn() {
        if (this.type === 'video') {
            this.stopVideoBtn.classList.add('disabled');
            this.startVideoBtn.classList.remove('disabled');
            return;
        }
        this.stopAudioBtn.classList.add('disabled');
        this.startAudioBtn.classList.remove('disabled');
    }

    hideForm() {
        this.form = document.querySelector('.messages-form');
        this.form.classList.add('disabled')
    }

    revealForm() {
        this.form.classList.remove('disabled');
    }

    onError(type) {
        this.errorEl.classList.remove('disabled');
        type === 'video'
        ? this.errorEl.textContent = 'Пожалуйста, предоставьте доступ для записи видео!'
        : this.errorEl.textContent = 'Пожалуйста, предоставьте доступ для записи аудио!'
    }

    hideError() {
        this.errorEl.classList.add('disabled');
    }

    startTimer() {
        this.timerContainerEl.classList.remove('disabled');

        let minutes = this.parentEl.querySelector(".minutes");
        let seconds = this.parentEl.querySelector(".seconds");
        let s = Number(seconds.textContent);
        let m = Number(minutes.textContent);
        
        seconds.textContent = `0${s}`;
        minutes.textContent = `0${s}`;
        
        this.intervalId = setInterval(() => {
          if (s < 10) {
            seconds.textContent = `0${s}`;
          } else if( (s > 9) && (s <= 59) ){
            seconds.textContent = `${s}`;
          }
          if (s > 59) {
            s = 0;
            seconds.textContent = `0${s}`;
            m++;
          } 
          if (m < 9) {
            minutes.textContent = `0${s}`;
          } else {
            minutes.textContent = `${s}`;
          }
          
          s++;
          minutes.textContent = `0${m}`;
        }, 1000)
    }
}