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
                <span class="close-media">
                <svg fill="red" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
                width="30px" height="30px" viewBox="0 0 24 24" xml:space="preserve">
                        <g>
                            <g>
                                <path d="M20,0H4C1.794,0,0,1.794,0,4v16c0,2.206,1.794,4,4,4h16c2.206,0,4-1.794,4-4V4C24,1.794,22.206,0,20,0z M22,20
                                    c0,1.104-0.896,2-2,2H4c-1.103,0-2-0.896-2-2V4c0-1.103,0.897-2,2-2h16c1.104,0,2,0.897,2,2V20z"/>
                                <path d="M17.423,6.779H13.9l-0.918,1.687c-0.278,0.513-0.535,1.046-0.812,1.602h-0.042c-0.277-0.491-0.555-1.025-0.854-1.56
                                    l-1.025-1.729h-3.63l3.459,5.125L6.534,17.22H10.1l0.981-1.879c0.256-0.512,0.535-1.024,0.79-1.58h0.064
                                    c0.256,0.534,0.512,1.067,0.811,1.58l1.046,1.879h3.673l-3.48-5.466L17.423,6.779z"/>
                            </g>
                        </g>
                    </svg>
                </span>
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
                <span class="close-media">
                    <svg fill="red" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
                    width="30px" height="30px" viewBox="0 0 24 24" xml:space="preserve">
                            <g>
                                <g>
                                    <path d="M20,0H4C1.794,0,0,1.794,0,4v16c0,2.206,1.794,4,4,4h16c2.206,0,4-1.794,4-4V4C24,1.794,22.206,0,20,0z M22,20
                                        c0,1.104-0.896,2-2,2H4c-1.103,0-2-0.896-2-2V4c0-1.103,0.897-2,2-2h16c1.104,0,2,0.897,2,2V20z"/>
                                    <path d="M17.423,6.779H13.9l-0.918,1.687c-0.278,0.513-0.535,1.046-0.812,1.602h-0.042c-0.277-0.491-0.555-1.025-0.854-1.56
                                        l-1.025-1.729h-3.63l3.459,5.125L6.534,17.22H10.1l0.981-1.879c0.256-0.512,0.535-1.024,0.79-1.58h0.064
                                        c0.256,0.534,0.512,1.067,0.811,1.58l1.046,1.879h3.673l-3.48-5.466L17.423,6.779z"/>
                                </g>
                            </g>
                    </svg>
                </span>
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
        this.closeMediaEl = this.parentEl.querySelector('.close-media');

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
        this.closeMediaEl.addEventListener('click', this.onCloseMedia);
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
                this.hideError(); // скрываем ошибку
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

    onCloseMedia(e) {
        const streamContainer = e.target.closest('.stream');
        streamContainer.remove();    
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