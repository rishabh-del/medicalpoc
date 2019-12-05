'user strict';

myApp.factory('myService', function () {
  var savedData = {}
  function set(data) {
    savedData = data;
    console.log(savedData);
  }
  function get() {
    console.log(savedData);
    return savedData;
  }

  return {
    set: set,
    get: get
  }

});