'use strict';

(function () {
  var PIN_BUTTON_WIDTH = 50;
  var PIN_BUTTON_HEIGHT = 70;
  var ERROR_SHOW_TIMEOUT = 3000;

  var currentActivePin;
  var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');
  var pinsContainerElement = document.querySelector('.map__pins');

  var errorContainerElement = document.createElement('div');
  var errorMessageElement = document.createElement('p');

  errorContainerElement.classList.add('error_container');
  errorMessageElement.classList.add('error_message');
  errorContainerElement.appendChild(errorMessageElement);

  var dataObjects = [];

  // private ФУНКЦИЯ: Создает DOM-элемент метки и добавляет ему обработчик клика.
  // возвращает настроенный и готовый для вставки на карту DOM-элемент метки.
  var createDomPinForAnnouncement = function (offerData, pinButtonWidth, pinButtonHeight) {
    var actualXPosition = offerData.location.x - pinButtonWidth / 2;
    var actualYPosition = offerData.location.y - pinButtonHeight;

    var button = pinTemplate.cloneNode(true);

    button.style.left = actualXPosition + 'px';
    button.style.top = actualYPosition + 'px';

    var imageElement = button.querySelector('img');
    imageElement.src = offerData.author.avatar;

    offerData.pin = button;

    // добавить пину обработчик события click
    button.addEventListener('click', function (evt) {
      removeActive();
      currentActivePin = evt.currentTarget;
      evt.currentTarget.classList.add('map__pin--active');

      window.card.setDataInDomOfferElement(offerData);
    });

    return button;
  };

  // public ФУНКЦИЯ: Удаляет у активного пина класс 'map__pin--active' и удаляет ссылку на него из переменной currentActivePin.
  var removeActive = function () {
    if (currentActivePin) {
      currentActivePin.classList.remove('map__pin--active');
      currentActivePin = null;
    }
  };

  // ФУНКЦИЯ - колбэк: Отрисовывает все пины на карте при успешном получении данных объявлений с сервера.
  // { [] } receivedData - данные, полученные от сервера
  var xhrLoadHandler = function (receivedData) {
    dataObjects = receivedData;
    var fragmentForPins = document.createDocumentFragment();
    var newPin;

    dataObjects.forEach(function (element, index) {
      newPin = createDomPinForAnnouncement(element, PIN_BUTTON_WIDTH, PIN_BUTTON_HEIGHT);

      // ограничение количества отображаемых пинов (по ТЗ - не больше 5)
      if (index > 4) {
        newPin.classList.add('hidden');
      }
      fragmentForPins.appendChild(newPin);
    });

    // вставка меток-пинов на карту
    pinsContainerElement.appendChild(fragmentForPins);
    window.map.setPinsCreated(true);
    window.map.toggleFilters(true);
  };

  // ФУНКЦИЯ - колбэк: действия при НЕуспешном получении данных объявлений с сервера.
  var xhrErrorHandler = function (errorMessage) {
    errorMessageElement.textContent = errorMessage;
    pinsContainerElement.appendChild(errorContainerElement);

    window.setTimeout(function () {
      pinsContainerElement.removeChild(errorContainerElement);
    }, ERROR_SHOW_TIMEOUT);
  };

  // public ФУНКЦИЯ: создание documentFragment содержащий все метки-пины для карты и вставка их на страницу.
  var createAll = function () {
    window.backend.getData(xhrLoadHandler, xhrErrorHandler);
  };

  // public ФУНКЦИЯ: перерисовка всех пинов при изменении фильтра
  var redrawWithFilter = function (filterState) {
    var filteredObjects = dataObjects.filter(function (element) {
      return window.filters.checkAll(element, filterState);
    });

    // т.к. отрисовывать нужно только 5 пинов - обрежем до 5 длинну массива отфильтрованных объектов
    if (filteredObjects.length > 5) {
      filteredObjects.length = 5;
    }

    var allPins = pinsContainerElement.querySelectorAll('.map__pin:not(.map__pin--main)');
    allPins.forEach(function (element) {
      element.classList.add('hidden');
    });

    filteredObjects.forEach(function (element) {
      element.pin.classList.remove('hidden');
    });
  };

  // public ФУНКЦИЯ: удаляет из DOM все элементы пинов
  var removeAll = function () {
    dataObjects.forEach(function (element) {
      pinsContainerElement.removeChild(element.pin);
    });
    window.map.setPinsCreated(false);
  };

  // Экспорты:
  window.pin = {
    createAll: createAll,
    removeActive: removeActive,
    redrawWithFilter: redrawWithFilter,
    removeAll: removeAll
  };
})();
