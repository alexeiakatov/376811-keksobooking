'use strict';

var ANNOUNCEMENTS_COUNT = 8;
var PIN_BUTTON_WIDTH = 40;
var PIN_BUTTON_HEIGHT = 40;
var ANNOUNCEMENT_CARD_TEMPLATE = document.querySelector('template');

// ФУНКЦИЯ: Возвращает значение для свойства 'announcement.offer.type'.
var getHousingType = function (housingTypes) {
  var randomIndex = window.utils.getRandomValue(0, housingTypes.length - 1, 0);
  return housingTypes[randomIndex];
};

// ФУНКЦИЯ: Возвращает значение для свойства 'announcement.offer.title'.
var getTitle = function (currentHousingType, titles) {
  var randomIndex = window.utils.getRandomValue(0, titles[currentHousingType].length - 1, 0);
  return titles[currentHousingType][randomIndex];
};

// ФУНКЦИЯ: Возвращает значение свойства 'announcememnt.offer.features'
var getFeaturesArray = function (basicFeaturesArray) {
  var resultFeaturesArray = [];

  for (var i = 0; i < basicFeaturesArray.length; i++) {
    if (window.utils.getRandomValue(0, 1, 0)) {
      resultFeaturesArray.push(basicFeaturesArray[i]);
    }
  }

  return resultFeaturesArray;
};

// ФУНКЦИЯ: Возвращает значение свойства 'announcement.offer.photos'.
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

// ФУНКЦИЯ: Собирает объект announcement.
var createAnnouncement = function (dataObject) {
  var announcement = {
    'author': {
      'avatar': dataObject.USERS_AVATARS_LOCATION + 'user0' + dataObject.currentAvatarCount + '.png'
    },
    'location': {
      'x': window.utils.getRandomValue(dataObject.LOCATION_X_MIN, dataObject.LOCATION_X_MAX, 0),
      'y': window.utils.getRandomValue(dataObject.LOCATION_Y_MIN, dataObject.LOCATION_Y_MAX, 0)
    },
    'offer': {
      'type': getHousingType(dataObject.HOUSING_TYPES),
      'title': null,
      'address': null,
      'price': window.utils.getRandomValue(dataObject.MIN_PRICE, dataObject.MAX_PRICE, 0),
      'rooms': window.utils.getRandomValue(dataObject.MIN_ROOMS_COUNT, dataObject.MAX_ROOMS_COUNT, 0),
      'guests': window.utils.getRandomValue(dataObject.MIN_GUESTS_COUNT, dataObject.MAX_GUESTS_COUNT, 0),
      'checkin': dataObject.CHECKIN_VARIANTS[window.utils.getRandomValue(0, dataObject.CHECKIN_VARIANTS.length - 1, 0)],
      'checkout': dataObject.CHECKOUT_VARIANTS[window.utils.getRandomValue(0, dataObject.CHECKOUT_VARIANTS.length - 1, 0)],
      'features': getFeaturesArray(dataObject.FEATURES),
      'description': dataObject.DESCRIPTION,
      'photos': getPhotosArray(dataObject.PHOTOS)
    }
  };
  announcement.offer.title = getTitle(announcement.offer.type, dataObject.TITLES);
  announcement.offer.address = announcement.location.x + ' ' + announcement.location.y;

  return announcement;
};

// ФУНКЦИЯ: Создает DOM-элемент метки.
// возвращает настроенный и готовый для вставки DOM-элемент метки для карты
var createDOMPinForAnnouncement = function (announcement, pinButtonWidth, pinButtonHeight) {
  var actualXPosition = announcement.location.x - pinButtonWidth / 2;
  var actualYPosition = announcement.location.y - pinButtonHeight;

  var button = document.createElement('button');
  var buttonStyleString = 'left:' + actualXPosition + 'px; top:' + actualYPosition + 'px;';
  button.setAttribute('style', buttonStyleString);
  button.classList.add('map__pin');

  var image = document.createElement('img');
  image.src = announcement.author.avatar;
  image.width = pinButtonWidth;
  image.height = pinButtonHeight;
  image.setAttribute('draggable', 'false');

  button.appendChild(image);

  return button;
};

// ФУНКЦИЯ: Возвращает DOM-элемент объявления, созданный на основании шаблона <template> (который в конце index.html) и
// заполненный данными из объекта announcement.
var createDOMElementForAnnouncement = function (announcement, domTemplate) {
  var announcementCard = domTemplate.content.cloneNode(true);
  // title
  announcementCard.querySelector('h3').textContent = announcement.offer.title;
  // address
  announcementCard.querySelector('p > small').textContent = announcement.offer.address;
  // price
  announcementCard.querySelector('.popup__price').textContent = announcement.offer.price + '&#x20bd;/ночь';
  // housing type
  var housingTypeInRussian;
  switch (announcement.offer.type) {
    case 'flat':
      housingTypeInRussian = 'Квартира'; break;
    case 'house':
      housingTypeInRussian = 'Дом'; break;
    case 'bungalo':
      housingTypeInRussian = 'Бунгало'; break;
    case 'palace':
      housingTypeInRussian = 'Дворец'; break;
  }
  announcementCard.querySelector('h4').textContent = housingTypeInRussian;
  // rooms and guests
  announcementCard.querySelector('p:nth-child(7)').textContent = announcement.offer.rooms + ' комнаты для ' + announcement.offer.guests + ' гостей';
  // checkIn, checkOut
  announcementCard.querySelector('p:nth-child(8)').textContent = 'Заезд после ' + announcement.offer.checkin + ', выезд до ' + announcement.offer.checkout;
  // features
  var featurecContainer = announcementCard.querySelector('.popup__features');
  var featuresInDOMArray = featurecContainer.children;
  var isItemToDelete;
  for (var i = featuresInDOMArray.length - 1; i > -1; i--) {
    var identifier = featuresInDOMArray[i].className.split('--')[1];
    isItemToDelete = true;
    for (var j = 0; j < announcement.offer.features.length; j++) {
      if (identifier === announcement.offer.features[j]) {
        isItemToDelete = false;
        break;
      }
    }
    if (isItemToDelete) {
      featuresInDOMArray[i].parentNode.removeChild(featuresInDOMArray[i]);
    }
  }
  // description
  announcementCard.querySelector('p:nth-child(10)').textContent = announcement.offer.description;
  // pictures
  var picturesCount = announcement.offer.photos.length;
  var fragment = document.createDocumentFragment();
  var listItemTemplate = announcementCard.querySelector('.popup__pictures > li');
  var newListItem;
  var nestedImage;
  for (i = 0; i < picturesCount; i++) {
    newListItem = listItemTemplate.cloneNode(true);
    nestedImage = newListItem.querySelector('img');
    nestedImage.src = announcement.offer.photos[i];
    nestedImage.width = 100;
    nestedImage.height = 100;
    fragment.appendChild(newListItem);
  }
  listItemTemplate.parentNode.removeChild(listItemTemplate);
  announcementCard.querySelector('.popup__pictures').appendChild(fragment);
  // avatar
  announcementCard.querySelector('.popup__avatar').src = announcement.author.avatar;
  return announcementCard;

};

var main = function () {
  // создание массива js-объектов объявлений
  var announcements = [];
  for (var i = 0; i < ANNOUNCEMENTS_COUNT; i++) {
    ++window.myDataObjectMock.currentAvatarCount;
    announcements.push(createAnnouncement(window.myDataObjectMock));
  }

  // сделать карту доступной для работы с ней
  var map = document.querySelector('.map--faded');
  map.classList.remove('map--faded');

  // создание documentFragment содержащий все метки-пины для карты
  var fragmentForPins = document.createDocumentFragment();
  var newPin;
  for (i = 0; i < announcements.length; i++) {
    newPin = createDOMPinForAnnouncement(announcements[i], PIN_BUTTON_WIDTH, PIN_BUTTON_HEIGHT);
    fragmentForPins.appendChild(newPin);
  }

  // вставка меток-пинов на карту
  var pinsContainer = document.querySelector('.map__pins');
  pinsContainer.appendChild(fragmentForPins);

  // создание и заполнение DOM-элементов объявлений
  var fragment = document.createDocumentFragment();
  var domElementForAnnouncement;

  for (i = 0; i < announcements.length; i++) {
    domElementForAnnouncement = createDOMElementForAnnouncement(announcements[i], ANNOUNCEMENT_CARD_TEMPLATE);
    fragment.appendChild(domElementForAnnouncement);
  }

  var container = document.querySelector('.map');
  container.insertBefore(fragment, container.querySelector('.map__filters-container'));

};

main();
