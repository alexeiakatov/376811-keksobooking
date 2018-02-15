'use strict';

var ANNOUNCEMENTS_COUNT = 8;
var PIN_BUTTON_WIDTH = 40;
var PIN_BUTTON_HEIGHT = 40;
var ANNOUNCEMENT_DOM_ELEMENT;


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
  var offerType = getHousingType((dataObject.HOUSING_TYPES));
  var locationX = window.utils.getRandomValue(dataObject.LOCATION_X_MIN, dataObject.LOCATION_X_MAX, 0);
  var locationY = window.utils.getRandomValue(dataObject.LOCATION_Y_MIN, dataObject.LOCATION_Y_MAX, 0);

  return {
    'author': {
      'avatar': dataObject.USERS_AVATARS_LOCATION + 'user0' + dataObject.currentAvatarCount + '.png'
    },
    'location': {
      'x': locationX,
      'y': locationY
    },
    'offer': {
      'type': offerType,
      'title': getTitle(offerType, dataObject.TITLES),
      'address': locationX + ' ' + locationY,
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
var setDataInDomAnnouncement = function (offerData, domAnnouncement) {
  // title
  domAnnouncement.querySelector('h3').textContent = offerData.offer.title;

  // address
  domAnnouncement.querySelector('p > small').textContent = offerData.offer.address;

  // price
  domAnnouncement.querySelector('.popup__price').innerHTML = offerData.offer.price + ' &#x20bd;/ночь';

  // housing type
  domAnnouncement.querySelector('h4').textContent = getHousingTypeInRussian(offerData.offer.type);

  // rooms and guests
  domAnnouncement.querySelector('p:nth-child(7)').textContent = offerData.offer.rooms + ' комнаты для ' + offerData.offer.guests + ' гостей';

  // checkIn, checkOut
  domAnnouncement.querySelector('p:nth-child(8)').textContent = 'Заезд после ' + offerData.offer.checkin + ', выезд до ' + offerData.offer.checkout;

  // features
  setActualFeatures(domAnnouncement, offerData.offer.features);

  // description
  domAnnouncement.querySelector('p:nth-child(10)').textContent = offerData.offer.description;

  // pictures
  setPictures(domAnnouncement, offerData.offer.photos);

  // avatar
  domAnnouncement.querySelector('.popup__avatar').src = offerData.author.avatar;
};

// ФУНКЦИЯ: в DOM-шаблоне объявления устанавливает фактические фичи в соответствии с данными в js-объекте объявления
var setActualFeatures = function (domAnnouncement, featuresInAnnouncement) {
  var featurecContainer = domAnnouncement.querySelector('.popup__features');
  var featuresInDom = featurecContainer.children;
  var identifier;

  for (var i = 0; i < featuresInDom.length; i++) {
    identifier = featuresInDom[i].classList[1].split('--')[1];
    // showArrayState(featuresInDom);
    if (featuresInAnnouncement.includes(identifier)) {
      featuresInDom[i].classList.toggle('hidden', false);
    } else {
      featuresInDom[i].classList.toggle('hidden', true);
    }
  }
};

// ФУНКЦИЯ: устанавливает изображения в DOM-шаблон объявления, которые берет из js-объекта объявления
var setPictures = function (announcementCard, photosInAnnouncement) {
  var picturesCount = photosInAnnouncement.length;
  var fragment = document.createDocumentFragment();
  var listItemTemplate = announcementCard.querySelector('.popup__pictures > li');
  var newListItem;
  var nestedImage;
  for (var i = 0; i < picturesCount; i++) {
    newListItem = listItemTemplate.cloneNode(true);
    nestedImage = newListItem.querySelector('img');
    nestedImage.src = photosInAnnouncement[i];
    nestedImage.width = 100;
    nestedImage.height = 100;
    fragment.appendChild(newListItem);
  }
  listItemTemplate.parentNode.removeChild(listItemTemplate);
  announcementCard.querySelector('.popup__pictures').appendChild(fragment);
};

// ФУНКЦИЯ: Возвращает строку-тип жилья на русском языке.
var getHousingTypeInRussian = function (type) {
  var housingTypeInRussian;
  switch (type) {
    case 'flat':
      housingTypeInRussian = 'Квартира'; break;
    case 'house':
      housingTypeInRussian = 'Дом'; break;
    case 'bungalo':
      housingTypeInRussian = 'Бунгало'; break;
    case 'palace':
      housingTypeInRussian = 'Дворец'; break;
    default :
      housingTypeInRussian = type;
      break;
  }

  return housingTypeInRussian;
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

  // создание DOM-элемента объявления
  var template = document.querySelector('template').content.cloneNode(true);
  ANNOUNCEMENT_DOM_ELEMENT = document.createElement('div');
  ANNOUNCEMENT_DOM_ELEMENT.classList.add('announcementCard');
  ANNOUNCEMENT_DOM_ELEMENT.appendChild(template);

  var container = document.querySelector('.map');
  container.insertBefore(ANNOUNCEMENT_DOM_ELEMENT, container.querySelector('.map__filters-container'));

  setDataInDomAnnouncement(announcements[0], ANNOUNCEMENT_DOM_ELEMENT);

};

main();
