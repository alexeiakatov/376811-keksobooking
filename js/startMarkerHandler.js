'use strict';

(function () {
  var MAP = document.querySelector('.map');
  var START_MARKER = document.body.querySelector('.map__pin--main');
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


  // ФУНКЦИЯ: убрать атрибут 'disabled'
  var removeDisabledAttribute = function (element) {
    element.disabled = false;
  };

  var setStartMarkerAddress = function () {
    var actualX = Math.round(START_MARKER.offsetLeft + (START_MARKER.clientWidth / 2));
    var actualY = Math.round(START_MARKER.offsetTop + (START_MARKER.clientHeight / 2));

    ADDRESS.value = actualX + ' ' + actualY;
  };

  // ФУНКЦИЯ: сделать карту активной.
  var activateMapAndFrom = function () {
    if (MAP.classList.contains('map--faded')) {
      MAP.classList.remove('map--faded');
    }
    if (NOTICE_FORM.classList.contains('notice__form--disabled')) {
      NOTICE_FORM.classList.toggle('notice__form--disabled');
    }

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


  // ОБРАБОТЧИК: обработчик перемещения начальной метки.
  var startMarkerDraggedHandler = function (evt) {
    activateMapAndFrom();
    setStartMarkerAddress();
    window.createAllPins();

  };

  // УСТАНОВКА ОБРАБОТЧИКА на событие перемещения начальной метки
  START_MARKER.addEventListener('mouseup', startMarkerDraggedHandler);

})();
