'use strict';

(function () {
  var NOTICE_FORM = document.body.querySelector('.notice__form');
  var ADDRESS = document.getElementById('address');

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
    title.minLength = 30;
    title.maxLength = 100;
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
        result = 1000;
        break;

      case 'bungalo':
        result = 0;
        break;

      case 'house':
        result = 5000;
        break;

      case 'palace':
        result = 10000;
        break;
    }

    return result;
  };

  // ФУНКЦИЯ: устанавливает правила валидации цены
  var setPriceValidity = function () {
    var price = document.getElementById('price');
    var type = document.getElementById('type');
    price.required = true;
    price.max = 1000000;
    price.min = getMinPrice(type.querySelector('option:checked').value);
    // при событии 'change' на элементе type происходит обновление значения price.min

    type.addEventListener('change', function () {
      price.min = getMinPrice(type.value);
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

  // ФУНКЦИЯ - колбэк: вызывается при успешной отправке данных из формы подачи объявления.
  var onLoadCallback = function () {
    NOTICE_FORM.reset();
    deactivateFrom();
    window.card.hideOfferCard();
    window.pin.removeActivePin();
    window.map.deactivateMap();
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
  var activateForm = function () {
    setTitleValidity();
    setPriceValidity();
    setCheckInAndOutValidity();
    setRoomsAndCapacityValidity();

    NOTICE_FORM.classList.remove('notice__form--disabled');
    // сделать доступным поле размещения картинки для пина
    var formChildren = NOTICE_FORM.children;

    for (var i = 0; i < formChildren.length; i++) {
      formChildren[i].disabled = false;
    }
    ADDRESS.readonly = true;

    var submit = document.querySelector('.form__submit');
    submit.addEventListener('click', function (evt) {

      if (NOTICE_FORM.checkValidity()) {
        evt.preventDefault();
        var formData = new FormData(NOTICE_FORM);
        window.backend.sendData(formData, onLoadCallback, onErrorCallback);
      }
    });
  };

  // public ФУНКЦИЯ: Деактивирует форму - устанавливает атрибут disabled на все fieldset в форме.
  var deactivateFrom = function () {
    var formChildren = NOTICE_FORM.children;

    for (var i = 0; i < formChildren.length; i++) {
      formChildren[i].disabled = true;
    }
    NOTICE_FORM.classList.add('notice__form--disabled');
  };

  // public ФУНКЦИЯ: устанавливает значение в поле формы ADDRESS в соответствии с текущим положением начального маркера.
  var setFormAddress = function (newAddress) {

    ADDRESS.value = newAddress;
  };

  // УСТАНОВКА обработчика нажатия на кнопку reset в форме
  NOTICE_FORM.querySelector('.form__reset').addEventListener('click', function () {
    NOTICE_FORM.reset();
    deactivateFrom();
    window.card.hideOfferCard();
    window.pin.removeActivePin();
    window.map.deactivateMap();
  });

  // Экспорты:
  window.form = {};
  window.form.activateForm = activateForm;
  window.form.setAddressInForm = setFormAddress;
  window.form.deactivateForm = deactivateFrom;
})();
