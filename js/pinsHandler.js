'use strict';
// обработчик клика на пин. Берет данные того объявления на котором был клик из getAnnouncementDataById и вызывает
// поэтому id отрисовку данных этого объявления на странице.
// требует window.getAnnouncementDataById.
(function () {

  var pinsContainer = document.querySelector('.map__pins');


  var pinClickHandler = function (evt) {
    var currentId = evt.target.getAttribute('data-id');
    if (currentId !== null) {
      var dataObject = window.getAnnouncementDataById(currentId);
      window.createDomOfferCard(dataObject);
    }

  };

  pinsContainer.addEventListener('mousedown', pinClickHandler);

})();


