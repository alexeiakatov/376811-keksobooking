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
    var filterGuests = parseInt(filterGuestsNumber, 10);

    return currentGuestsNumber === filterGuests;
  };


  // ФУНКЦИЯ: проверка соответствия фильтру фич
  var matchFeatures = function (currentFeatures, filterFeatures) {
    var isMatch = true;

    var identifier;
    for (var element in filterFeatures) {
      if (filterFeatures[element]) {
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
