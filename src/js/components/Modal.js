/* eslint-disable no-useless-escape */
import editCoords from './editCoords';
import '../../css/modal.css';

/**
 * Создает модальное окно и отправляет валидные координаты  
 *
 * @param container - родительский элемент, в нашем случае основной контейнер
 * @param callback - функция для отправления сообщений, которая сработает в случае валидной отправки координат
 */

export default class Modal {
  constructor(container, callback, type) {
    this.container = container;
    this.modalContent = `К сожалению нам не удалось определить ваше местоположение.
        Пожалуйста, дайте разрешение на использование геолокации, либо введите координаты вручную.
        <span class="nota-bene">Укажите широту и долготу через запятую</span>`;
    this.title = 'Что-то пошло не так';
    this.addMessageFunc = callback;
    this.currentType = type;
  }

  getModalMarkup() {
    return `
            <dialog class="modal-container">
                <h3 class="modal-title">${this.title}</h3>
                <p class="modal-content">${this.modalContent}</p>
                <span class="modal-error"></span>
                <form class="modal-form" method="dialog">
                    <input type="text" class="modal-input" placeholder="Например: 51.50851, 0.12572" required pattern="^[+-]?(90(.\d+)?|[1-8]?\d(.\d+)?)\s*,\s*[+-]?(180(.\d+)?|(1[0-7]\d|\d{1,2})(.\d+)?)$">
                    <div class="modal-buttons">
                        <button type="button" class="modal-cancel-btn">Отмена</button>
                        <button type="submit" class="modal-send-btn">OK</button>
                    </div>
                </form>
            </dialog>
        `;
  }

  init() {
    const modalMarkup = this.getModalMarkup();
    this.container.insertAdjacentHTML('beforeend', modalMarkup);

    this.modalContainer = this.container.querySelector('.modal-container');
    this.modalForm = this.container.querySelector('.modal-form');
    this.modalInput = this.container.querySelector('.modal-input');
    this.modalSendBtn = this.container.querySelector('.modal-send-btn');
    this.modalCancelBtn = this.container.querySelector('.modal-cancel-btn');
    this.errorEl = this.container.querySelector('.modal-error');


    this.addListeners();
  }

  addListeners() {
    this.modalForm.addEventListener('submit', this.onSubmit);
    this.modalCancelBtn.addEventListener('click', this.closeModal);
  }

  showModal() {
    this.modalContainer.showModal();
  }

  closeModal = () => {
    this.modalContainer.close();
  }

  onSubmit = (e) => {
    e.preventDefault();

    this.errorEl.textContent = '';
    this.coords = this.modalInput.value;
    const editedCoords = editCoords(this.coords);

    if (editedCoords && editedCoords.errors) {
        editedCoords.errors.forEach(err => {
            this.errorEl.textContent += err.error + '\n';
        })
        return false;
    }
    
    this.addMessageFunc( {coords: editedCoords, type: this.currentType} );
    this.modalInput.value = '';
    this.errorEl.textContent = '';

    this.closeModal();
  };

}
