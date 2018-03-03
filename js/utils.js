'use strict';

(function () {

  var previousTimerId;

  // public ФУНКЦИЯ: Получить случайное число
  var getRandomValue = function (min, max, scale) {

    if (typeof scale !== 'number' || typeof min !== 'number' || typeof max !== 'number') {
      // console.log('Неправильный тип одного из аргументов (все д.б. number). Возвращено null.');
      return null;
    }

    var result = min + Math.random() * (max - min);

    scale = Math.abs(scale);
    scale = parseInt(scale + '', 10);
    return Number(result.toFixed(scale));
  };

  // public ФУНКЦИЯ: Найти максимальное значение результата в массиве times
  var getMaxValueInArray = function (array) {
    return Math.round(Math.max.apply(null, array));
  };

  // public ФУНКЦИЯ: проверка наличия в массиве вхождения с переданным значением
  // { String } element - строка, наличие которой проверяем в массиве
  // { String[] } array - массив в котором нужно проверить наличие переданной строки
  var arrayContains = function (element, array) {
    var hasElement = false;

    for (var i = 0; i < array.length; i++) {
      if (array[i] === element) {
        hasElement = true;
        break;
      }
    }
    return hasElement;
  };

  // public ФУНКЦИЯ: debounce
  var debounce = function (callBack, timeLimit) {
    if (previousTimerId) {
      clearTimeout(previousTimerId);
    }
    previousTimerId = setTimeout(callBack, timeLimit);
  };


  // Экспорты:
  window.utils = {};

  window.utils.getRandomValue = getRandomValue;
  window.utils.getMaxValueInArray = getMaxValueInArray;
  window.utils.arrayContains = arrayContains;
  window.utils.debounce = debounce;

})();
