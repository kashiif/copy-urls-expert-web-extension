'use strict';

const SEPARATOR = '|';
const ESCAPED_SEPARATOR = '\\|';

var model = TemplatesModel();

console.log('urlFormatter', UrlFormatter);

var actionHandlers = {
  'active-win': performCopyFromTabs.bind(null, {currentWindow: true}),
  'active-group': performCopyFromTabs.bind(null, {currentWindow: true}),
  'active-tab': performCopyFromTabs.bind(null, {currentWindow: true, active: true}),
  'all-win': performCopyFromTabs.bind(null, {}),
  'images-selection': performCopyAction.bind(null, collectSelectionData, 'img'),
  'links-selection': performCopyAction.bind(null, collectSelectionData, 'a')
};

function init() {
  chrome.runtime.onMessage.addListener(handleMessage);

  getPrefs()
    .then(model.update.bind(model));

  setupUI();
}

function getDefaultPrefs() {
  var prefs = {
    templates: [
      model.createTemplate(0, 'Default', '$url$n'),
      model.createTemplate(1, 'html','<a href="$url">$title</a>$n'),
      model.createTemplate(2, 'forum','[a=$url]$title[/a]$n')
    ],
    defaultTemplateId: 0,
    filterDuplicates: true,
    openTabDelayStepInMillisecs: 800
  };

  return prefs;
}

function getPrefs() {
  return new Promise(function(resolve, reject){


    chrome.storage.local.get('prefs', function(prefs){

      prefs = prefs || {};

      var templates = prefs.templates;

      if (!(templates instanceof Array)) {
        // use default templates
        prefs = getDefaultPrefs();
        chrome.storage.local.set(prefs);
      }

      resolve(prefs);

    });
  });

}

function reportError(err) {
  console.error('Copy Urls Expert: ', err);
}

function performCopyFromTabs(tabSourceParams, request) {
  return collectTabsData(tabSourceParams, request)
            .then(function(groupedTabsData) {
              processCollectedUrls(groupedTabsData, request.template)
            })
            .catch(reportError);
}

function processCollectedUrls(groupedTabsData, template) {
  console.log('processCollectedUrls', groupedTabsData);
  return filterDuplicates(groupedTabsData)
    .then(function(groupedTabsData){
      console.log('before applyPattern', groupedTabsData);

      template = template || model.findTemplateById(model.defaultTemplateId);
      var formatter = UrlFormatter(groupedTabsData, template);
      return formatter.format();
    })
    .then(pasteToClipboard);
}

function performCopyAction(collectorFunction, tabSourceParams, request) {

  return collectorFunction(tabSourceParams, request)
    .then(filterDuplicates)
    .then(function(groupedTabsData){
        var template = request.template || findTemplateById(model.templates, model.defaultTemplateId);
        return applyPattern(groupedTabsData, template);
      })
    .then(pasteToClipboard);

}

function collectTabsData(tabQueryInfo, request){

  return new Promise(function(resolve, reject){

    console.log('tabQueryInfo',tabQueryInfo);

    chrome.tabs.query(tabQueryInfo, function(tabs) {
      if (request.action == 'active-group') {
        tabs = tabs.filter(tab => !tab.hidden);
      }

      chrome.storage.local.get('usecontenttitle', function(useContentTitle) {
        // for every tab return a simple object representing the tab
        tabs = tabs.map(function(tab, index) {
                          var title = useContentTitle && tab.contentTitle? tab.contentTitle : tab.title;
                          return { title: title, url: tab.url };
                        });

        resolve([tabs]);

      });


    });

  });

}


function collectSelectionData(tagName, request) {
  return new Promise(function(resolve, reject){
    resolve([]);
  });
}

function filterDuplicates(groupedTabsData) {
  return Promise.resolve(groupedTabsData);
}



function pasteToClipboard(text) {
  console.log('Clipboard set:\n', text);
  return Promise.resolve();
}

/*
function getEntriesFromTabs(groupedTabsData) {
  var title = '',
      url = '',
      urls = [],
      entries = [];

  // TODO: handle duplicate
  var filterDuplicates = true;
  
  for(var i = 0; i < groupedTabsData.length; i++) {
    var tabGroup = groupedTabsData[i];

    for (var index = 0; index < groupedTabsData.length; index++) { 
      var tab = groupedTabsData[index];

      //if (filterDuplicates && isDuplicate(urls, tab.url)) {
        //continue;
      //}
      
      urls.push(tab.url);
      entries.push({
        url: tab.url,
        title: tab.title
      });
    }
  }
  
  return entries;   
}
function getEntryForTab(tab) {
  var url = brwsr.currentURI.spec;
  
  var useContentTitle = this._prefService.getBoolPref('usecontenttitle');

  var title = useContentTitle && brwsr.contentTitle? brwsr.contentTitle : tab.label;

  var entry = new copyUrlsExpert._UrlEntry(title,url);
  return entry;
}
*/

function handleMessage(request, sender, sendResponseCallback) {

  var targetFunction = actionHandlers[request.action];
  targetFunction(request).then(sendResponseCallback);

}

init();
