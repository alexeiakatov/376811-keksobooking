'use strict';

(function () {

  var previousTimerId;

  // public ФУНКЦИЯ: Возвращает случайное число случайное число
  var getRandomValue = function (min, max, scale) {

    if (typeof scale !== 'number' || typeof min !== 'number' || typeof max !== 'number') {
      return null;
    }

    var result = min + Math.random() * (max - min);

    scale = Math.abs(scale);
    scale = parseInt(scale + '', 10);
    return Number(result.toFixed(scale));
  };

  // public ФУНКЦИЯ: Находит максимальное значение в массиве
  var getMaxValueInArray = function (array) {
    return Math.round(Math.max.apply(null, array));
  };

  // public ФУНКЦИЯ: debounce
  var debounce = function (callBack, timeLimit) {
    if (previousTimerId) {
      clearTimeout(previousTimerId);
    }
    previousTimerId = setTimeout(callBack, timeLimit);
  };

  // Экспорты:
  window.utils = {
    getRandomValue: getRandomValue,
    getMaxValueInArray: getMaxValueInArray,
    debounce: debounce
  };

})();
