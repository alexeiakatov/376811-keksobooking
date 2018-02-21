'use strict';
// требует window.getAllOfferDataObjects() для получения массива js-объектов объявлений.
// создает dom-элементы пинов, добавляет им обработчики клика и вставляет их на страницу.
// экспортирует функции: window.createAllPins, removeActivePin.

(function () {
  var currentActivePin = null;
  var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');
  var PIN_BUTTON_WIDTH = pinTemplate.getAttribute('width');
  var PIN_BUTTON_HEIGHT = pinTemplate.getAttribute('height');

  // private ФУНКЦИЯ: Создает DOM-элемент метки и добавляет ему обработчик клика.
  // возвращает настроенный и готовый для вставки на карту DOM-элемент метки.
  var createDomPinForAnnouncement = function (offerData, pinButtonWidth, pinButtonHeight) {
    var actualXPosition = offerData.location.x - pinButtonWidth / 2;
    var actualYPosition = offerData.location.y - pinButtonHeight;

    var button = pinTemplate.cloneNode(true);
    var buttonStyleString = 'left:' + actualXPosition + 'px; top:' + actualYPosition + 'px;';
    button.setAttribute('style', buttonStyleString);

    var image = button.querySelector('img');
    image.src = offerData.author.avatar;

    button.addEventListener('click', function (evt) {
      removeActivePin();
      currentActivePin = evt.currentTarget;
      evt.currentTarget.classList.add('map__pin--active');

      window.setDataInDomOfferCard(offerData);
    });

    return button;
  };

  // public ФУНКЦИЯ: Удаляет у активного пина класс 'map__pin--active' и удаляет ссылку на него из переменной currentActivePin.
  var removeActivePin = function () {
    if (currentActivePin !== null) {
      currentActivePin.classList.remove('map__pin--active');
      currentActivePin = null;
    }
  };

  // public ФУНКЦИЯ: создание documentFragment содержащий все метки-пины для карты и вставка их на страницу.
  var createAllPins = function () {
    var fragmentForPins = document.createDocumentFragment();
    var offerDataObjects = window.getAllOfferDataObjects();
    var newPin;

    for (var i = 0; i < offerDataObjects.length; i++) {
      newPin = createDomPinForAnnouncement(offerDataObjects[i], PIN_BUTTON_WIDTH, PIN_BUTTON_HEIGHT);
      fragmentForPins.appendChild(newPin);
    }

    // вставка меток-пинов на карту
    var pinsContainer = document.querySelector('.map__pins');
    pinsContainer.appendChild(fragmentForPins);
  };

  // экспорт функции createAllpins.
  window.createAllPins = createAllPins;

  // экспорт переменной
  window.removeActivePin = removeActivePin;

})();
