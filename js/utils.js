'use strict';

(function () {
  // ФУНКЦИЯ: Получить случайное число
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

  // ФУНКЦИЯ: Найти максимальное значение результата в массиве times
  var getMaxValueInArray = function (array) {
    return Math.round(Math.max.apply(null, array));
  };

  // экспорт namespace utils в глобальную область видимости
  window.utils = {
    getRandomValue: getRandomValue,
    getMaxValueInArray: getMaxValueInArray
  };
})();
