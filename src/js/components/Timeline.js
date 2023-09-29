import Message from './Message';
import Modal from './Modal';
import '../../css/timeline.css';
import MediaPlayer from './MediaPlayer';


/**
 * Основной класс для взаимодействия с приложением  
 *
 * @param parentEl - родительский элемент, в нашем случае основной контейнер
 */


export default class Timeline {
  constructor(parentEl) {
    this.parentEl = parentEl;
  }

  static getTimelineMarkup() {
    return `
        <div class="timeline-container">
            <div class="messages-container"></div>
            <form class="messages-form">
                <input type="text" class="message-input" placeholder="Введите сообщение..." required />
                <div class="form-buttons">
                  <button type="submit" class="send-btn">
                    <svg fill="#f9f9f9" height="25px" width="25px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
                    viewBox="0 0 512 512" xml:space="preserve">
                      <g>
                        <g>
                          <path d="M301.434,68.144h-0.244C298.278,30.085,266.399,0,227.606,0c-40.706,0-73.823,33.117-73.823,73.823v334.824L227.606,512
                            l73.823-103.352V102.217h0.005c12.521,0,22.71,10.189,22.71,22.71v130.615h34.072V124.927
                            C358.217,93.617,332.745,68.144,301.434,68.144z M227.606,34.072c19.99,0,36.574,14.836,39.339,34.072h-78.676
                            C191.032,48.908,207.617,34.072,227.606,34.072z M227.606,453.38l-31.795-44.513h63.59L227.606,453.38z M267.357,374.795h-79.502
                            V255.542h79.502V374.795z M267.357,221.469h-79.502V102.217h79.502V221.469z"/>
                        </g>
                      </g>
                    </svg>
                  </button>
                  <button type="button" class="send-audio-btn">
                    <svg fill="#f9f9f9" height="25px" width="25px" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" xmlns:xlink="http://www.w3.org/1999/xlink" enable-background="new 0 0 512 512">
                    <g>
                      <g>
                        <path d="m439.5,236c0-11.3-9.1-20.4-20.4-20.4s-20.4,9.1-20.4,20.4c0,70-64,126.9-142.7,126.9-78.7,0-142.7-56.9-142.7-126.9 0-11.3-9.1-20.4-20.4-20.4s-20.4,9.1-20.4,20.4c0,86.2 71.5,157.4 163.1,166.7v57.5h-23.6c-11.3,0-20.4,9.1-20.4,20.4 0,11.3 9.1,20.4 20.4,20.4h88c11.3,0 20.4-9.1 20.4-20.4 0-11.3-9.1-20.4-20.4-20.4h-23.6v-57.5c91.6-9.3 163.1-80.5 163.1-166.7z"/>
                        <path d="m256,323.5c51,0 92.3-41.3 92.3-92.3v-127.9c0-51-41.3-92.3-92.3-92.3s-92.3,41.3-92.3,92.3v127.9c0,51 41.3,92.3 92.3,92.3zm-52.3-220.2c0-28.8 23.5-52.3 52.3-52.3s52.3,23.5 52.3,52.3v127.9c0,28.8-23.5,52.3-52.3,52.3s-52.3-23.5-52.3-52.3v-127.9z"/>
                      </g>
                    </g>
                    </svg>
                  </button>
                  <button type="button" class="send-video-btn">
                    <svg width="30px" height="30px" viewBox="0 0 24 24" fill="#f9f9f9" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16 10L18.5768 8.45392C19.3699 7.97803 19.7665 7.74009 20.0928 7.77051C20.3773 7.79703 20.6369 7.944 20.806 8.17433C21 8.43848 21 8.90095 21 9.8259V14.1741C21 15.099 21 15.5615 20.806 15.8257C20.6369 16.056 20.3773 16.203 20.0928 16.2295C19.7665 16.2599 19.3699 16.022 18.5768 15.5461L16 14M6.2 18H12.8C13.9201 18 14.4802 18 14.908 17.782C15.2843 17.5903 15.5903 17.2843 15.782 16.908C16 16.4802 16 15.9201 16 14.8V9.2C16 8.0799 16 7.51984 15.782 7.09202C15.5903 6.71569 15.2843 6.40973 14.908 6.21799C14.4802 6 13.9201 6 12.8 6H6.2C5.0799 6 4.51984 6 4.09202 6.21799C3.71569 6.40973 3.40973 6.71569 3.21799 7.09202C3 7.51984 3 8.07989 3 9.2V14.8C3 15.9201 3 16.4802 3.21799 16.908C3.40973 17.2843 3.71569 17.5903 4.09202 17.782C4.51984 18 5.07989 18 6.2 18Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                </div>
            </form>
        </div>
    `;
  }

  init() {
    const timelineMarkup = Timeline.getTimelineMarkup();
    this.parentEl.insertAdjacentHTML('beforeend', timelineMarkup);

    this.addModal();

    this.messagesContainer = this.parentEl.querySelector('.messages-container');
    this.messagesForm = this.parentEl.querySelector('.messages-form');
    this.messageInput = this.parentEl.querySelector('.message-input');

    this.videoBtn = this.parentEl.querySelector('.send-video-btn');
    this.audioBtn = this.parentEl.querySelector('.send-audio-btn');

    this.addListeners();
  }

  addListeners() {
    this.messagesForm.addEventListener('submit', this.onSubmitText);
    this.videoBtn.addEventListener('click', this.onVideoClick);
    this.audioBtn.addEventListener('click', this.onAudioClick);
  }

  onSubmitText = async(e) => {
    e.preventDefault();
    this.messageContent = this.messageInput.value;
    this.messageInput.value = '';
    this.currentType = 'text';
    const userLocation = await this.getUserLocation();

    if (userLocation.isAccepted) {
      this.addMessage({
        coords: userLocation.coords,
        messagesContainer: this.messagesContainer,
        messageContent: this.messageContent,
        type: this.currentType,
      });
      return;
    }
    
    this.modal.showModal(); // открыли модальное окно
  };

  onSubmitMedia = async(blobUrl) => {
    this.messageContent = blobUrl;
    const userLocation = await this.getUserLocation();

    if (userLocation.isAccepted) {
      this.addMessage({
        coords: userLocation.coords,
        messagesContainer: this.messagesContainer,
        messageContent: this.messageContent,
        type: this.currentType,
      });
      return;
    }

    this.modal.showModal(); // открыли модальное окно
  };

  onVideoClick = () => {
    this.currentType = 'video';
    this.clearMediaStreams(); // очищаем блоки со стримами

    const videoPlayer = new MediaPlayer(this.messagesContainer, this.currentType);
    videoPlayer.init();
    videoPlayer.addOnSubmitVideoFunc(this.onSubmitMedia.bind(this));
  }

  onAudioClick = () => {
    this.currentType = 'audio';
    this.clearMediaStreams(); // очищаем блоки со стримами

    const audioPlayer = new MediaPlayer(this.messagesContainer, this.currentType);
    audioPlayer.init();
    audioPlayer.addOnSubmitAudioFunc(this.onSubmitMedia.bind(this));
  }

  getUserLocation = async() => {
    if (navigator.geolocation) {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (data) => {
              const { latitude, longitude } = data.coords;
              resolve({ coords: { latitude, longitude }, isAccepted: true });
            },
            (err) => {
              reject(err);
            },
            { enableHighAccuracy: true },
          );
        });
        return position;
      } catch (error) {
        console.error('Error getting  geolocation:', error);
        return { isAccepted: false };
      }
    }
  }

  addMessage = (options) => {
    options.messagesContainer = this.messagesContainer;
    options.messageContent = this.messageContent;
    options.type = this.currentType;
    console.log(options);
    const messageEl = new Message(options);
    messageEl.init();

    this.messagesContainer.scrollTo(0, 0);
  }

  addModal = () => {
    this.modal = new Modal(this.parentEl, this.addMessage, this.currentType); // передаем функцию добавления сообщения
    this.modal.init();
  };

  clearMediaStreams() {
    [...this.parentEl.querySelectorAll('.stream')].forEach(stream => stream.remove());
  }
}
