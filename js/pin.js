'use strict';
// требует window.getAllOfferDataObjects() для получения массива js-объектов объявлений.
// создает dom-элементы пинов, вставляет их на страницу, добавляет на контейнер пинов обработчик клика на пине.
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
    var offerDataObjects = window.getAllOfferDataObjects();
    var newPin;

    for (var i = 0; i < offerDataObjects.length; i++) {
      newPin = createDomPinForAnnouncement(offerDataObjects[i], PIN_BUTTON_WIDTH, PIN_BUTTON_HEIGHT);
      fragmentForPins.appendChild(newPin);
    }

    // вставка меток-пинов на карту
    var pinsContainer = document.querySelector('.map__pins');
    pinsContainer.appendChild(fragmentForPins);

    // определение хендлера клика на любой пин
    var pinClickHandler = function (evt) {
      var currentId = evt.target.getAttribute('data-id');
      if (currentId !== null) {
        var dataObject = window.getOfferDataObjectById(currentId);
        window.createDomOfferCard(dataObject);
      }

    };

    pinsContainer.addEventListener('mousedown', pinClickHandler);
  };

  // экспорт функции createAllpins.
  window.createAllPins = createAllPins;

})();
