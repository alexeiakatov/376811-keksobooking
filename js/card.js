'use strict';
// создает dom-элемент объявления, заполняет данными из полученного объекта offerData и отрисовывает на странице
// экспортирует в глобальную область функцию: createDomOfferCard

(function () {

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
  var setActualFeatures = function (domOfferCard, featuresInDataObject) {
    var featurecContainer = domOfferCard.querySelector('.popup__features');
    var featuresInDom = featurecContainer.children;
    var identifier;

    for (var i = 0; i < featuresInDom.length; i++) {
      identifier = featuresInDom[i].classList[1].split('--')[1];
      featuresInDom[i].classList.toggle('hidden', !featuresInDataObject.includes(identifier));
    }
  };

  // private ФУНКЦИЯ: устанавливает изображения в DOM-шаблон объявления, которые берет из js-объекта объявления
  var setPictures = function (domOfferCard, photosInDataObject) {
    var picturesCount = photosInDataObject.length;
    var fragment = document.createDocumentFragment();
    var listItemTemplate = domOfferCard.querySelector('.popup__pictures > li');
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
    listItemTemplate.parentNode.removeChild(listItemTemplate);
    domOfferCard.querySelector('.popup__pictures').appendChild(fragment);
  };

  // private ФУНКЦИЯ: Возвращает DOM-элемент объявления, созданный на основании шаблона <template> (который в конце index.html) и
  // заполненный данными из объекта offerData. Возвращаемый элемент готов для вставки на страницу.
  var setDataInDomOfferCard = function (offerData, domOfferCard) {
    // title
    domOfferCard.querySelector('h3').textContent = offerData.offer.title;

    // address
    domOfferCard.querySelector('p > small').textContent = offerData.offer.address;

    // price
    domOfferCard.querySelector('.popup__price').innerHTML = offerData.offer.price + ' &#x20bd;/ночь';

    // housing type
    domOfferCard.querySelector('h4').textContent = getHousingTypeInRussian(offerData.offer.type);

    // rooms and guests
    domOfferCard.querySelector('p:nth-child(7)').textContent = offerData.offer.rooms + ' комнаты для ' + offerData.offer.guests + ' гостей';

    // checkIn, checkOut
    domOfferCard.querySelector('p:nth-child(8)').textContent = 'Заезд после ' + offerData.offer.checkin + ', выезд до ' + offerData.offer.checkout;

    // features
    setActualFeatures(domOfferCard, offerData.offer.features);

    // description
    domOfferCard.querySelector('p:nth-child(10)').textContent = offerData.offer.description;

    // pictures
    setPictures(domOfferCard, offerData.offer.photos);

    // avatar
    domOfferCard.querySelector('.popup__avatar').src = offerData.author.avatar;
  };

  // public ФУНКЦИЯ: создает dom-элемент объявления, заполняет его данными и вставляет на страницу.
  var createDomOfferCard = function (offerData) {
    var template = document.querySelector('template').content.cloneNode(true);
    var domOfferCard = document.createElement('div');
    domOfferCard.classList.add('offerCard');
    domOfferCard.appendChild(template);
    setDataInDomOfferCard(offerData, domOfferCard);

    var container = document.querySelector('.map');
    var previousOfferCard = container.querySelector('.offerCard');
    if (previousOfferCard !== null) {
      container.removeChild(previousOfferCard);
    }
    container.insertBefore(domOfferCard, container.querySelector('.map__filters-container'));
  };

  // ЭКСПОРТ функции createDomOfferCard
  window.createDomOfferCard = createDomOfferCard;

})();
