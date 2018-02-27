'use strict';

(function () {
  var MAP = document.querySelector('.map');

  var START_MARKER = document.body.querySelector('.map__pin--main');
  var startMarkerInitialX = START_MARKER.offsetLeft;
  var startMarkerInitialY = START_MARKER.offsetTop;

  var isFormActivated = false;
  var isMapActivated = false;

  var pinsContainer = document.querySelector('.map__pins');
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

    var allPins = pinsContainer.querySelectorAll('.map__pin:not(.map__pin--main)');
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

  // Экспорты
  window.map = {};
  window.map.deactivateMap = deactivateMap;

})();
