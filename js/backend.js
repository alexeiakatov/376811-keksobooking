'use strict';

(function () {
  // ФУНКЦИЯ: получает данные с сервера.
  // { function } onLoad(receivedData) - колбыэк, который вызывается при успешном получении данных с сервера.
  // { Object } receivedData - параметр функции onLoad в котором передаются данные, полученные с сервера.
  // { function } onError(errorMessage) - колбэк, который вызывается при неуспешном выполнении запроса.
  // { String } errorMessage - параметр функции onError в котором передается сообщение об ошибке.
  var getData = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();

    // ОБРАБОТЧИК события load при получении данных
    var xhrLoadHandler = function () {
      var statusCode = xhr.status;
      switch (statusCode) {
        case 200 :
          onLoad(JSON.parse(xhr.responseText));
          break;
        case 500 :
          onError(xhr.status + xhr.statusText);
          break;
        case 400 :
          onError(xhr.status + xhr.statusText);
          break;
      }
      xhr.removeEventListener('load', xhrLoadHandler);
      xhr.removeEventListener('error', xhrErrorHandler);
    };

    // ОБРАБОТЧИК события error при получении данных
    var xhrErrorHandler = function () {
      onError('Ошибка отправки данных.');
      xhr.removeEventListener('error', xhrErrorHandler);
      xhr.removeEventListener('load', xhrLoadHandler);
    };

    // добавления на xhr обработчика события LOAD
    xhr.addEventListener('load', xhrLoadHandler);

    // добавление на xhr обработчика события ERROR
    xhr.addEventListener('error', xhrErrorHandler);

    xhr.open('GET', 'https://js.dump.academy/keksobooking/data', true);
    xhr.send(null);
  };

  // ФУНКЦИЯ: отправляет данные на сервер.
  // { Object } data, тип (FormData) - содержит данные, которые будут отправлены на сервер.
  // { function } onLoad - колбэк, который вызывается при успешном выполнении отправки данных.
  // { function } onError - колбэк, которая вызывается при неуспешном выполнении отправки данных.
  // { String } errorMessage - параметр функции onError в котором передается сообщение об ошибке.
  var sendData = function (data, onLoad, onError) {
    var xhr = new XMLHttpRequest();

    // ОБРАБОТЧИК события load при отправке данных
    var xhrLoadHandler = function () {
      if (xhr.status === 201 || xhr.status === 200) {
        onLoad();
      }
      xhr.removeEventListener('load', xhrLoadHandler);
      xhr.removeEventListener('error', xhrErrorHandler);
    };

    // ОБРАБОТЧИК события error при отправке данных
    var xhrErrorHandler = function () {
      onError('Ошибка отправки данных.');
      xhr.removeEventListener('error', xhrErrorHandler);
      xhr.removeEventListener('load', xhrLoadHandler);
    };

    xhr.addEventListener('load', xhrLoadHandler);
    xhr.addEventListener('error', xhrErrorHandler);

    xhr.open('POST', 'https://js.dump.academy/keksobooking', true);
    xhr.setRequestHeader('content-type', 'multipart/form-data');
    xhr.send(data);
  };


  // Экспорты
  window.backend = {};
  window.backend.getData = getData;
  window.backend.sendData = sendData;

})();
