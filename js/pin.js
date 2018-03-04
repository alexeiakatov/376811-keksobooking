'use strict';

(function () {
  var currentActivePin = null;
  var PIN_TEMPLATE = document.querySelector('template').content.querySelector('.map__pin');
  var PIN_BUTTON_WIDTH = 50;
  var PIN_BUTTON_HEIGHT = 70;
  var pinsContainer = document.querySelector('.map__pins');

  var dataObjects = [];

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

    offerData.pin = button;

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

  // ФУНКЦИЯ - колбэк: Отрисовывает все пины на карте при успешном получении данных объявлений с сервера.
  // { [] } receivedData - данные, полученные от сервера
  var onLoadCallback = function (receivedData) {
    dataObjects = receivedData;
    var fragmentForPins = document.createDocumentFragment();
    var newPin;
    for (var i = 0; i < dataObjects.length; i++) {
      newPin = createDomPinForAnnouncement(dataObjects[i], PIN_BUTTON_WIDTH, PIN_BUTTON_HEIGHT);

      // ограничение количества отображаемых пинов (по ТЗ - не больше 5)
      if (i > 4) {
        newPin.classList.add('hidden');
      }
      fragmentForPins.appendChild(newPin);
    }

    // вставка меток-пинов на карту
    pinsContainer.appendChild(fragmentForPins);
    window.map.setPinsCreated(true);
    window.map.toggleFilters(true);
  };

  // ФУНКЦИЯ - колбэк: действия при НЕуспешном получении данных объявлений с сервера.
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
    window.backend.getData(onLoadCallback, onErrorCallback);
  };

  // public ФУНКЦИЯ: перерисовка всех пинов при изменении фильтра
  var redrawPinsWithFilter = function (filterState) {
    var filteredObjects;

    filteredObjects = dataObjects.filter(function (element) {
      return window.filters.matchType(element.offer.type, filterState['housing-type']);
    })
        .filter(function (element) {
          return window.filters.matchPrice(element.offer.price, filterState['housing-price']);
        })
        .filter(function (element) {
          return window.filters.matchRoomsNumber(element.offer.rooms, filterState['housing-rooms']);
        })
        .filter(function (element) {
          return window.filters.matchGuestsNumber(element.offer.guests, filterState['housing-guests']);
        })
        .filter(function (element) {
          return window.filters.matchFeatures(element.offer.features, filterState.features);
        });

    // т.к. отрисовывать нужно только 5 пинов - обрежем до 5 длинну массива отфильтрованных объектов
    if (filteredObjects.length > 5) {
      filteredObjects.length = 5;
    }

    var allPins = pinsContainer.querySelectorAll('.map__pin:not(.map__pin--main)');
    for (var i = 0; i < allPins.length; i++) {
      allPins[i].classList.add('hidden');
    }
    for (i = 0; i < filteredObjects.length; i++) {
      filteredObjects[i].pin.classList.remove('hidden');
    }
  };

  // public ФУНКЦИЯ: удаляет из DOM все элементы пинов
  var removeAllPins = function () {

    for (var i = 0; i < dataObjects.length; i++) {
      pinsContainer.removeChild(dataObjects[i].pin);
    }
  };

  // Экспорты:
  window.pin = {};
  window.pin.createAllPins = createAllPins;
  window.pin.removeActivePin = removeActivePin;
  window.pin.redrawPinsWithFilter = redrawPinsWithFilter;
  window.pin.removeAllPins = removeAllPins;
})();
