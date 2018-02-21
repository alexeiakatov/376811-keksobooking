'use strict';
// создает dom-элемент объявления, заполняет данными из полученного объекта offerData и отрисовывает на странице
// экспортирует в глобальную область функцию: createDomOfferCard

(function () {
  var ESC_KEY_CODE = 27;
  var activeOfferCard = null;
  var documentEscPressedHandler = null;

  var TITLE;
  var ADDRESS;
  var PRICE;
  var TYPE;
  var ROOMS_AND_GUESTS;
  var CHECKIN_AND_CHECKOUT;
  var FEATURES;
  var DESCRIPTION;
  var PHOTOS;
  var AVATAR;
  var OFFER_CARD_CLOSE_BUTTON;

  // private ФУНКЦИЯ: Возвращает строку-тип жилья на русском языке.
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

  // private ФУНКЦИЯ: в DOM-шаблоне объявления устанавливает фактические фичи в соответствии с данными в js-объекте объявления
  var setActualFeatures = function (featuresInDataObject) {
    var featuresInDom = FEATURES.children;
    var identifier;

    for (var i = 0; i < featuresInDom.length; i++) {
      identifier = featuresInDom[i].classList[1].split('--')[1];
      featuresInDom[i].classList.toggle('hidden', !featuresInDataObject.includes(identifier));
    }
  };

  // private ФУНКЦИЯ: устанавливает изображения в DOM-элементе объявления, которые берет из js-объекта объявления
  var setPictures = function (photosInDataObject) {
    var picturesCount = photosInDataObject.length;
    var fragment = document.createDocumentFragment();
    var listItemTemplate = document.querySelector('template').content.querySelector('.popup__pictures > li');
    var newListItem;
    var nestedImage;
    for (var i = 0; i < picturesCount; i++) {
      newListItem = listItemTemplate.cloneNode(true);
      nestedImage = newListItem.querySelector('img');
      nestedImage.src = photosInDataObject[i];
      nestedImage.width = 100;
      nestedImage.height = 100;
      fragment.appendChild(newListItem);
    }
    PHOTOS.innerHTML = '';
    PHOTOS.appendChild(fragment);
  };

  // private ФУНКЦИЯ: Возвращает DOM-элемент объявления, созданный на основании шаблона <template> (который в конце index.html) и
  // заполненный данными из объекта offerData. Возвращаемый элемент готов для вставки на страницу.
  var setDataInDomOfferCard = function (offerData) {
    // title *
    TITLE.textContent = offerData.offer.title;

    // address *
    ADDRESS.textContent = offerData.offer.address;

    // price *
    PRICE.innerHTML = offerData.offer.price + ' &#x20bd;/ночь';

    // housing type *
    TYPE.textContent = getHousingTypeInRussian(offerData.offer.type);

    // rooms and guests *
    ROOMS_AND_GUESTS.textContent = offerData.offer.rooms + ' комнаты для ' + offerData.offer.guests + ' гостей';

    // checkIn, checkOut *
    CHECKIN_AND_CHECKOUT.textContent = 'Заезд после ' + offerData.offer.checkin + ', выезд до ' + offerData.offer.checkout;

    // features
    setActualFeatures(offerData.offer.features);

    // description
    DESCRIPTION.textContent = offerData.offer.description;

    // photos of housing
    setPictures(offerData.offer.photos);

    // avatar
    AVATAR.src = offerData.author.avatar;
  };

  // вычислить все ссылки на dom-элементы
  var findElementsInOfferCard = function () {
    if (activeOfferCard !== null) {
      TITLE = activeOfferCard.querySelector('h3');
      ADDRESS = activeOfferCard.querySelector('p > small');
      PRICE = activeOfferCard.querySelector('.popup__price');
      TYPE = activeOfferCard.querySelector('h4');
      ROOMS_AND_GUESTS = activeOfferCard.querySelector('p:nth-child(7)');
      CHECKIN_AND_CHECKOUT = activeOfferCard.querySelector('p:nth-child(8)');
      FEATURES = activeOfferCard.querySelector('.popup__features');
      DESCRIPTION = activeOfferCard.querySelector('p:nth-child(10)');
      PHOTOS = activeOfferCard.querySelector('.popup__pictures');
      AVATAR = activeOfferCard.querySelector('.popup__avatar');
      OFFER_CARD_CLOSE_BUTTON = activeOfferCard.querySelector('.popup__close');
    }
  };

  // public ФУНКЦИЯ: создает (если его еще нет) dom-элемент объявления, заполняет его данными и вставляет на страницу.
  var createDomOfferCard = function (offerData) {
    if (activeOfferCard === null) {
      // создать из <template> dom-элемент для карточки предложения и добавить ему классы offerCard и hidden.
      var template = document.querySelector('template').content.cloneNode(true);
      activeOfferCard = document.createElement('div');
      activeOfferCard.classList.add('offerCard');
      activeOfferCard.classList.add('hidden');
      activeOfferCard.appendChild(template);
      // создать ссылки на все необходимые dom-элементы внутри offerCard
      findElementsInOfferCard();

      // установить для dom-элемента offerCard обработчик события на клик по крестику
      OFFER_CARD_CLOSE_BUTTON.addEventListener('click', function (evt) {
        activeOfferCard.classList.add('hidden');
        window.removeActivePin();
        removeDocumentEscListener();
      });

      // вставить созданный dom-элемент offerCard на страницу
      var container = document.querySelector('.map');
      container.insertBefore(activeOfferCard, container.querySelector('.map__filters-container'));
    }

    setDataInDomOfferCard(offerData);
    activeOfferCard.classList.remove('hidden');

    // если нет установленного обработчика нажатия Esc на document - устанавливает его
    // это нужно для того, чтоб если было сделано переключение на следующий пин без предварительного закрытия
    // карты предложения
    if (documentEscPressedHandler === null) {
      setDocumentEscListener();
    }
  };

  // установить на document обработчик нажатия Esc.
  var setDocumentEscListener = function () {
    documentEscPressedHandler = function (evt) {
      if (evt.keyCode === ESC_KEY_CODE) {
        window.removeActivePin();
        activeOfferCard.classList.add('hidden');
        removeDocumentEscListener();
      }
    };

    document.addEventListener('keydown', documentEscPressedHandler);
  };

  // удалить у document обработчик нажатия Esc
  var removeDocumentEscListener = function () {
    document.removeEventListener('keydown', documentEscPressedHandler);
    documentEscPressedHandler = null;
  };

  // ЭКСПОРТ функции createDomOfferCard
  window.createDomOfferCard = createDomOfferCard;

})();
