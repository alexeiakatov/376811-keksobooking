'use strict';

(function () {

  // ФУНКЦИЯ: проверка соответствия фильтру типа жилья
  var matchType = function (currentType, filterType) {
    return (filterType === 'any') || (currentType === filterType);
  };

  // ФУНКЦИЯ: проверка соответствия фильтру цены жилья
  var matchPrice = function (currentPrice, filterPrice) {
    var isMatch;
    switch (filterPrice) {
      case 'any' :
        isMatch = true;
        break;
      case 'middle':
        isMatch = (currentPrice >= 10000 && currentPrice <= 50000);
        break;
      case 'low':
        isMatch = (currentPrice >= 0 && currentPrice < 10000);
        break;
      case 'high':
        isMatch = (currentPrice > 50000);
        break;
    }
    return isMatch;
  };

  // ФУНКЦИЯ: проверка соответствия фильтру количества комнат
  var matchRoomsNumber = function (currentRoomsNumber, filterRoomsNumber) {
    return (filterRoomsNumber === 'any') || (parseInt(filterRoomsNumber, 10) === currentRoomsNumber);
  };

  // ФУНКЦИЯ: проверка соответствия фильтру количества гостей
  var matchGuestsNumber = function (currentGuestsNumber, filterGuestsNumber) {
    if (filterGuestsNumber === 'any') {
      return true;
    }

    return currentGuestsNumber === parseInt(filterGuestsNumber, 10);
  };


  // ФУНКЦИЯ: проверка соответствия фильтру фич
  var matchFeatures = function (currentFeatures, filterFeatures) {
    var isMatch = true;

    for (var element in filterFeatures) {
      if (filterFeatures[element]) {
        if (!currentFeatures.includes(element)) {
          isMatch = false;
          break;
        }
      }
    }
    return isMatch;
  };

  var checkAll = function (element, filterState) {
    if (!matchType(element.offer.type, filterState.type)) {
      return false;
    }
    if (!matchPrice(element.offer.price, filterState.price)) {
      return false;
    }
    if (!matchRoomsNumber(element.offer.rooms, filterState.rooms)) {
      return false;
    }
    if (!matchGuestsNumber(element.offer.guests, filterState.guests)) {
      return false;
    }
    if (!matchFeatures(element.offer.features, filterState.features)) {
      return false;
    }

    return true;
  };
  // Экспорты:
  window.filters = {
    checkAll: checkAll
  };

})();
