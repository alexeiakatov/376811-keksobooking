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

  // private ФУНКЦИЯ: проверка соответствия фильтру типа жилья
  var matchType = function (currentType, filterType) {

    var isMatch = false;
    if (filterType === 'any') {
      isMatch = true;
    } else if (currentType === filterType) {
      isMatch = true;
    }

    console.log('[matchType] current: ', currentType,'; filter: ', filterType, '; result: ', isMatch);

    return isMatch;
  };

  // private ФУНКЦИЯ: проверка соответствия фильтру цены
  var matchPrice = function (currentPrice, filterPrice) {
    var isMatch;
    switch (filterPrice) {
      case 'any' :
        isMatch = true;
        break;
      case 'middle':
        isMatch = (currentPrice >= 10000 && currentPrice <= 50000);
        break;
      case 'low':
        isMatch = (currentPrice >= 0 && currentPrice < 10000);
        break;
      case 'high':
        isMatch = (currentPrice > 50000);
        break;
    }
    console.log('[matchPrice] current: ', currentPrice, '; filter: ', filterPrice, '; result: ', isMatch);
    return isMatch;
  };

  // private ФУНКЦИЯ: проверка соответствия фильтру количества комнат
  var matchRoomsNumber = function (currentRoomsNumber, filterRoomsNumber) {
    var isMatch = false;

    if (filterRoomsNumber === 'any') {
      isMatch = true;
    } else if (parseInt(filterRoomsNumber, 10) === currentRoomsNumber) {
      isMatch = true;
    }
    console.log('[matchRoomsNumber] current: ', currentRoomsNumber,'; filter: ', filterRoomsNumber, '; result: ', isMatch);

    return isMatch;
  };

  // private ФУНКЦИЯ: проверка соответствия фильтру количества гостей
  var matchGuestsNumber = function (currentGuestsNumber, filterGuestsNumber) {
    console.log('cur: ', typeof currentGuestsNumber, '; val: ', currentGuestsNumber);
    console.log('cur: ', typeof filterGuestsNumber, '; val: ', filterGuestsNumber);

    return currentGuestsNumber === filterGuestsNumber;
  };

  // private ФУНКЦИЯ: проверка соответствия фильтру фич
  var matchFeatures = function (currentFeatures, filterFeatures) {
    var isMatch = true;
    for (var feature in filterFeatures) {
      var featureIdentifier = feature.split('-')[1];
      if (filterFeatures.feature && !currentFeatures.contains(featureIdentifier)) {
        isMatch = false;
        break;
      }
    }
  };

  // public ФУНКЦИЯ: перерисовка всех пинов при изменении фильтра
  var redrawPinsWithFilter = function (filterState) {
    var toShowPinsClasses = [];


    for (var key in pinToData) {
      if (!matchType(pinToData[key].offer.type, filterState['housing-type'])) {
        continue;

      } else if (!matchPrice(pinToData[key].offer.price, filterState['housing-price'])) {
        continue;

      } else if (!matchRoomsNumber(pinToData[key].offer.rooms, filterState['housing-rooms'])) {
        continue;

      } else if (!matchGuestsNumber(pinToData[key].offer.guests, filterState['housing-guests'])) {
        continue;

      } else if (!matchFeatures(pinToData[key].offer.features, filterState.features)) {
        continue;
      }

      toShowPinsClasses.push('.' + key);
      console.log(toShowPinsClasses);
    }

    // т.к. отрисовывать нужно только 5 пинов - обрежем до 5 длинну массива классов тех пинов, которые нужно отобразить
    if (toShowPinsClasses.length > 5) {
      toShowPinsClasses.length = 5;
    }

    var allPins = pinsContainer.querySelectorAll('.map__pin:not(.map__pin--main)');
    var isShown;
    var identifier;
    allPins.forEach(function (pin, index, array) {
      isShown = false;
      identifier = pin.classList[0];
      for (var i = 0; i < toShowPinsClasses.length; i++) {
        if (toShowPinsClasses[i] === identifier) {
          isShown = true;
          break;
        }
      }
      pin.classList.remove('.hidden', !isShown);
    });

  };

  // Экспорты:
  window.pin = {};
  window.pin.createAllPins = createAllPins;
  window.pin.removeActivePin = removeActivePin;
  window.pin.redrawPinsWithFilter = redrawPinsWithFilter;
})();
