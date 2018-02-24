'use strict';

(function () {
  var MAP = document.querySelector('.map');
  var START_MARKER = document.body.querySelector('.map__pin--main');
  var isFormActivated = false;
  var isMapActivated = false;

  var startMarkerDragStatus = {
    MIN_X: 0,
    MIN_Y: 100,
    maxX: 1200,
    maxY: 650,
    currentMouseX: null,
    currentMouseY: null,
    markerXdisplacement: null,
    markerYdisplacement: null
  };

  window.deactivateForm();

  var getStartMarkerAddress = function () {
    var actualX = Math.round(START_MARKER.offsetLeft + (START_MARKER.clientWidth / 2));
    var actualY = Math.round(START_MARKER.offsetTop + (START_MARKER.clientHeight / 2));

    return actualX + ' ' + actualY;
  };

  // ФУНКЦИЯ: сделать карту активной.
  var activateMap = function () {
    if (MAP.classList.contains('map--faded')) {
      MAP.classList.remove('map--faded');
    }
  };

  // ФУНКЦИЯ: перерисовывает положение начального маркера на карте в соответствии с перетаскиванием мышью.
  var redrawStartMarker = function (evtX, evtY) {

    var deltaX = evtX - startMarkerDragStatus.currentMouseX;
    var deltaY = evtY - startMarkerDragStatus.currentMouseY;

    var newXposition = startMarkerDragStatus.markerXdisplacement + deltaX;
    if (newXposition >= startMarkerDragStatus.MIN_X && newXposition <= startMarkerDragStatus.maxX) {
      startMarkerDragStatus.markerXdisplacement = newXposition;
      START_MARKER.style.left = startMarkerDragStatus.markerXdisplacement + 'px';
      startMarkerDragStatus.currentMouseX = evtX;
    }

    var newYposition = startMarkerDragStatus.markerYdisplacement + deltaY;
    if (newYposition >= startMarkerDragStatus.MIN_Y && newYposition <= startMarkerDragStatus.maxY) {
      startMarkerDragStatus.markerYdisplacement = newYposition;
      START_MARKER.style.top = startMarkerDragStatus.markerYdisplacement + 'px';
      startMarkerDragStatus.currentMouseY = evtY;
    }
  };

  // ОБРАБОТЧИК: на событие MOUSE_MOVE в рамках элемента map__pins
  var documentMouseMoveHandler = function (evt) {
    redrawStartMarker(evt.clientX, evt.clientY);
  };

  // ФУНКЦИЯ: сброс и начальная подготовка данных в объекте startMarkerDragStatus
  var resetDragStatusObject = function (evtX, evtY) {
    startMarkerDragStatus.currentMouseX = null;
    startMarkerDragStatus.currentMouseY = null;

    startMarkerDragStatus.markerXdisplacement = START_MARKER.offsetLeft;
    startMarkerDragStatus.markerYdisplacement = START_MARKER.offsetTop;

    startMarkerDragStatus.currentMouseX = evtX;
    startMarkerDragStatus.currentMouseY = evtY;
  };

  // ОБРАБОТЧИК: на событие MOUSE_UP на элементе document
  var documentMouseUpHandler = function () {
    document.removeEventListener('mousemove', documentMouseMoveHandler);
    document.removeEventListener('mouseup', documentMouseUpHandler);

    if (!isFormActivated) {
      window.activateForm();
    }
    window.setAddressInForm(getStartMarkerAddress());
    window.createAllPins();
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

})();
