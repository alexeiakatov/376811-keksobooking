'use strict';

(function () {
  var ESC_KEY_CODE = 27;
  var HOUSING_PHOTO_WIDTH = 100;
  var HOUSING_PHOTO_HEIGHT = 100;

  var TYPE_FLAT_RUS = 'Квартира';
  var TYPE_HOUSE_RUS = 'Дом';
  var TYPE_BUNGALO_RUS = 'Бунгало';
  var TYPE_PALACE_RUS = 'Дворец';

  var TYPE_FLAT_ENG = 'flat';
  var TYPE_HOUSE_ENG = 'house';
  var TYPE_BUNGALO_ENG = 'bungalo';
  var TYPE_PALACE_ENG = 'palace';

  var offerCardElement;
  var documentEscPressedHandler;

  var templateContent = document.querySelector('template').content;
  var listItemTemplate = templateContent.querySelector('.popup__pictures > li');

  var titleElement;
  var addressElement;
  var priceElement;
  var typeElement;
  var roomsAndGuestsElement;
  var checkinAndcheckoutElement;
  var featuresElement;
  var descriptionElement;
  var photosElement;
  var avatarElement;
  var offerCardCloseButtonElement;

  // private ФУНКЦИЯ: Возвращает строку-тип жилья на русском языке.
  var getHousingTypeInRussian = function (offerTypeInEnglish) {
    var housingTypeInRussian;
    switch (offerTypeInEnglish) {
      case TYPE_FLAT_ENG:
        housingTypeInRussian = TYPE_FLAT_RUS;
        break;
      case TYPE_HOUSE_ENG:
        housingTypeInRussian = TYPE_HOUSE_RUS;
        break;
      case TYPE_BUNGALO_ENG:
        housingTypeInRussian = TYPE_BUNGALO_RUS;
        break;
      case TYPE_PALACE_ENG:
        housingTypeInRussian = TYPE_PALACE_RUS;
        break;
      default :
        housingTypeInRussian = offerTypeInEnglish;
        break;
    }

    return housingTypeInRussian;
  };

  // private ФУНКЦИЯ: устанавливает в DOM-шаблоне объявления  фактические фичи в соответствии с данными в js-объекте объявления
  var setActualFeatures = function (featuresInDataObject) {
    var featuresInDom = featuresElement.children;
    var identifier;

    featuresInDom.forEach(function (element) {
      identifier = element.classList[1].split('--')[1];
      element.classList.toggle('hidden', !featuresInDataObject.includes(identifier));
    });
  };

  // private ФУНКЦИЯ: устанавливает изображения в DOM-элементе объявления, которые берет из js-объекта объявления
  var setPictures = function (photosInDataObject) {
    var fragment = document.createDocumentFragment();

    var newListItemElement;
    var nestedImageElement;

    photosInDataObject.forEach(function (element) {
      newListItemElement = listItemTemplate.cloneNode(true);
      nestedImageElement = newListItemElement.querySelector('img');
      nestedImageElement.src = element;
      nestedImageElement.width = HOUSING_PHOTO_WIDTH;
      nestedImageElement.height = HOUSING_PHOTO_HEIGHT;
      fragment.appendChild(newListItemElement);
    });

    photosElement.innerHTML = '';
    photosElement.appendChild(fragment);
  };

  // private ФУНКЦИЯ: Возвращает DOM-элемент объявления, созданный на основании шаблона <template> (который в конце index.html) и
  // заполненный данными из объекта offerData. Возвращаемый элемент готов для вставки на страницу.
  var setDataInDomOfferElement = function (offerData) {
    // title
    titleElement.textContent = offerData.offer.title;

    // address
    addressElement.textContent = offerData.offer.address;

    // price
    priceElement.textContent = offerData.offer.price + ' ' + '\u20BD/ночь';

    // housing type
    typeElement.textContent = getHousingTypeInRussian(offerData.offer.type);

    // rooms and guests
    roomsAndGuestsElement.textContent = offerData.offer.rooms + ' комнаты для ' + offerData.offer.guests + ' гостей';

    // checkIn, checkOut
    checkinAndcheckoutElement.textContent = 'Заезд после ' + offerData.offer.checkin + ', выезд до ' + offerData.offer.checkout;

    // features
    setActualFeatures(offerData.offer.features);

    // description
    descriptionElement.textContent = offerData.offer.description;

    // photos of housing
    setPictures(offerData.offer.photos);

    // avatar
    avatarElement.src = offerData.author.avatar;

    offerCardElement.classList.remove('hidden');

    // если нет установленного обработчика нажатия Esc на document - устанавливает его
    // это нужно для того, чтоб если было сделано переключение на следующий пин без предварительного закрытия
    // карты предложения
    if (!documentEscPressedHandler) {
      setDocumentEscListener();
    }
  };

  // ФУНКЦИЯ: вычисяет все ссылки на dom-элементы внутри карточки предложения
  var findElementsInOfferCard = function () {
    if (offerCardElement) {
      titleElement = offerCardElement.querySelector('h3');
      addressElement = offerCardElement.querySelector('p > small');
      priceElement = offerCardElement.querySelector('.popup__price');
      typeElement = offerCardElement.querySelector('h4');
      roomsAndGuestsElement = offerCardElement.querySelector('p:nth-child(7)');
      checkinAndcheckoutElement = offerCardElement.querySelector('p:nth-child(8)');
      featuresElement = offerCardElement.querySelector('.popup__features');
      descriptionElement = offerCardElement.querySelector('p:nth-child(10)');
      photosElement = offerCardElement.querySelector('.popup__pictures');
      avatarElement = offerCardElement.querySelector('.popup__avatar');
      offerCardCloseButtonElement = offerCardElement.querySelector('.popup__close');
    }
  };

  // public ФУНКЦИЯ: создает dom-элемент объявления, добавляет ему обработчик закрытия по клику на крестик и вставляет этот элемент
  // на страницу.
  var createDomOfferCard = function () {
    // создать из <template> dom-элемент для карточки предложения и добавить ему классы offerCard и hidden.
    offerCardElement = templateContent.querySelector('.map__card').cloneNode(true);
    offerCardElement.classList.add('hidden');

    // создать ссылки на все необходимые dom-элементы внутри offerCardElement
    findElementsInOfferCard();

    // установить для dom-элемента offerCard обработчик события на клик по крестику
    offerCardCloseButtonElement.addEventListener('click', function () {
      offerCardElement.classList.add('hidden');
      window.pin.removeActive();
      removeDocumentEscListener();
    });

    // вставить созданный dom-элемент offerCard на страницу
    var mapContainerElement = document.querySelector('.map');
    mapContainerElement.insertBefore(offerCardElement, mapContainerElement.querySelector('.map__filters-container'));
  };

  // ФУНКЦИЯ: устанавливает на document обработчик нажатия Esc.
  var setDocumentEscListener = function () {
    documentEscPressedHandler = function (evt) {
      if (evt.keyCode === ESC_KEY_CODE) {
        window.pin.removeActive();
        offerCardElement.classList.add('hidden');
        removeDocumentEscListener();
      }
    };

    document.addEventListener('keydown', documentEscPressedHandler);
  };

  // ФУНКЦИЯ: удаляет у document обработчик нажатия Esc
  var removeDocumentEscListener = function () {
    document.removeEventListener('keydown', documentEscPressedHandler);
    documentEscPressedHandler = null;
  };

  // ФУНКЦИЯ: скрывает карту предложения, убирает обработчик нажатия Esc у document
  var hide = function () {
    window.pin.removeActive();
    offerCardElement.classList.add('hidden');
    removeDocumentEscListener();
  };

  // Экспорты:
  window.card = {
    setDataInDomOfferElement: setDataInDomOfferElement,
    hide: hide
  };

  createDomOfferCard();

})();
