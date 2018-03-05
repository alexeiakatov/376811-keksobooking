'use strict';

(function () {
  var map = document.querySelector('.map');

  var startMarker = document.body.querySelector('.map__pin--main');

  var startMarkerInitialX = startMarker.offsetLeft;
  var startMarkerInitialY = startMarker.offsetTop + Math.floor(startMarker.offsetHeight / 2);

  var isFormActivated = false;
  var isMapActivated = false;
  var pinsCreated = false;

  var pinsContainer = document.querySelector('.map__pins');
  var filtersContainer = document.querySelector('.map__filters-container');
  var filtersForm = filtersContainer.querySelector('form');

  var dragStatus = {
    minX: startMarker.clientWidth / 2,
    minY: 150 - Math.floor(startMarker.offsetHeight / 2),
    maxX: pinsContainer.clientWidth - (startMarker.clientWidth / 2),
    maxY: 500 - Math.floor(startMarker.offsetHeight / 2),
    currentMouseX: null,
    currentMouseY: null,
    markerXdisplacement: null,
    markerYdisplacement: null
  };

  var filterState = {
    'housing-type': document.getElementById('housing-type').value,
    'housing-price': document.getElementById('housing-price').value,
    'housing-rooms': document.getElementById('housing-rooms').value,
    'housing-guests': document.getElementById('housing-guests').value,
    'features': {
      'filter-wifi': document.getElementById('filter-wifi').checked,
      'filter-dishwasher': document.getElementById('filter-dishwasher').checked,
      'filter-washer': document.getElementById('filter-washer').checked,
      'filter-parking': document.getElementById('filter-parking').checked,
      'filter-elevator': document.getElementById('filter-elevator').checked,
      'filter-conditioner': document.getElementById('filter-conditioner').checked
    }
  };

  window.form.deactivateForm();
  window.form.setAddressInForm(startMarkerInitialX + ', ' + startMarkerInitialY);

  // ФУНКЦИЯ: делает доступными/недоступными фильтры объявлений
  // { boolean } isEnabled - true - делает фильтры доступными, false - недоступными
  var toggleFilters = function (isEnabled) {
    filtersForm.disabled = !isEnabled;
    var formElements = filtersForm.children;
    for (var i = 0; i < formElements.length; i++) {
      formElements[i].disabled = !isEnabled;
    }
  };

  toggleFilters(false);

  // ФУНКЦИЯ: делает карту активной.
  var activateMap = function () {
    if (map.classList.contains('map--faded')) {
      map.classList.remove('map--faded');
      isMapActivated = true;
    }

  };

  // ФУНКЦИЯ: делает карту неактивной. Устанавливает начальный маркер на начальную позицию, устанавливает соответствующий
  // адрес в поле формы address, делает недоступными фильтры объявлений, вызывает удаление всех пинов объявлений.
  var deactivateMap = function () {
    startMarker.style.left = startMarkerInitialX + 'px';
    startMarker.style.top = startMarkerInitialY + Math.floor(startMarker.offsetHeight / 2) + 'px';
    window.form.setAddressInForm(startMarkerInitialX + ', ' + startMarkerInitialY);

    map.classList.add('map--faded');

    isMapActivated = false;
    isFormActivated = false;

    toggleFilters(false);
    window.card.hide();
    window.pin.removeAllPins();
  };

  // ФУНКЦИЯ: перерисовывает положение начального маркера на карте в соответствии с перетаскиванием мышью.
  var redrawStartMarker = function (evtX, evtY) {

    var deltaX = evtX - dragStatus.currentMouseX;
    var deltaY = evtY - dragStatus.currentMouseY;

    var newXposition = dragStatus.markerXdisplacement + deltaX;
    if (newXposition >= dragStatus.minX && newXposition <= dragStatus.maxX) {
      dragStatus.markerXdisplacement = newXposition;
      startMarker.style.left = dragStatus.markerXdisplacement + 'px';
      dragStatus.currentMouseX = evtX;
    }

    var newYposition = dragStatus.markerYdisplacement + deltaY;
    if (newYposition >= dragStatus.minY && newYposition <= dragStatus.maxY) {
      dragStatus.markerYdisplacement = newYposition;
      startMarker.style.top = dragStatus.markerYdisplacement + 'px';
      dragStatus.currentMouseY = evtY;
    }
  };

  // ОБРАБОТЧИК: на событие MOUSE_MOVE
  var documentMouseMoveHandler = function (evt) {
    if (!isMapActivated) {
      activateMap();
    }

    window.form.setAddressInForm(dragStatus.markerXdisplacement + ', ' + (dragStatus.markerYdisplacement + Math.floor(startMarker.offsetHeight / 2)));

    redrawStartMarker(evt.clientX, evt.clientY);
  };

  // ФУНКЦИЯ: сброс и начальная подготовка данных в объекте dragStatus
  var resetDragStatusObject = function (evtX, evtY) {
    dragStatus.markerXdisplacement = startMarker.offsetLeft;
    dragStatus.markerYdisplacement = startMarker.offsetTop;

    dragStatus.currentMouseX = evtX;
    dragStatus.currentMouseY = evtY;
  };

  // ОБРАБОТЧИК: на событие MOUSE_UP на элементе document
  var documentMouseUpHandler = function () {
    if (!isMapActivated) {
      activateMap();
    }
    if (!pinsCreated) {
      window.pin.createAllPins();
    }

    document.removeEventListener('mousemove', documentMouseMoveHandler);
    document.removeEventListener('mouseup', documentMouseUpHandler);

    if (!isFormActivated) {
      window.form.activateForm();
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
  startMarker.addEventListener('mousedown', startMarkerMouseDownHandler);

  // ОБРАБОТЧИК на форму с фильтрами объявлений
  var filtersChangeHandler = function (evt) {
    var targetId = evt.target.id;

    window.card.hideOfferCard();

    switch (targetId) {
      case 'housing-type':
      case 'housing-price':
      case 'housing-rooms':
      case 'housing-guests':
        filterState[targetId] = evt.target.value;
        break;
      default :
        filterState.features[targetId] = evt.target.checked;
        break;
    }

    window.utils.debounce(function () {
      window.pin.redrawPinsWithFilter(filterState);
    }, 500);
  };

  // УСТАНОВКА ОБРАБОТЧИКА на форму с фильтрами
  filtersForm.addEventListener('change', filtersChangeHandler);

  var setPinsCreated = function (areCreated) {
    pinsCreated = areCreated;
  };

  // Экспорты
  window.map = {
    deactivateMap: deactivateMap,
    toggleFilters: toggleFilters,
    setPinsCreated: setPinsCreated
  };
})();
