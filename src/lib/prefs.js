const DEFAULT_PREFS = {
  formats: [
    {id: 1, name: 'URL', markup: '$url$n'},
    {id: 2, name: 'URL With Title', markup: '$title$n$url$n$n'},
  ],
  filterDuplicates: true,
  filterPinnedTabs: true,
};

function getPrefs() {
  if (typeof browser === 'undefined') {
    // running as web-app
    return Promise.resolve(DEFAULT_PREFS);
  }


  return browser.storage.local.get(['formats']).then((prefs) => {
    let value;

    if (prefs.formats) {
      value = Object.assign({}, DEFAULT_PREFS, {
        formats: JSON.parse(prefs.formats),
      });
    }
    else {
      value = Object.assign({}, DEFAULT_PREFS, prefs);
    }

    return value;
  });
}

function setPrefs(prefs) {

  const newPrefs = Object.assign({}, prefs);

  if (prefs.formats) {
    newPrefs.formats = JSON.stringify(prefs.formats)
  }

  browser.storage.local.set(newPrefs);
}

export {
  DEFAULT_PREFS,
  getPrefs,
  setPrefs,
}
