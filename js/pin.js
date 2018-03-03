'use strict';
// требует window.getAllOfferDataObjects() для получения массива js-объектов объявлений.
// создает dom-элементы пинов, добавляет им обработчики клика и вставляет их на страницу.
// экспортирует функции: window.createAllPins, removeActivePin.

(function () {
  var currentActivePin = null;
  var PIN_TEMPLATE = document.querySelector('template').content.querySelector('.map__pin');
  var PIN_BUTTON_WIDTH = 50;
  var PIN_BUTTON_HEIGHT = 70;
  var pinsContainer = document.querySelector('.map__pins');

  var pinToData = {};
  var mapElementCount = 0;

  // private ФУНКЦИЯ: Создает DOM-элемент метки и добавляет ему обработчик клика.
  // возвращает настроенный и готовый для вставки на карту DOM-элемент метки.
  var createDomPinForAnnouncement = function (offerData, pinButtonWidth, pinButtonHeight) {
    var actualXPosition = offerData.location.x - pinButtonWidth / 2;
    var actualYPosition = offerData.location.y - pinButtonHeight;

    var button = PIN_TEMPLATE.cloneNode(true);
    var buttonStyleString = 'left:' + actualXPosition + 'px; top:' + actualYPosition + 'px;';
    button.setAttribute('style', buttonStyleString);

    var image = button.querySelector('img');
    image.src = offerData.author.avatar;

    // присвоение пину класса-идентификатора для сопоставления пин:объект_данных
    var pinIdentificator = 'pin_' + mapElementCount++;
    button.className = pinIdentificator + ' ' + button.className;

    pinToData[pinIdentificator] = offerData;

    // добавить пину обработчик события click
    button.addEventListener('click', function (evt) {
      removeActivePin();
      currentActivePin = evt.currentTarget;
      evt.currentTarget.classList.add('map__pin--active');

      window.card.setDataInDomOfferCard(offerData);
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

  // private ФУНКЦИЯ: Отрисовывает все пины на карте при успешном получении данных объявлений с сервера.
  // { Object } receivedData - данные, полученные от сервера
  var onLoadCallback = function (receivedData) {
    var fragmentForPins = document.createDocumentFragment();
    var newPin;
    for (var i = 0; i < receivedData.length; i++) {
      newPin = createDomPinForAnnouncement(receivedData[i], PIN_BUTTON_WIDTH, PIN_BUTTON_HEIGHT);
      fragmentForPins.appendChild(newPin);
    }

    // вставка меток-пинов на карту
    pinsContainer = document.querySelector('.map__pins');
    pinsContainer.appendChild(fragmentForPins);
  };

  // private ФУНКЦИЯ: действия при НЕуспешном получении данных объявлений с сервера.
  var onErrorCallback = function (errorMessage) {
    var errorContainer = document.createElement('div');
    errorContainer.classList.add('errorContainer');

    var errorMessageElement = document.createElement('p');
    errorMessageElement.classList.add('errorMessage');
    errorMessageElement.innerText = errorMessage;

    errorContainer.appendChild(errorMessageElement);
    pinsContainer.appendChild(errorContainer);

    window.setTimeout(function () {
      pinsContainer.removeChild(errorContainer);
    }, 3000);
  };

  // public ФУНКЦИЯ: создание documentFragment содержащий все метки-пины для карты и вставка их на страницу.
  var createAllPins = function () {
    // var offerDataObjects = window.data.getAllOfferDataObjects();
    window.backend.getData(onLoadCallback, onErrorCallback);
  };

  // public ФУНКЦИЯ: перерисовка всех пинов при изменении фильтра
  var redrawPinsWithFilter = function (filterState) {
    var toShowPinsClasses = [];

    for (var key in pinToData) {
      if (!window.filters.matchType(pinToData[key].offer.type, filterState['housing-type'])) {
        continue;

      } else if (!window.filters.matchPrice(pinToData[key].offer.price, filterState['housing-price'])) {
        continue;

      } else if (!window.filters.matchRoomsNumber(pinToData[key].offer.rooms, filterState['housing-rooms'])) {
        continue;

      } else if (!window.filters.matchGuestsNumber(pinToData[key].offer.guests, filterState['housing-guests'])) {
        continue;

      } else if (!window.filters.matchFeatures(pinToData[key].offer.features, filterState.features)) {
        continue;
      }

      toShowPinsClasses.push('.' + key);
    }

    // т.к. отрисовывать нужно только 5 пинов - обрежем до 5 длинну массива классов тех пинов, которые можно отобразить в соответствии с фильтром
    if (toShowPinsClasses.length > 5) {
      toShowPinsClasses.length = 5;
    }

    var allPins = pinsContainer.querySelectorAll('.map__pin:not(.map__pin--main)');
    var identifier;
    for (var i = allPins.length - 1; i >= 0; i--) {
      identifier = '.' + allPins[i].classList[0];
      allPins[i].classList.toggle('hidden', !window.utils.arrayContains(identifier, toShowPinsClasses));
    }
  };

  // Экспорты:
  window.pin = {};
  window.pin.createAllPins = createAllPins;
  window.pin.removeActivePin = removeActivePin;
  window.pin.redrawPinsWithFilter = redrawPinsWithFilter;
})();
