'use strict';
// требует window.getAnnouncementData для получения js-данных объявлений.
// создает dom-элементы пинов и вставляет их на страницу.
// экспортирует функцию window.createAllPins.

(function () {
  var PIN_BUTTON_WIDTH = 40;
  var PIN_BUTTON_HEIGHT = 40;

  // private ФУНКЦИЯ: Создает DOM-элемент метки.
  // возвращает настроенный и готовый для вставки DOM-элемент метки для карты
  var createDomPinForAnnouncement = function (offerData, pinButtonWidth, pinButtonHeight) {
    var actualXPosition = offerData.location.x - pinButtonWidth / 2;
    var actualYPosition = offerData.location.y - pinButtonHeight;

    var button = document.createElement('button');

    var buttonStyleString = 'left:' + actualXPosition + 'px; top:' + actualYPosition + 'px;';
    button.setAttribute('style', buttonStyleString);
    button.classList.add('map__pin');

    var image = document.createElement('img');
    image.setAttribute('data-id', offerData.id);
    image.src = offerData.author.avatar;
    image.width = pinButtonWidth;
    image.height = pinButtonHeight;
    image.setAttribute('draggable', 'false');

    button.appendChild(image);

    return button;
  };

  // public ФУНКЦИЯ: создание documentFragment содержащий все метки-пины для карты и вставка их на страницу.
  var createAllPins = function () {
    var fragmentForPins = document.createDocumentFragment();
    var announcements = window.getAllAnnouncements();
    var newPin;

    for (var i = 0; i < announcements.length; i++) {
      newPin = createDomPinForAnnouncement(announcements[i], PIN_BUTTON_WIDTH, PIN_BUTTON_HEIGHT);
      fragmentForPins.appendChild(newPin);
    }

    // вставка меток-пинов на карту
    var pinsContainer = document.querySelector('.map__pins');
    pinsContainer.appendChild(fragmentForPins);
  };

  // экспорт функции createAllpins.
  window.createAllPins = createAllPins;

})();
