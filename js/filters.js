'use strict';

(function () {

  // private ФУНКЦИЯ: проверка соответствия фильтру типа жилья
  var matchType = function (currentType, filterType) {
    var isMatch = false;
    if (filterType === 'any') {
      isMatch = true;
    } else if (currentType === filterType) {
      isMatch = true;
    }
    return isMatch;
  };

  // private ФУНКЦИЯ: проверка соответствия фильтру цены
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

  // private ФУНКЦИЯ: проверка соответствия фильтру количества комнат
  var matchRoomsNumber = function (currentRoomsNumber, filterRoomsNumber) {
    var isMatch = false;

    if (filterRoomsNumber === 'any') {
      isMatch = true;
    } else if (parseInt(filterRoomsNumber, 10) === currentRoomsNumber) {
      isMatch = true;
    }
    return isMatch;
  };

  // private ФУНКЦИЯ: проверка соответствия фильтру количества гостей
  var matchGuestsNumber = function (currentGuestsNumber, filterGuestsNumber) {
    if (filterGuestsNumber === 'any') {
      return true;
    }
    var filterGuests = parseInt(filterGuestsNumber, 10);

    return currentGuestsNumber === filterGuests;
  };


  // private ФУНКЦИЯ: проверка соответствия фильтру фич
  var matchFeatures = function (currentFeatures, filterFeatures) {
    var isMatch = true;

    var identifier;
    for (var element in filterFeatures) {
      if (filterFeatures[element] === true) {
        identifier = element.split('-')[1];
        if (!window.utils.arrayContains(identifier, currentFeatures)) {
          isMatch = false;
          break;
        }
      }
    }
    return isMatch;
  };

  // Экспорты:
  window.filters = {};
  window.filters.matchType = matchType;
  window.filters.matchPrice = matchPrice;
  window.filters.matchRoomsNumber = matchRoomsNumber;
  window.filters.matchGuestsNumber = matchGuestsNumber;
  window.filters.matchFeatures = matchFeatures;

})();
