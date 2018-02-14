'use strict';

(function () {
  window.myDataObjectMock = {
    USERS_AVATARS_LOCATION: 'img/avatars/',
    currentAvatarCount: 0,
    HOUSING_TYPES: ['flat', 'house', 'bungalo', 'palace'],
    TITLES: {
      flat: ['Большая уютная квартира', 'Маленькая неуютная квартира'],
      house: ['Красивый гостевой домик', 'Некрасивый негостеприимный домик'],
      bungalo: ['Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'],
      palace: ['Огромный прекрасный дворец', 'Маленький ужасный дворец']
    },
    DESCRIPTION: '',
    LOCATION_X_MIN: 300,
    LOCATION_X_MAX: 900,
    LOCATION_Y_MIN: 150,
    LOCATION_Y_MAX: 500,

    MIN_PRICE: 1000,
    MAX_PRICE: 1000000,

    MIN_ROOMS_COUNT: 1,
    MAX_ROOMS_COUNT: 5,

    MIN_GUESTS_COUNT: 1,
    MAX_GUESTS_COUNT: 10,

    CHECKIN_VARIANTS: ['12:00', '13:00', '14:00'],
    CHECKOUT_VARIANTS: ['12:00', '13:00', '14:00'],

    FEATURES: ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'],
    PHOTOS: [
      'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
      'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
      'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
    ]
  };
})();
