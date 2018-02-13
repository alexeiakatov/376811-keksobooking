'use strict';

var USERS_AVATARS_LOCATION = 'img/avatars/';
var CURRENT_AVATAR_COUNT = 0;
var HOUSING_TYPES = ['flat', 'house', 'bungalo', 'palace'];
var TITLES = {
  flat: ['Большая уютная квартира', 'Маленькая неуютная квартира'],
  house: ['Красивый гостевой домик', 'Некрасивый негостеприимный домик'],
  bungalo: ['Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'],
  palace: ['Огромный прекрасный дворец', 'Маленький ужасный дворец']
};
var LOCATION_X_MIN = 300;
var LOCATION_X_MAX = 900;
var LOCATION_Y_MIN = 150;
var LOCATION_Y_MAX = 500;

var MIN_PRICE = 1000;
var MAX_PRICE = 1000000;

var MIN_ROOMS_COUNT = 1;
var MAX_ROOMS_COUNT = 5;

var MIN_GUESTS_COUNT = 1;
var MAX_GUESTS_COUNT = 10;

var CHECKIN_VARIANTS = ['12:00', '13:00', '14:00'];
var CHECKOUT_VARIANTS = ['12:00', '13:00', '14:00'];

var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

var ANNOUNCEMENTS_COUNT = 8;

var PIN_BUTTON_WIDTH = 40;
var PIN_BUTTON_HEIGHT = 40;

var ANNOUNCEMENT_CARD_TEMPLATE = document.querySelector('.announcementCardTemplate');


// ФУНКЦИЯ: Устанавливает значение параметра 'announcement.author.avatar' в объекте announcement.
var setAvatarInAnnouncement = function (announcement, avatarsLocation, currentAvatarCount) {
  var avatarPath = avatarsLocation + 'user0' + currentAvatarCount + '.png';

  announcement.author = {
    "avatar": avatarPath
  };
};

// ФУНКЦИЯ: Устанавливает значение параметра 'announcement.offer.type' в объекте announcement.
var setHousingTypeInAnnouncement = function (announcement, housingTypes) {
  var arrayLength = housingTypes.length;
  var housingTypeIndex =  window.utils.getRandomValue(0, arrayLength - 1, 0);

  var housingType = housingTypes[housingTypeIndex];
  announcement.offer.type = housingTypes[housingTypeIndex];
};

// ФУНКЦИЯ: Устанавливает значение параметра 'announcement.offer.title' в объекте announcement.
var setTitleInAnnouncement = function (announcement, titles) {
  var currentType = announcement.offer.type;
  var specificHousingTitlesArrayLength = titles[currentType].length;
  var housingTitleIndex = window.utils.getRandomValue(0, specificHousingTitlesArrayLength - 1, 0);

  var currentHousingTitle = titles[currentType][housingTitleIndex];
  announcement.offer.title = currentHousingTitle;
};

// ФУНКЦИЯ: Устанавливает значения параметров 'location.x' и 'location.y' в объекте announcement.
var setLocationXandYinAnnouncement = function (announcement, xMin, xMax, yMin, yMax) {
  announcement.location.x = window.utils.getRandomValue(xMin, xMax, 0);
  announcement.location.y = window.utils.getRandomValue(yMin, yMax, 0);
};

// ФУНКЦИЯ: Устанавливает значение свойства 'announcement.offer.address'
var setAddressInAnnouncement = function (announcement) {
  var address = announcement.location.x + ' ' + announcement.location.y;

  announcement.offer.address = address;
};

// ФУНКЦИЯ: Устанавливает значение свойства 'announcement.offer.price' в объекте announcement.
var setPriceInAnnouncement = function (announcement, minPrice, maxPrice){
  var currentPrice = window.utils.getRandomValue(minPrice, maxPrice, 0);
  announcement.offer.price = currentPrice;
};

// ФУНКЦИЯ: Устанваливает значение свойства 'announcement.offer.rooms' в объекте announcement.
var setRoomsCountInAnnouncement = function (announcement, minRooms, maxRooms){
  var currentRoomsCount = window.utils.getRandomValue(minRooms, maxRooms, 0);
  announcement.offer.rooms = currentRoomsCount;
};

// ФУНКЦИЯ: Устанавливает значение свойства 'announcement.offer.guests' в объекте announcement.
var setAvailableGuestsCountInAnnouncememnt = function (announcement, minGuests, maxGuests){
  var currentAvailableGuestsCount = window.utils.getRandomValue(minGuests, maxGuests, 0);
  announcement.offer.guests = currentAvailableGuestsCount;
};

// ФУНКЦИЯ: Устанваливает значение свойств 'announcement.offer.checkin' и 'announcement.offer.checkout' в объекте announcement.
var setCheckinAndCheckoutInAnnouncement = function (announcement, checkinVariants, checkoutVariants) {
  var currentCheckinIndex = window.utils.getRandomValue(0, checkinVariants.length - 1, 0);
  var currentCheckoutIndex = window.utils.getRandomValue(0, checkoutVariants.length - 1, 0);

  announcement.offer.checkin = checkoutVariants[currentCheckinIndex];
  announcement.offer.checkout = checkoutVariants[currentCheckoutIndex];
};

// ФУНКЦИЯ: Устанавливает значение свойства 'announcememnt.offer.photos'
var setFeaturesInAnnouncememnt = function (announcememnt, featuresArray){
  var resultFeaturesArray = [];

  for (var i = 0; i < featuresArray.length; i++){
    if(window.utils.getRandomValue(0, 1, 0)){
      resultFeaturesArray.push(featuresArray[i]);
    }
  }

  announcememnt.offer.features = resultFeaturesArray;
};

// ФУНКЦИЯ: Устанавливает значение свойства 'announcement.offer.photos' в объекте announcement.
var setPhotosInAnnouncememnt = function (announcement, photosArray){
  var resultArray = [];

  // копирвоание переданного массива
  for(var i = 0; i < photosArray.length; i++){
    resultArray.push(photosArray[i]);
  }

  // создание случайного порядка фотографий в массиве
  var randomIndex;
  for(var i = 0; i < resultArray.length; i++){
    randomIndex = window.utils.getRandomValue(0, resultArray.length - 1, 0);
    if(randomIndex !== i){
      var temp = resultArray[i];
      resultArray[i] = resultArray[randomIndex];
      resultArray[randomIndex] = temp;
    }
  }

  announcement.offer.photos = resultArray;
};

// ФУНКЦИЯ: Собирает объект announcement.
var compileAnnouncement = function(){
  var announcement = {
    'author': {
      'avatar': null
    },
    'offer': {
      'title': null,
      'address': null,
      'price': null,
      'type': null,
      'rooms': null,
      'guests': null,
      'checkin': null,
      'checkout': null,
      'features': null,
      'description': null,
      'photos': null
    },
    'location': {
      'x': null,
      'y': null
    }
  };

  setAvatarInAnnouncement(announcement, USERS_AVATARS_LOCATION, ++CURRENT_AVATAR_COUNT);
  setHousingTypeInAnnouncement(announcement, HOUSING_TYPES);
  setTitleInAnnouncement(announcement,TITLES);
  setLocationXandYinAnnouncement(announcement, LOCATION_X_MIN, LOCATION_X_MAX, LOCATION_Y_MIN, LOCATION_Y_MAX);
  setAddressInAnnouncement(announcement);
  setPriceInAnnouncement(announcement, MIN_PRICE, MAX_PRICE);
  setRoomsCountInAnnouncement(announcement, MIN_ROOMS_COUNT, MAX_ROOMS_COUNT);
  setAvailableGuestsCountInAnnouncememnt(announcement, MIN_GUESTS_COUNT, MAX_GUESTS_COUNT);
  setCheckinAndCheckoutInAnnouncement(announcement, CHECKIN_VARIANTS, CHECKOUT_VARIANTS);
  setFeaturesInAnnouncememnt(announcement, FEATURES);
  setPhotosInAnnouncememnt(announcement, PHOTOS);

  // Место для метода для установки значения announcement.offer.description

  setPhotosInAnnouncememnt(announcement, PHOTOS);

  return announcement;
};

// ФУНКЦИЯ: Создает DOM-элемент метки.
// возвращает настроенный и готовый для вставки DOM-элемент метки для карты
var createDOMPinForAnnouncement = function (announcement, pinButtonWidth, pinButtoHeight) {
  var actualXPosition = announcement.location.x - pinButtonWidth/2;
  var actualYPosition = announcement.location.y - pinButtoHeight;

  var button = document.createElement('button');
  var buttonStyleString = 'left:' + actualXPosition +'px; top:' + actualYPosition + 'px;';
  button.setAttribute('style', buttonStyleString);
  button.classList.add('map__pin');

  var image = document.createElement('img');
  image.src = announcement.author.avatar;
  image.width = pinButtonWidth;
  image.height = pinButtoHeight;
  image.setAttribute('draggable', 'false');

  button.appendChild(image);

  return button;
};

// ФУНКЦИЯ: Возвращает DOM-элемент объявления, созданный на основании шаблона <template class='announcementCardTemplate' и
// заполненный данными из объекта announcement.
var createDOMElementForAnnouncement = function(announcement, domTemplate){
  var announcementCard = domTemplate.content.cloneNode(true);

  // title
  announcementCard.querySelector('.cardTitle').textContent = announcement.offer.title;

  // address
  //??????????????????????

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
  announcementCard.querySelector('.housingType').textContent = housingTypeInRussian;

  // rooms and guests
  announcementCard.querySelector('.roomsAndGuests').textContent = announcement.offer.rooms + ' комнаты для ' + announcement.offer.guests + ' гостей';

  // checkIn, checkOut
  announcementCard.querySelector('.checkinAndOut').textContent = 'Заезд после ' + announcement.offer.checkin + ', выезд до ' + announcement.offer.checkout;

  // features
  //?????????????????????????

  // description
  announcementCard.querySelector('.description').textContent = announcement.offer.description;

  // pictures
  var picturesCount = announcement.offer.photos.length;
  var fragment = document.createDocumentFragment();
  var listElementTemplateForPicture = announcementCard.querySelector('.imageListItem');
  var newListItem;
  var currentImage;
  for(var i = 0; i < picturesCount; i++){
    newListItem = listElementTemplateForPicture.cloneNode(true);
    currentImage = newListItem.querySelector('.announcmentImage');
    currentImage.src = announcement.offer.photos[i];
    currentImage.width = '50px';
    currentImage.height = '50px';
    fragment.appendChild(newListItem);
  }
  announcementCard.removeChild(listTemplateElementForPicture);
  announcementCard.querySelector('.popup__pictures').appendChild(fragment);

  // avatar
  announcementCard.querySelector('.popup__avatar').src = announcement.author.avatar;

};




var main = function(){
  var announcements = [];
  for(var i = 0; i < ANNOUNCEMENTS_COUNT ; i++){
    announcements.push(compileAnnouncement());
  }

  var map = document.querySelector('.map--faded');
  map.classList.remove('map--faded');

  var fragment = document.createDocumentFragment();

  var newPin;
  for (i = 0; i < announcements.length; i++) {
    newPin = createDOMPinForAnnouncement(announcements[i], PIN_BUTTON_WIDTH, PIN_BUTTON_HEIGHT);
    fragment.appendChild(newPin);
  }

  var pinsContainer = document.querySelector('.map__pins');
  pinsContainer.appendChild(fragment);

  // создать и заполнить DOM-элемент объявления




};
