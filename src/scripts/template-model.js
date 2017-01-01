/**
 * Created by Kahif on 08-May-16.
 */

'use strict';

var TemplatesModel = (function() {

  function Model() {
    this.templates =  [];
    this.defaultTemplateId = -1;
  }

  Model.prototype.update = function(prefs) {
    this.templates =  prefs.templates.slice();
    this.defaultTemplateId = prefs.defaultTemplateId;
  };

  Model.prototype.findTemplateById = function(idToFind) {
    return this.templates.find(template => template.id == idToFind);
  };

  function createTemplate (id, name, pattern) {
    return {
      id: id,
      name: name,
      pattern: pattern,
      postfix: '',
      prefix: ''
    };
  }


  let factory = function(){
    let m = new Model();
    m.createTemplate = createTemplate;
    return m;
  };



  return factory;

})();
