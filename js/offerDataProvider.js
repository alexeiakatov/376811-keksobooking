'use strict';
// требует window.offerDataTemplate в качестве заготовки данных для создаваемых объявлений
// создает массив js-объектов, содержащих данные объявлений
// экспортирует в глобальную область функции:
//    1.getAnnouncementData которая возвращает js-данные конкретного объявления по его id;
//    2.getAllAnnouncements которая возвращает сразу весь массив js-объектов объявлений.

(function () {
  var ANNOUNCEMENTS_COUNT = 8;
  var ANNOUNCEMENTS = [];
  var currentId = 0;


  // private ФУНКЦИЯ: Возвращает значение для свойства 'announcement.offer.type'.
  var getHousingType = function (housingTypes) {
    var randomIndex = window.utils.getRandomValue(0, housingTypes.length - 1, 0);
    return housingTypes[randomIndex];
  };

  // private ФУНКЦИЯ: Возвращает значение для свойства 'announcement.offer.title'.
  var getTitle = function (currentHousingType, titles) {
    var randomIndex = window.utils.getRandomValue(0, titles[currentHousingType].length - 1, 0);
    return titles[currentHousingType][randomIndex];
  };

  // private ФУНКЦИЯ: Возвращает значение свойства 'announcememnt.offer.features'
  var getFeaturesArray = function (basicFeaturesArray) {
    var resultFeaturesArray = [];
    for (var i = 0; i < basicFeaturesArray.length; i++) {
      if (window.utils.getRandomValue(0, 1, 0)) {
        resultFeaturesArray.push(basicFeaturesArray[i]);
      }
    }
    return resultFeaturesArray;
  };

  // private ФУНКЦИЯ: Возвращает значение свойства 'announcement.offer.photos'.
  var getPhotosArray = function (basicPhotosArray) {
    var resultArray = [];

    // копирвоание переданного массива
    for (var i = 0; i < basicPhotosArray.length; i++) {
      resultArray.push(basicPhotosArray[i]);
    }

    // создание случайного порядка фотографий в массиве
    var randomIndex;
    for (i = 0; i < resultArray.length; i++) {
      randomIndex = window.utils.getRandomValue(0, resultArray.length - 1, 0);
      if (randomIndex !== i) {
        var temp = resultArray[i];
        resultArray[i] = resultArray[randomIndex];
        resultArray[randomIndex] = temp;
      }
    }

    return resultArray;
  };

  // private ФУНКЦИЯ: Собирает js-объект announcement из dataObjectTemplate
  var createAnnouncement = function (dataObjectTemplate) {
    var id = ++currentId;
    var offerType = getHousingType((dataObjectTemplate.HOUSING_TYPES));
    var locationX = window.utils.getRandomValue(dataObjectTemplate.LOCATION_X_MIN, dataObjectTemplate.LOCATION_X_MAX, 0);
    var locationY = window.utils.getRandomValue(dataObjectTemplate.LOCATION_Y_MIN, dataObjectTemplate.LOCATION_Y_MAX, 0);

    return {
      'id': id,
      'author': {
        'avatar': dataObjectTemplate.USERS_AVATARS_LOCATION + 'user0' + id + '.png'
      },
      'location': {
        'x': locationX,
        'y': locationY
      },
      'offer': {
        'type': offerType,
        'title': getTitle(offerType, dataObjectTemplate.TITLES),
        'address': locationX + ' ' + locationY,
        'price': window.utils.getRandomValue(dataObjectTemplate.MIN_PRICE, dataObjectTemplate.MAX_PRICE, 0),
        'rooms': window.utils.getRandomValue(dataObjectTemplate.MIN_ROOMS_COUNT, dataObjectTemplate.MAX_ROOMS_COUNT, 0),
        'guests': window.utils.getRandomValue(dataObjectTemplate.MIN_GUESTS_COUNT, dataObjectTemplate.MAX_GUESTS_COUNT, 0),
        'checkin': dataObjectTemplate.CHECKIN_VARIANTS[window.utils.getRandomValue(0, dataObjectTemplate.CHECKIN_VARIANTS.length - 1, 0)],
        'checkout': dataObjectTemplate.CHECKOUT_VARIANTS[window.utils.getRandomValue(0, dataObjectTemplate.CHECKOUT_VARIANTS.length - 1, 0)],
        'features': getFeaturesArray(dataObjectTemplate.FEATURES),
        'description': dataObjectTemplate.DESCRIPTION,
        'photos': getPhotosArray(dataObjectTemplate.PHOTOS)
      }
    };
  };

  // private ФУНКЦИЯ: Создает массив js-бъектов, содержащих данные объявлений
  var createAnnouncementsMocks = function () {
    for (var i = 0; i < ANNOUNCEMENTS_COUNT; i++) {
      ANNOUNCEMENTS.push(createAnnouncement(window.offerDataTemplate));
    }
  };

  // public функция для получения данных конкретного объявления
  var getAnnouncementDataById = function (id) {
    var receivedId = parseInt(id, 10);
    var result;
    for (var i = 0; i < ANNOUNCEMENTS.length; i++) {
      if (ANNOUNCEMENTS[i].id === receivedId) {
        result = ANNOUNCEMENTS[i];
        break;
      }
    }

    return result;
  };

  // public ФУНКЦИЯ: Возвращает весь массив js-объектов объявлений.
  var getAllAnnouncements = function () {
    return ANNOUNCEMENTS;
  };

  // создать массив js-объектов объявлений
  createAnnouncementsMocks();

  // ЭКСПОРТ функции getAnnouncementData
  window.getAnnouncementDataById = getAnnouncementDataById;

  // ЭКСПОРТ функции getAllAnnouncements
  window.getAllAnnouncements = getAllAnnouncements;

})();
