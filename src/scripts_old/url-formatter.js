
/**
 * Created by Kashif on 04-May-16.
 */

'use strict';
var UrlFormatter = (function() {

  // dateUtils.format()
  function replaceDateVars(objDate, templateString) {
    // make a single digit two digit by prefixing 0
    var padZero = (n)=> n<10? '0'+n:n;

    var h = objDate.getHours(),
      m = objDate.getMinutes(),
      s = objDate.getSeconds(),
      month = objDate.getMonth() + 1, // Months are 0-based index;
      dt = objDate.getDate();

    var strDate = templateString.replace(/YYYY/g, objDate.getFullYear())
      .replace(/YY/g, objDate.getFullYear().toString().substr(2))
      .replace(/mm/g, padZero(month))
      .replace(/m/g, month)
      .replace(/dd/g, padZero(dt))
      .replace(/d/g, dt)
      .replace(/HH/g, padZero(h))  // 24-hour clock
      .replace(/hh/g, padZero(h>12?h-12:h))
      .replace(/h/gi, h)
      .replace(/MM/g, padZero(m))
      .replace(/M/g, m)
      .replace(/SS/g, padZero(s))
      .replace(/S/g, s);

    return strDate;
  }

  function Formatter(groupedUrls, pattern) {
    this.groupedUrls = groupedUrls;
    this.fmtPattern = pattern;
  }


  Formatter.prototype.format = function() {
    var groupedTabsData = this.groupedUrls,
        fmtPattern = this.fmtPattern;

    console.log('format', groupedTabsData, fmtPattern);

    var returnValue = '';

    var d = new Date();

    var strDate = d.toLocaleString();
    var strTime = d.getTime();

    var pattern = fmtPattern.pattern;

    for(let i = 0; i < groupedTabsData.length; i++) {
      let group = groupedTabsData[i];

      for(let j = 0; j < group.length; j++) {
        let entry = group[j];
        returnValue += pattern.replace(/\$title/gi, entry.title)
          .replace(/\$url/gi, entry.url)
          .replace(/\$index/gi, j+1);
      }

    }

    returnValue = fmtPattern.prefix + returnValue + fmtPattern.postfix;

    // http://stackoverflow.com/questions/1234712/javascript-replace-with-reference-to-matched-group
    returnValue = returnValue.replace(/\$date\((.+?)\)/g, function(match, grp1){
        return replaceDateVars(d, grp1);
      })
      .replace(/\$date/gi, strDate)
      .replace(/\$time/gi, strTime)
      .replace(/\$n/gi, '\n')
      .replace(/\$t/gi, '\t');


    console.log('format', returnValue);
    return Promise.resolve(returnValue);
  };

  return function (groupedUrls, pattern) {
    return new Formatter(groupedUrls, pattern);
  };

})();
