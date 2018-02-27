'use strict';
// создает dom-элемент объявления, заполняет данными из полученного объекта offerData и отрисовывает на странице
// экспортирует в глобальную область функцию: createDomOfferCard

(function () {
  var ESC_KEY_CODE = 27;
  var activeOfferCard = null;
  var documentEscPressedHandler = null;

  var title;
  var address;
  var price;
  var type;
  var roomsAndGuests;
  var checkinAndcheckout;
  var features;
  var description;
  var photos;
  var avatar;
  var offerCardCloseButton;

  // private ФУНКЦИЯ: Возвращает строку-тип жилья на русском языке.
  var getHousingTypeInRussian = function (offerTypeInEnglish) {
    var housingTypeInRussian;
    switch (offerTypeInEnglish) {
      case 'flat':
        housingTypeInRussian = 'Квартира'; break;
      case 'house':
        housingTypeInRussian = 'Дом'; break;
      case 'bungalo':
        housingTypeInRussian = 'Бунгало'; break;
      case 'palace':
        housingTypeInRussian = 'Дворец'; break;
      default :
        housingTypeInRussian = offerTypeInEnglish;
        break;
    }

    return housingTypeInRussian;
  };

  // private ФУНКЦИЯ: в DOM-шаблоне объявления устанавливает фактические фичи в соответствии с данными в js-объекте объявления
  var setActualFeatures = function (featuresInDataObject) {
    var featuresInDom = features.children;
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
    photos.innerHTML = '';
    photos.appendChild(fragment);
  };

  // private ФУНКЦИЯ: Возвращает DOM-элемент объявления, созданный на основании шаблона <template> (который в конце index.html) и
  // заполненный данными из объекта offerData. Возвращаемый элемент готов для вставки на страницу.
  var setDataInDomOfferCard = function (offerData) {
    // title *
    title.textContent = offerData.offer.title;

    // address *
    address.textContent = offerData.offer.address;

    // price *
    price.innerHTML = offerData.offer.price + ' &#x20bd;/ночь';

    // housing type *
    type.textContent = getHousingTypeInRussian(offerData.offer.type);

    // rooms and guests *
    roomsAndGuests.textContent = offerData.offer.rooms + ' комнаты для ' + offerData.offer.guests + ' гостей';

    // checkIn, checkOut *
    checkinAndcheckout.textContent = 'Заезд после ' + offerData.offer.checkin + ', выезд до ' + offerData.offer.checkout;

    // features
    setActualFeatures(offerData.offer.features);

    // description
    description.textContent = offerData.offer.description;

    // photos of housing
    setPictures(offerData.offer.photos);

    // avatar
    avatar.src = offerData.author.avatar;

    activeOfferCard.classList.remove('hidden');

    // если нет установленного обработчика нажатия Esc на document - устанавливает его
    // это нужно для того, чтоб если было сделано переключение на следующий пин без предварительного закрытия
    // карты предложения
    if (documentEscPressedHandler === null) {
      setDocumentEscListener();
    }
  };

  // вычислить все ссылки на dom-элементы внутри карточки предложения
  var findElementsInOfferCard = function () {
    if (activeOfferCard !== null) {
      title = activeOfferCard.querySelector('h3');
      address = activeOfferCard.querySelector('p > small');
      price = activeOfferCard.querySelector('.popup__price');
      type = activeOfferCard.querySelector('h4');
      roomsAndGuests = activeOfferCard.querySelector('p:nth-child(7)');
      checkinAndcheckout = activeOfferCard.querySelector('p:nth-child(8)');
      features = activeOfferCard.querySelector('.popup__features');
      description = activeOfferCard.querySelector('p:nth-child(10)');
      photos = activeOfferCard.querySelector('.popup__pictures');
      avatar = activeOfferCard.querySelector('.popup__avatar');
      offerCardCloseButton = activeOfferCard.querySelector('.popup__close');
    }
  };

  // public ФУНКЦИЯ: создает dom-элемент объявления, добавляет ему обработчик закрытия по клику на крестик и вставляет
  // на страницу.
  var createDomOfferCard = function () {
    // создать из <template> dom-элемент для карточки предложения и добавить ему классы offerCard и hidden.
    var templateContent = document.querySelector('template').content;
    activeOfferCard = templateContent.querySelector('.map__card').cloneNode(true);
    activeOfferCard.classList.add('hidden');
    // создать ссылки на все необходимые dom-элементы внутри activeOfferCard
    findElementsInOfferCard();

    // установить для dom-элемента offerCard обработчик события на клик по крестику
    offerCardCloseButton.addEventListener('click', function () {
      activeOfferCard.classList.add('hidden');
      window.pin.removeActivePin();
      removeDocumentEscListener();
    });

    // вставить созданный dom-элемент offerCard на страницу
    var container = document.querySelector('.map');
    container.insertBefore(activeOfferCard, container.querySelector('.map__filters-container'));
  };

  // установить на document обработчик нажатия Esc.
  var setDocumentEscListener = function () {
    documentEscPressedHandler = function (evt) {
      if (evt.keyCode === ESC_KEY_CODE) {
        window.pin.removeActivePin();
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

  // ФУНКЦИЯ: скрывает карту предложения, убирает обработчик нажатия Esc у document
  var hideOfferCard = function () {
    window.pin.removeActivePin();
    activeOfferCard.classList.add('hidden');
    removeDocumentEscListener();
  };

  // Экспорты:
  window.card = {};
  window.card.setDataInDomOfferCard = setDataInDomOfferCard;
  window.card.hideOfferCard = hideOfferCard;

  createDomOfferCard();

})();
