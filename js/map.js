'use strict';

(function () {
  var mapElement = document.querySelector('.map');
  var pinsContainerElement = mapElement.querySelector('.map__pins');
  var startMarkerElement = mapElement.querySelector('.map__pin--main');
  var filtersFormElement = mapElement.querySelector('.map__filters');

  var DEBOUNCE_TIME = 500;

  var MIN_X = startMarkerElement.clientWidth / 2;
  var MAX_X = pinsContainerElement.clientWidth - (startMarkerElement.clientWidth / 2);

  var MIN_Y = 150 - Math.floor(startMarkerElement.offsetHeight / 2);
  var MAX_Y = 500 - Math.floor(startMarkerElement.offsetHeight / 2);

  var startMarkerInitialX = startMarkerElement.offsetLeft;
  var startMarkerInitialY = startMarkerElement.offsetTop + Math.floor(startMarkerElement.offsetHeight / 2);

  var isFormActivated = false;
  var isMapActivated = false;
  var pinsCreated = false;

  var dragStatus = {
    currentMouseX: null,
    currentMouseY: null,
    markerXdisplacement: null,
    markerYdisplacement: null
  };

  var housingTypeElement = document.getElementById('housing-type');
  var housingPriceElement = document.getElementById('housing-price');
  var housingRoomsElement = document.getElementById('housing-rooms');
  var housingGuestsElement = document.getElementById('housing-guests');

  var featureWiFiElement = document.getElementById('filter-wifi');
  var featureDishwasherElement = document.getElementById('filter-dishwasher');
  var featureWasherElement = document.getElementById('filter-washer');
  var featureParkingElement = document.getElementById('filter-parking');
  var featureElevatorElement = document.getElementById('filter-elevator');
  var featureConditionerElement = document.getElementById('filter-conditioner');

  var filterState = {
    'type': housingTypeElement.value,
    'price': housingPriceElement.value,
    'rooms': housingRoomsElement.value,
    'guests': housingGuestsElement.value,

    'features': {
      'wifi': featureWiFiElement.checked,
      'dishwasher': featureDishwasherElement.checked,
      'washer': featureWasherElement.checked,
      'parking': featureParkingElement.checked,
      'elevator': featureElevatorElement.checked,
      'conditioner': featureConditionerElement.checked
    }
  };

  window.form.deactivate();
  window.form.setAddress(startMarkerInitialX + ', ' + startMarkerInitialY);

  // ФУНКЦИЯ: делает доступными/недоступными фильтры объявлений
  // { boolean } isEnabled - true - делает фильтры доступными, false - недоступными
  var toggleFilters = function (isEnabled) {
    filtersFormElement.disabled = !isEnabled;
    var formElements = filtersFormElement.children;
    for (var i = 0; i < formElements.length; i++) {
      formElements[i].disabled = !isEnabled;
    }
  };

  toggleFilters(false);

  // ФУНКЦИЯ: делает карту активной.
  var activateMap = function () {
    if (mapElement.classList.contains('map--faded')) {
      mapElement.classList.remove('map--faded');
      isMapActivated = true;
    }

  };

  // ФУНКЦИЯ: делает карту неактивной. Устанавливает начальный маркер на начальную позицию, устанавливает соответствующий
  // адрес в поле формы address, делает недоступными фильтры объявлений, вызывает удаление всех пинов объявлений.
  var deactivate = function () {
    startMarkerElement.style.left = startMarkerInitialX + 'px';
    startMarkerElement.style.top = startMarkerInitialY + Math.floor(startMarkerElement.offsetHeight / 2) + 'px';
    window.form.setAddress(startMarkerInitialX + ', ' + startMarkerInitialY);

    mapElement.classList.add('map--faded');

    isMapActivated = false;
    isFormActivated = false;

    toggleFilters(false);
    window.card.hide();
    window.pin.removeAll();
  };

  // ФУНКЦИЯ: перерисовывает положение начального маркера на карте в соответствии с перетаскиванием мышью.
  var redrawStartMarker = function (evtX, evtY) {

    var deltaX = evtX - dragStatus.currentMouseX;
    var deltaY = evtY - dragStatus.currentMouseY;

    var newXposition = dragStatus.markerXdisplacement + deltaX;
    if (newXposition >= MIN_X && newXposition <= MAX_X) {
      dragStatus.markerXdisplacement = newXposition;
      startMarkerElement.style.left = dragStatus.markerXdisplacement + 'px';
      dragStatus.currentMouseX = evtX;
    }

    var newYposition = dragStatus.markerYdisplacement + deltaY;
    if (newYposition >= MIN_Y && newYposition <= MAX_Y) {
      dragStatus.markerYdisplacement = newYposition;
      startMarkerElement.style.top = dragStatus.markerYdisplacement + 'px';
      dragStatus.currentMouseY = evtY;
    }
  };

  // ОБРАБОТЧИК: на событие MOUSE_MOVE
  var documentMouseMoveHandler = function (evt) {
    if (!isMapActivated) {
      activateMap();
    }

    window.form.setAddress(dragStatus.markerXdisplacement + ', ' + (dragStatus.markerYdisplacement + Math.floor(startMarkerElement.offsetHeight / 2)));

    redrawStartMarker(evt.clientX, evt.clientY);
  };

  // ФУНКЦИЯ: сброс и начальная подготовка данных в объекте dragStatus
  var resetDragStatusObject = function (evtX, evtY) {
    dragStatus.markerXdisplacement = startMarkerElement.offsetLeft;
    dragStatus.markerYdisplacement = startMarkerElement.offsetTop;

    dragStatus.currentMouseX = evtX;
    dragStatus.currentMouseY = evtY;
  };

  // ОБРАБОТЧИК: на событие MOUSE_UP на элементе document
  var documentMouseUpHandler = function () {
    if (!isMapActivated) {
      activateMap();
    }
    if (!pinsCreated) {
      window.pin.createAll();
    }

    document.removeEventListener('mousemove', documentMouseMoveHandler);
    document.removeEventListener('mouseup', documentMouseUpHandler);

    if (!isFormActivated) {
      window.form.activate();
      isFormActivated = true;
    }

  };

  // ОБРАБОТЧИК: на событие MOUSE_DOWN на начальном маркере
  var startMarkerMouseDownHandler = function (evt) {
    resetDragStatusObject(evt.clientX, evt.clientY);

    document.addEventListener('mousemove', documentMouseMoveHandler);
    document.addEventListener('mouseup', documentMouseUpHandler);
  };

  // УСТАНОВКА ОБРАБОТЧИКА события mousedown на начальный маркер
  startMarkerElement.addEventListener('mousedown', startMarkerMouseDownHandler);

  // ОБРАБОТЧИК на форму с фильтрами объявлений
  var filtersChangeHandler = function (evt) {
    var targetId = evt.target.id;
    var featureName = targetId.split('-')[1];
    window.card.hide();

    switch (targetId) {
      case 'housing-type':
      case 'housing-price':
      case 'housing-rooms':
      case 'housing-guests':
        filterState[featureName] = evt.target.value;
        break;
      default :
        filterState.features[featureName] = evt.target.checked;
        break;
    }

    window.utils.debounce(function () {
      window.pin.redrawWithFilter(filterState);
    }, DEBOUNCE_TIME);
  };

  // УСТАНОВКА ОБРАБОТЧИКА на форму с фильтрами
  filtersFormElement.addEventListener('change', filtersChangeHandler);

  var setPinsCreated = function (areCreated) {
    pinsCreated = areCreated;
  };

  // Экспорты
  window.map = {
    deactivate: deactivate,
    toggleFilters: toggleFilters,
    setPinsCreated: setPinsCreated
  };
})();
