import '../../css/message.css';
import * as dayjs from 'dayjs';
import 'dayjs/locale/ru';

/**
 * Класс для создания сообщения  
 *
 * @param options - принимает объект с опциями: контейнер с сообщениями, контент сообщения (медиа или текст), долготу, широту, тип сообщения ("text", "video", "audio")
 * @param type - принимает строку ("video" || "audio")
 */


export default class Message {
  constructor(options) {
    this.container = options.messagesContainer;
    this.messageContent = options.messageContent;
    this.latitude = options.coords.latitude;
    this.longitude = options.coords.longitude;
    this.date = dayjs().format('DD.MM.YYYY HH:mm');
    this.type = options.type;
  }

  getMessageMarkup() {
    return `
            <div class="message-container">
                <span class="message-date">${this.date}</span>
                <div class="message-content"></div>
                <span class="message-coords">[широта: ${this.latitude}, долгота: ${this.longitude}]</span>
            </div>
        `;
  }

  init() {
    const messageMarkup = this.getMessageMarkup();
    this.container.insertAdjacentHTML('afterbegin', messageMarkup);

    this.messageContentEl = this.container.querySelector('.message-content');

    if (this.type === 'video' || this.type === 'audio') {
        const mediaEl = document.createElement(this.type);
        mediaEl.controls = true;
        mediaEl.preload = 'auto';
        mediaEl.classList.add(this.type);
        mediaEl.src = this.messageContent;
        mediaEl.width = '380';
        this.messageContentEl.appendChild(mediaEl);
    }

    if (this.type === 'text') {
        this.messageContentEl.textContent = this.messageContent;
    }
  }
}
