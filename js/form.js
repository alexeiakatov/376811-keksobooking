'use strict';

(function () {
  var NOTICE_FORM = document.body.querySelector('.notice__form');
  var AVATAR = document.getElementById('avatar');
  var TITLE = document.getElementById('title');
  var ADDRESS = document.getElementById('address');
  var TYPE = document.getElementById('type');
  var PRICE = document.getElementById('price');
  var CHECK_IN = document.getElementById('timein');
  var CHECK_OUT = document.getElementById('timeout');
  var ROOM_NUMBER = document.getElementById('room_number');
  var CAPACITY = document.getElementById('capacity');
  var FEATURES = NOTICE_FORM.querySelector('.features');
  var DESCRIPTION = document.getElementById('description');
  var IMAGES = document.getElementById('images');
  var SUBMIT_BUTTON = NOTICE_FORM.querySelector('.form__submit');


  // private ФУНКЦИЯ: убрать атрибут 'disabled'
  var removeDisabledAttribute = function (element) {
    element.disabled = false;
  };

  // public ФУНКЦИЯ: Убирает атрибут disabled у элементов формы - делает их доступными для ввода данных.
  var activateForm = function () {
    NOTICE_FORM.classList.remove('notice__form--disabled');
    // сделать доступным поле размещения картинки для пина
    removeDisabledAttribute(AVATAR);

    // сделать доступным поле заголовка объявления
    removeDisabledAttribute(TITLE);

    // сделать доступным поле адреса
    removeDisabledAttribute(ADDRESS);

    // сделать доступным выбор типа жилья
    removeDisabledAttribute(TYPE);

    // сделать доступным поле цены
    removeDisabledAttribute(PRICE);

    // сделать доступным выбор check in
    removeDisabledAttribute(CHECK_IN);

    // сделать доступным выбор check out
    removeDisabledAttribute(CHECK_OUT);

    // сделать доступным выбор количества комнат
    removeDisabledAttribute(ROOM_NUMBER);

    // сделать доступным выбор количества мест
    removeDisabledAttribute(CAPACITY);

    // сделать доступным указание фич
    removeDisabledAttribute(FEATURES);

    // сделать доступным поле описания
    removeDisabledAttribute(DESCRIPTION);

    // сделать доступным поле размещения картинок жилья
    removeDisabledAttribute(IMAGES);

    // сделать доступной кнопку отправки формы
    removeDisabledAttribute(SUBMIT_BUTTON);
  };

  // public ФУНКЦИЯ: устанавливает значение в поле формы ADDRESS в соответствии с текущим положением начального маркера.
  var setFormAddress = function (newAddress) {
    ADDRESS.value = newAddress;
  };

  // ЭКСПОРТ функции activateForm
  window.activateForm = activateForm;

  // ЭКСПОРТ функции setFormAddress
  window.setFormAddress = setFormAddress;
})();
