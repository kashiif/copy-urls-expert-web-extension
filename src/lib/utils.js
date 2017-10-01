import { getPrefs } from './prefs';

const LINE_FEED = '\n';

function getUrlEntry(title, url) {
  return {
    title: title,
    url: url
  };
}

function getEntryForTab(tab) {
  // TODO: Implement usecontenttitle;
  /*
  var url = brwsr.currentURI.spec;

  var useContentTitle = this._prefService.getBoolPref('usecontenttitle');

  var title = useContentTitle && brwsr.contentTitle ? brwsr.contentTitle : tab.label;
  */

  const { title, url } = tab;

  return getUrlEntry(title, url);
}


function getEntriesFromTabs(tabs, options) {
  return getPrefs().then((prefs) => {
    const opts = Object.assign({
      filterHidden: false,
    }, prefs, options);

    const allEntries = [];
    const allUrls = [];

    for (let targetTab of tabs) {

      if (opts.filterHidden && targetTab.hidden) {
        continue;
      }

      if (opts.filterDuplicates && allUrls.indexOf(targetTab.id) >= 0) {
        continue;
      }

      const entry = getEntryForTab(targetTab);
      allEntries.push(entry);
      allUrls.push(entry.url);
    }

    return allEntries;
  });
}

function _formatDate(date, formatString) {
  const h = date.getHours(),
    m = date.getMinutes(),
    s = date.getSeconds(),
    month = date.getMonth() + 1, // Months are 0-based index;
    dt = date.getDate();

  const strDate = formatString.replace(/YYYY/g, date.getFullYear())
    .replace(/YY/g, date.getFullYear().toString().substr(2))
    .replace(/mm/g, t(month))
    .replace(/m/g, month)
    .replace(/dd/g, t(dt))
    .replace(/d/g, dt)
    .replace(/HH/g, t(h))  // 24-hour clock
    .replace(/hh/g, t(h > 12 ? h - 12 : h))
    .replace(/h/gi, h)
    .replace(/MM/g, t(m))
    .replace(/M/g, m)
    .replace(/SS/g, t(s))
    .replace(/S/g, s);

  return strDate;
}

function entriesToText(entries, fmtPattern) {
  let returnValue = '';

  const d = new Date();

  const strDate = d.toLocaleString();
  const strTime = d.getTime();

  const pattern = fmtPattern.markup;

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];

    returnValue += pattern.replace(/\$title/gi, entry.title)
                          .replace(/\$url/gi, entry.url)
                          .replace(/\$index/gi, i + 1);
  }

  // TODO: Is this even used?
  // returnValue = fmtPattern.prefix + returnValue + fmtPattern.postfix;

  // http://stackoverflow.com/questions/1234712/javascript-replace-with-reference-to-matched-group
  returnValue = returnValue.replace(/\$date\((.+?)\)/g, function (match, grp1) {
    return _formatDate(d, grp1);
  });

  returnValue = returnValue.replace(/\$date/gi, strDate)
                  .replace(/\$time/gi, strTime)
                  .replace(/\$n/gi, LINE_FEED)
                  .replace(/\$t/gi, '\t');

  return returnValue;
}

export {
  getEntriesFromTabs,
  entriesToText,
};
