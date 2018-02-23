'use strict';

(function () {
  var MAP = document.querySelector('.map');
  var START_MARKER = document.body.querySelector('.map__pin--main');
  var isMapAndFormActivated = false;

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

  // ОБРАБОТЧИК: обработчик перемещения начальной метки.
  var startMarkerDraggedHandler = function () {
    if (!isMapAndFormActivated) {
      activateMap();
      window.activateForm();
    }
    window.setAddressInForm(getStartMarkerAddress());
    window.createAllPins();
  };

  // УСТАНОВКА ОБРАБОТЧИКА на событие перемещения начальной метки
  START_MARKER.addEventListener('mouseup', startMarkerDraggedHandler);

})();
