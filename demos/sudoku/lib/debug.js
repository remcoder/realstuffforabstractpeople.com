function debug(text) {
  var logger = (window.console ? function(msg) {console.log(msg);} : (window.opera ? opera.postError : window.alert ) );
  logger(text);
}