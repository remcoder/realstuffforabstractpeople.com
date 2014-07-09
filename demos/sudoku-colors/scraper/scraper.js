(function () {
  'use strict';
  var sys = require('util');
  var fs = require('fs');
  var jquery = require('jquery');
  var parse = require('jsdom').env
  var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
  
  var loading = 0;

  function scrape(level) {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
      //sys.puts('State: ' + this.readyState);

      if (this.readyState == 4) {
        //sys.puts('Complete.\nBody length: ' + this.responseText.length);
        //sys.puts('Body:\n' + this.responseText);

        var html = this.responseText;

        // first argument can be html string, filename, or url
        parse(html, function (errors, window) {
          if (errors)
            console.log('errors', errors);

          var $ = jquery(window);

          var sudoku = "";
          $('table table table input').each(function(i,v) {

            sudoku += v.value == null ? "_" : v.value;

            //console.log(i, v.value);
          });

          //console.log(sudoku);
          fs.appendFileSync('sudoku.txt', sudoku + '\n');
          process.stdout.write('.');
          loading--;
          if (loading == 0)
            process.stdout.write('done!\n');
        });
      }
    };
    var url = 'http://show.websudoku.com/?level=' + level;
    //console.log(url);
    xhr.open('GET', url);
    xhr.send();
  }

  process.stdout.write('scraping');
  for(var j=0 ; j<10 ; j++) {
    for(var i=1 ; i<=4 ; i++) {
      loading++;
      scrape(i);
    }
  }

}());