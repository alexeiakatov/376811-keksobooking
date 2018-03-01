'use strict';

(function () {
  var MAP = document.querySelector('.map');

  var START_MARKER = document.body.querySelector('.map__pin--main');
  var startMarkerInitialX = START_MARKER.offsetLeft;
  var startMarkerInitialY = START_MARKER.offsetTop;

  var isFormActivated = false;
  var isMapActivated = false;

  var pinsContainer = document.querySelector('.map__pins');
  var allPins = pinsContainer.querySelectorAll('.map__pin:not(.map__pin--main)');
  var filtersContainer = document.querySelector('.map__filters-container');

  var dragStatus = {
    MIN_X: 0,
    MIN_Y: 100,
    maxX: pinsContainer.clientWidth,
    maxY: pinsContainer.clientHeight - filtersContainer.clientHeight,
    currentMouseX: null,
    currentMouseY: null,
    markerXdisplacement: null,
    markerYdisplacement: null
  };

  var typeFilter = document.getElementById('housing-type');
  var priceFilter = document.getElementById('housing-price');
  var roomsFilter = document.getElementById('housing-rooms');
  var guestsFilter = document.getElementById('housing-guests');
  var wifiFilter = document.getElementById('filter-wifi');
  var dishwasherFilter = document.getElementById('filter-dishwasher');
  var parkingFilter = document.getElementById('filter-parking');
  var washerFilter = document.getElementById('filter-washer');
  var elevatorFilter = document.getElementById('filter-elevator');
  var conditionerFilter = document.getElementById('filter-conditioner');


  window.form.deactivateForm();
  window.form.setAddressInForm(startMarkerInitialX + ' ' + startMarkerInitialY);

  // ФУНКЦИЯ: сделать карту активной.
  var activateMap = function () {
    if (MAP.classList.contains('map--faded')) {
      MAP.classList.remove('map--faded');
    }
  };

  // ФУНКЦИЯ: сделать карту неактивной.
  var deactivateMap = function () {
    START_MARKER.style.left = startMarkerInitialX + 'px';
    START_MARKER.style.top = startMarkerInitialY + 'px';
    window.form.setAddressInForm(startMarkerInitialX + ' ' + startMarkerInitialY);
    MAP.classList.add('map--faded');
    isMapActivated = false;
    isFormActivated = false;

    allPins.forEach(function (pin, index, array) {
      pin.parentNode.removeChild(pin);
    });
  };

  // ФУНКЦИЯ: перерисовывает положение начального маркера на карте в соответствии с перетаскиванием мышью.
  var redrawStartMarker = function (evtX, evtY) {

    var deltaX = evtX - dragStatus.currentMouseX;
    var deltaY = evtY - dragStatus.currentMouseY;

    var newXposition = dragStatus.markerXdisplacement + deltaX;
    if (newXposition >= dragStatus.MIN_X && newXposition <= dragStatus.maxX) {
      dragStatus.markerXdisplacement = newXposition;
      START_MARKER.style.left = dragStatus.markerXdisplacement + 'px';
      dragStatus.currentMouseX = evtX;
    }

    var newYposition = dragStatus.markerYdisplacement + deltaY;
    if (newYposition >= dragStatus.MIN_Y && newYposition <= dragStatus.maxY) {
      dragStatus.markerYdisplacement = newYposition;
      START_MARKER.style.top = dragStatus.markerYdisplacement + 'px';
      dragStatus.currentMouseY = evtY;
    }
  };

  // ОБРАБОТЧИК: на событие MOUSE_MOVE в рамках элемента map__pins
  var documentMouseMoveHandler = function (evt) {
    redrawStartMarker(evt.clientX, evt.clientY);
  };

  // ФУНКЦИЯ: сброс и начальная подготовка данных в объекте dragStatus
  var resetDragStatusObject = function (evtX, evtY) {
    dragStatus.markerXdisplacement = START_MARKER.offsetLeft;
    dragStatus.markerYdisplacement = START_MARKER.offsetTop;

    dragStatus.currentMouseX = evtX;
    dragStatus.currentMouseY = evtY;
  };

  // ОБРАБОТЧИК: на событие MOUSE_UP на элементе document
  var documentMouseUpHandler = function () {
    document.removeEventListener('mousemove', documentMouseMoveHandler);
    document.removeEventListener('mouseup', documentMouseUpHandler);

    if (!isFormActivated) {
      window.form.activateForm();
    }
    window.form.setAddressInForm(dragStatus.markerXdisplacement + ' ' + dragStatus.markerYdisplacement);
    window.pin.createAllPins();

  };

  // ОБРАБОТЧИК: на событие MOUSE_DOWN на начальном маркере
  var startMarkerMouseDownHandler = function (evt) {
    resetDragStatusObject(evt.clientX, evt.clientY);
    if (!isMapActivated) {
      activateMap();
    }

    document.addEventListener('mousemove', documentMouseMoveHandler);
    document.addEventListener('mouseup', documentMouseUpHandler);
  };

  // УСТАНОВКА ОБРАБОТЧИКА события mousedown на начальный маркер
  START_MARKER.addEventListener('mousedown', startMarkerMouseDownHandler);

  // УСТАНОВКА ОБРАБОТЧИКА на форму с фильтрами
  var filtersChangeHandler = function (evt) {

    console.log(evt.target.id, '; ', evt.target.value);

    window.pin.redrawPinsWithFilter(filterState);
  };

  filtersContainer.addEventListener('change', filtersChangeHandler);

  // Экспорты
  window.map = {};
  window.map.deactivateMap = deactivateMap;

})();
