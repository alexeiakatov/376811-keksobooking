'use strict';

(function () {
  var NOTICE_FORM = document.body.querySelector('.notice__form');
  var ADDRESS = document.getElementById('address');

  // ФУНКЦИЯ: устанавливает правила валидации заголовка
  var setTitleValidity = function () {
    var title = document.getElementById('title');
    title.minLength = 4;
    title.maxLength = 100;
    title.required = true;

    title.setCustomValidity('Нужно указать заголовок.');

    title.addEventListener('input', function () {
      if (title.validity.valueMissing) {
        title.setCustomValidity('Нужно указать заголовок.');
      } else if (title.validity.tooShort) {
        title.setCustomValidity('Длина заголовка должна быть не менее 30 символов.');
      } else if (title.validity.tooLong) {
        title.setCustomValidity('Длина заголовка не должна быть более 100 символов.');
      } else {
        title.setCustomValidity('');
      }
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
    price.required = true;
    price.max = 1000000;
    price.min = getMinPrice(document.getElementById('type').querySelector('option:checked').value);

    // при событии 'change' на элементе type происходит обновление значения price.min
    var type = document.getElementById('type');
    type.addEventListener('change', function () {
      price.min = getMinPrice(type.value);
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

    // функция: предназначена устанавливает нужное состояние у поля количество гостей в зависимости от установленного
    // значения количества комнат. Используется так же в обработчике при изменении значения количества комнат.
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
    ADDRESS.disabled = true;
  };

  // public ФУНКЦИЯ: Деактивирует форму - устанавливает атрибут disabled на все fieldset в форме.
  var deactivateFrom = function () {
    var formChildren = NOTICE_FORM.children;

    for (var i = 0; i < formChildren.length; i++) {
      formChildren[i].disabled = true;
    }
  };

  // public ФУНКЦИЯ: устанавливает значение в поле формы ADDRESS в соответствии с текущим положением начального маркера.
  var setFormAddress = function (newAddress) {

    ADDRESS.value = newAddress;
  };

  // ЭКСПОРТ функции activateForm
  window.activateForm = activateForm;

  // ЭКСПОРТ функции setFormAddress
  window.setAddressInForm = setFormAddress;

  // ЭКСПОРТ функции deactivateForm
  window.deactivateForm = deactivateFrom;
})();
