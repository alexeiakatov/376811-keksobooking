'use strict';

(function () {
  var NOTICE_FORM = document.body.querySelector('.notice__form');
  var ADDRESS = document.getElementById('address');

  // public ФУНКЦИЯ: Убирает атрибут disabled у элементов формы - делает их доступными для ввода данных.
  var activateForm = function () {
    NOTICE_FORM.classList.remove('notice__form--disabled');
    // сделать доступным поле размещения картинки для пина
    var formChildren = NOTICE_FORM.children;

    for (var i = 0; i < formChildren.length; i++) {
      console.log(formChildren[i]);
      formChildren[i].disabled = false;
    }
  };

  // public ФУНКЦИЯ: устанавливает значение в поле формы ADDRESS в соответствии с текущим положением начального маркера.
  var setFormAddress = function (newAddress) {

    ADDRESS.value = newAddress;
  };

  // ЭКСПОРТ функции activateForm
  window.activateForm = activateForm;

  // ЭКСПОРТ функции setFormAddress
  window.setFormAddress = setFormAddress;
})();
