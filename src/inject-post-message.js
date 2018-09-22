// Custom postMessage handler to inject into the Web View.
export default `
(function() {
  var EMPTY_STATE = Object.create(null);
  var escape = function(str) {
    return str.replace(/'/g, '\\\\\'');
  };
  var postMessage = window.postMessage;
  window.postMessage = function() {
    if (postMessage) {
      postMessage.apply(window, arguments);
    }
    history.pushState(
      EMPTY_STATE,
      document.title,
      location.href +
      '#window.postMessage(\\\'' +
      escape(arguments[0]) +
      '\\\')'
    );
  };
})();
`;
