'use strict';

(function () {
  var TITLE_MIN_LENGTH = 30;
  var TITLE_MAX_LENGTH = 100;

  var MAX_PRICE = 1000000;

  var MIN_FLAT_PRICE = 1000;
  var MIN_BUNGALO_PRICE = 0;
  var MIN_HOUSE_PRICE = 5000;
  var MIN_PALACE_PRICE = 10000;

  var noticeFormElement = document.querySelector('.notice__form');
  var addressElement = document.getElementById('address');
  var submitFieldsetElement = noticeFormElement.querySelector('.form__element--submit');

  var submitElement = submitFieldsetElement.querySelector('.form__submit');
  var resetButtonElement = submitFieldsetElement.querySelector('.form__reset');

  // ФУНКЦИЯ: отображает рамку вокруг поля с невалидными данными
  var toggleErrorOutline = function (element, isInvalid) {
    if (isInvalid) {
      element.style.outline = '3px solid red';
      element.style.outlineOffset = '1px';
    } else {
      element.style.outline = 'none';
    }
  };

  // ФУНКЦИЯ: возвращает содержимое кастомного сообщения, которое выводится при невалидных данных в поле ввода заголовка объявления
  var getInvalidTitleMessage = function (validity) {
    var errorMessage = '';

    if (validity.valueMissing) {
      errorMessage = 'Нужно указать заголовок.';
    } else if (validity.tooShort) {
      errorMessage = 'Длина заголовка должна быть не менее 30 символов.';
    }

    return errorMessage;
  };

  // ФУНКЦИЯ: устанавливает правила валидации заголовка
  var setTitleValidity = function () {
    var titleElement = document.getElementById('title');
    titleElement.minLength = TITLE_MIN_LENGTH;
    titleElement.maxLength = TITLE_MAX_LENGTH;
    titleElement.required = true;

    titleElement.setCustomValidity('Нужно указать заголовок.');

    titleElement.addEventListener('input', function () {
      titleElement.setCustomValidity(getInvalidTitleMessage(titleElement.validity));
      toggleErrorOutline(titleElement, !titleElement.validity.valid);
    });

    titleElement.addEventListener('invalid', function () {
      toggleErrorOutline(titleElement, true);
    });

  };

  // ФУНКЦИЯ: возвращает минимальное значение предназначенное для поля price в зависимости от типа жилья
  var getMinPrice = function (type) {
    var result;
    switch (type) {
      case 'flat':
        result = MIN_FLAT_PRICE;
        break;
      case 'bungalo':
        result = MIN_BUNGALO_PRICE;
        break;
      case 'house':
        result = MIN_HOUSE_PRICE;
        break;
      case 'palace':
        result = MIN_PALACE_PRICE;
        break;
    }

    return result;
  };

  // ФУНКЦИЯ: устанавливает правила валидации цены
  var setPriceValidity = function () {
    var priceElement = document.getElementById('price');
    var typeElement = document.getElementById('type');
    priceElement.required = true;
    priceElement.max = MAX_PRICE;

    var minPrice = getMinPrice(typeElement.value);
    priceElement.min = minPrice;
    priceElement.placeholder = minPrice;

    // при событии 'change' на элементе typeElement происходит обновление значения priceElement.min

    typeElement.addEventListener('change', function () {
      minPrice = getMinPrice(typeElement.value);
      priceElement.min = minPrice;
      priceElement.placeholder = minPrice;

      var currentPriceValue = (priceElement.value.length === 0) ? 0 : parseInt(priceElement.value, 10);
      toggleErrorOutline(priceElement, currentPriceValue < priceElement.min);
    });

    priceElement.addEventListener('input', function () {
      var currentPriceValue = (priceElement.value.length === 0) ? 0 : parseInt(priceElement.value, 10);
      toggleErrorOutline(priceElement, currentPriceValue < priceElement.min);
    });

  };

  // ФУНКЦИЯ: устанавливает правила валидации для полей check in и check out.
  var setCheckInAndOutValidity = function () {
    var checkinElement = document.getElementById('timein');
    var checkoutElement = document.getElementById('timeout');

    var timeChange = function (evt) {
      var currentTime = evt.currentTarget.value;
      var target = (evt.currentTarget === checkinElement) ? checkoutElement : checkinElement;

      var selectOptions = target.children;
      for (var i = 0; i < selectOptions.length; i++) {
        if (selectOptions[i].value === currentTime) {
          selectOptions[i].selected = true;
        } else {
          selectOptions[i].selected = false;
        }
      }

    };

    checkinElement.addEventListener('change', timeChange);
    checkoutElement.addEventListener('change', timeChange);

  };

  // ФУНКЦИЯ: устанавливает правила валидации полей количество комнат и количество гостей
  var setRoomsAndCapacityValidity = function () {
    var roomsElement = document.getElementById('room_number');
    var guestsElement = document.getElementById('capacity');

    var guestsSelectOptions = guestsElement.children;

    // ФУНКЦИЯ: устанавливает нужное состояние у поля количество гостей в зависимости от установленного
    // значения количества комнат.
    var setCapacityRestrictions = function () {
      var currentRooms = roomsElement.value;
      if (currentRooms === '100') {
        // цикл - если количество комнат установлено = 100
        for (var i = 0; i < guestsSelectOptions.length; i++) {
          if (guestsSelectOptions[i].value === '0') {
            guestsSelectOptions[i].disabled = false;
            guestsSelectOptions[i].selected = true;
          } else {
            guestsSelectOptions[i].disabled = true;
            guestsSelectOptions[i].selected = false;
          }
        }
      } else {
        // цикл - если количество команат установлено != 100
        for (i = 0; i < guestsSelectOptions.length; i++) {
          if (guestsSelectOptions[i].value > currentRooms || guestsSelectOptions[i].value === '0') {
            guestsSelectOptions[i].disabled = true;
            guestsSelectOptions[i].selected = false;
          } else {
            guestsSelectOptions[i].disabled = false;
          }
        }
      }
    };

    // этот вызов для того, чтоб установиться правильное изначальное состояние поля количество гостей.
    setCapacityRestrictions();

    roomsElement.addEventListener('change', setCapacityRestrictions);

  };

  // ОБРАБОТЧИК события click на кнопке submit в форме
  var submitClickHandler = function (evt) {
    if (noticeFormElement.checkValidity()) {
      evt.preventDefault();
      var formData = new FormData(noticeFormElement);
      window.backend.sendData(formData, xhrLoadHandler, xhrErrorHandler);
    }
  };

  // public ФУНКЦИЯ: Деактивирует форму - устанавливает атрибут disabled на все fieldset в форме.
  var deactivate = function () {
    var formChildren = noticeFormElement.children;

    for (var i = 0; i < formChildren.length; i++) {
      formChildren[i].disabled = true;
    }
    noticeFormElement.classList.add('notice__form--disabled');
    submitElement.removeEventListener('click', submitClickHandler);

  };

  // ФУНКЦИЯ - колбэк: вызывается при успешной отправке данных из формы подачи объявления.
  var xhrLoadHandler = function () {
    noticeFormElement.reset();
    deactivate();
    window.card.hide();
    window.pin.removeActive();
    window.map.deactivate();
  };

  // ФУНКЦИЯ - колбэк: действия при НЕуспешной отправке данных объявления на сервер.
  var xhrErrorHandler = function (errorMessage) {
    var errorContainer = document.createElement('div');
    errorContainer.classList.add('errorContainer');

    var errorMessageElement = document.createElement('p');
    errorMessageElement.classList.add('errorMessage');
    errorMessageElement.textContent = errorMessage;

    errorContainer.appendChild(errorMessageElement);
    submitFieldsetElement.appendChild(errorContainer);

    window.setTimeout(function () {
      submitFieldsetElement.removeChild(errorContainer);
    }, 3000);
  };


  // public ФУНКЦИЯ: Убирает атрибут disabled у элементов формы, вызывает методы, устанавливающие правила валидации.
  var activate = function () {
    setTitleValidity();
    setPriceValidity();
    setCheckInAndOutValidity();
    setRoomsAndCapacityValidity();

    noticeFormElement.classList.remove('notice__form--disabled');

    var formChildren = noticeFormElement.children;

    for (var i = 0; i < formChildren.length; i++) {
      formChildren[i].disabled = false;
    }
    addressElement.readOnly = true;

    // Установка обработчика на кнопку submit в форме
    submitElement.addEventListener('click', submitClickHandler);
  };


  // public ФУНКЦИЯ: устанавливает значение в поле формы address в соответствии с текущим положением начального маркера.
  var setAddress = function (newAddress) {

    addressElement.value = newAddress;
  };

  // УСТАНОВКА обработчика нажатия на кнопку reset в форме
  resetButtonElement.addEventListener('click', function () {
    noticeFormElement.reset();
    deactivate();
    window.pin.removeActive();
    window.map.deactivate();
  });

  // Экспорты:
  window.form = {
    activate: activate,
    setAddress: setAddress,
    deactivate: deactivate
  };

})();
