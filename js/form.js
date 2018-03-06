'use strict';

(function () {
  var noticeForm = document.body.querySelector('.notice__form');
  var address = document.getElementById('address');
  var submit = document.querySelector('.form__submit');
  var resetButton = noticeForm.querySelector('.form__reset');

  var TITLE_MIN_LENGTH = 30;
  var TITLE_MAX_LENGTH = 100;
  var MAX_PRICE = 1000000;

  var MIN_FLAT_PRICE = 1000;
  var MIN_BUNGALO_PRICE = 0;
  var MIN_HOUSE_PRICE = 5000;
  var MIN_PALACE_PRICE = 10000;

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
    var title = document.getElementById('title');
    title.minLength = TITLE_MIN_LENGTH;
    title.maxLength = TITLE_MAX_LENGTH;
    title.required = true;

    title.setCustomValidity('Нужно указать заголовок.');

    title.addEventListener('input', function () {
      title.setCustomValidity(getInvalidTitleMessage(title.validity));
      toggleErrorOutline(title, !title.validity.valid);
    });

    title.addEventListener('invalid', function () {
      toggleErrorOutline(title, true);
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
    var price = document.getElementById('price');
    var type = document.getElementById('type');
    price.required = true;
    price.max = MAX_PRICE;

    var minPrice = getMinPrice(type.value);
    price.min = minPrice;
    price.placeholder = minPrice;

    // при событии 'change' на элементе type происходит обновление значения price.min

    type.addEventListener('change', function () {
      minPrice = getMinPrice(type.value);
      price.min = minPrice;
      price.placeholder = minPrice;

      var currentPriceValue = (price.value.length === 0) ? 0 : parseInt(price.value, 10);
      toggleErrorOutline(price, currentPriceValue < price.min);
    });

    price.addEventListener('input', function () {
      var currentPriceValue = (price.value.length === 0) ? 0 : parseInt(price.value, 10);
      toggleErrorOutline(price, currentPriceValue < price.min);
    });

  };

  // ФУНКЦИЯ: устанавливает правила валидации для полей check in и check out.
  var setCheckInAndOutValidity = function () {
    var checkin = document.getElementById('timein');
    var checkout = document.getElementById('timeout');

    var timeChange = function (evt) {
      var currentTime = evt.currentTarget.value;
      var target = (evt.currentTarget === checkin) ? checkout : checkin;

      var selectOptions = target.children;
      for (var i = 0; i < selectOptions.length; i++) {
        if (selectOptions[i].value === currentTime) {
          selectOptions[i].selected = true;
        } else {
          selectOptions[i].selected = false;
        }
      }

    };

    checkin.addEventListener('change', timeChange);
    checkout.addEventListener('change', timeChange);

  };

  // ФУНКЦИЯ: устанавливает правила валидации полей количество комнат и количество гостей
  var setRoomsAndCapacityValidity = function () {
    var rooms = document.getElementById('room_number');
    var guests = document.getElementById('capacity');

    var guestsSelectOptions = guests.children;

    // ФУНКЦИЯ: устанавливает нужное состояние у поля количество гостей в зависимости от установленного
    // значения количества комнат.
    var setCapacityRestrictions = function () {
      var currentRooms = rooms.value;
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

    rooms.addEventListener('change', setCapacityRestrictions);

  };

  // ОБРАБОТЧИК события click на кнопке submit в форме
  var submitClickHandler = function (evt) {
    if (noticeForm.checkValidity()) {
      evt.preventDefault();
      var formData = new FormData(noticeForm);
      window.backend.sendData(formData, onLoadCallback, onErrorCallback);
    }
  };

  // public ФУНКЦИЯ: Деактивирует форму - устанавливает атрибут disabled на все fieldset в форме.
  var deactivate = function () {
    var formChildren = noticeForm.children;

    for (var i = 0; i < formChildren.length; i++) {
      formChildren[i].disabled = true;
    }
    noticeForm.classList.add('notice__form--disabled');
    submit.removeEventListener('click', submitClickHandler);

  };

  // ФУНКЦИЯ - колбэк: вызывается при успешной отправке данных из формы подачи объявления.
  var onLoadCallback = function () {
    noticeForm.reset();
    deactivate();
    window.card.hide();
    window.pin.removeActive();
    window.map.deactivate();
  };

  // ФУНКЦИЯ - колбэк: действия при НЕуспешной отправке данных объявления на сервер.
  var onErrorCallback = function (errorMessage) {
    var errorContainer = document.createElement('div');
    errorContainer.classList.add('errorContainer');

    var errorMessageElement = document.createElement('p');
    errorMessageElement.classList.add('errorMessage');
    errorMessageElement.innerText = errorMessage;

    errorContainer.appendChild(errorMessageElement);
    var submitFieldset = document.querySelector('.form__element--submit');
    submitFieldset.appendChild(errorContainer);

    window.setTimeout(function () {
      submitFieldset.removeChild(errorContainer);
    }, 3000);
  };


  // public ФУНКЦИЯ: Убирает атрибут disabled у элементов формы, вызывает методы, устанавливающие правила валидации.
  var activate = function () {
    setTitleValidity();
    setPriceValidity();
    setCheckInAndOutValidity();
    setRoomsAndCapacityValidity();

    noticeForm.classList.remove('notice__form--disabled');

    var formChildren = noticeForm.children;

    for (var i = 0; i < formChildren.length; i++) {
      formChildren[i].disabled = false;
    }
    address.readOnly = true;

    // Установка обработчика на кнопку submit в форме
    submit.addEventListener('click', submitClickHandler);
  };


  // public ФУНКЦИЯ: устанавливает значение в поле формы address в соответствии с текущим положением начального маркера.
  var setAddress = function (newAddress) {

    address.value = newAddress;
  };

  // УСТАНОВКА обработчика нажатия на кнопку reset в форме
  resetButton.addEventListener('click', function () {
    noticeForm.reset();
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
