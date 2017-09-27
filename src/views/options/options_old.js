'use strict';

$(function($) {

  const KEYCODE_ENTER = 13;
  const COLUMN_INDICES = {
      CHECKBOX: 0,
      NAME: 1,
      MARKUP: 2,
      PREFIX: 3,
      POSTFIX: 4
    };

  // TODO: initialize maxId with the largest id in the templates
  let maxId = 100;


  function _deserializeFromStore(key) {
    // read saved options from local-storage
    var data = {
      prefs: {
        templates: [
          {id: 100, name: 'KK', markup: '$i. $url$n$n', prefix: '-', postfix: '='},
          {id: 101, name: 'Khubaib', markup: '* $url$n$n', prefix: '--', postfix: '=='},
          {id: 102, name: 'Adiyy', markup: '- $title ($url)$n', prefix: '---', postfix: '==='}
        ],
        defaultTemplateId: 100
      },

      optionsUiState: {
        selectedTabIndex: 1
      }
    };

    return Promise.resolve(data);
  }


  function restoreUIState(uiState){

  }

  function createCheckboxColumn(template){
    const $label = $('<label>');

    if (template.id >= 0) {
      $label
        .append($('<input>').attr('type', 'checkbox'))
        .append($('<span>').addClass('checkable'));
    }
    else {
      $label.text('*');
    }

    return $label;
  }

  function createRowForNewTemplate() {
    var template = {
      id: -1,
      name: '[New Template]',
      markup: '',
      prefix: '',
      postfix: ''
    };

    return createRowForTemplate(template);
  }

  function createRowForTemplate(template, isDefault){
    var $tr,
      $td = $('<td>')
              .attr({
                      contenteditable: true,
                      spellcheck: false
              });

    /*
    We need to construct this DOM subtree
     <tr data-id="0">
       <td>
         <label>
           <input type="checkbox">
           <span class="checkable"> </span>
         </label>
       </td>
       <td contenteditable="true">Default</td>
       <td contenteditable="true">$url$n</td>
       <td contenteditable="true">Prefix1</td>
       <td contenteditable="true">Postfix2</td>
     </tr>
     */

    $tr = $('<tr>');
    $tr.attr('data-id', template.id);

    $td.clone()
      .removeAttr('contenteditable')
      .append( createCheckboxColumn(template) )
      .appendTo($tr);

    ['name', 'markup', 'prefix', 'postfix'].forEach(function(propName){
      $tr.append($td.clone().text(template[propName]));
    });

    return $tr;
  }

  function populateUI($tblFormats, prefs){
    var $tbody = $tblFormats.children().last(),
        defaultTemplateId = prefs.defaultTemplateId;

    for(let i=0 ; i<prefs.templates.length; i++) {
      $tbody.append( createRowForTemplate(prefs.templates[i]) );
    }

    appendEmptyRow($tbody);
  }

  function appendEmptyRow($tbody){
    $tbody.append(createRowForNewTemplate());
  }

  function handleInputEvent(evt) {
    //console.log('input event', evt.rangeParent, evt);
    var $td = evt.target;

  }

  function getSiblingText($siblings, index) {
    return $($siblings.get(COLUMN_INDICES.NAME)).text().trim();
  }

  function afterCellEdited($td) {
    const $tr = $td.parent();
    const $siblings = $tr.children();
    const index = $siblings.index($td);
    const id = $tr.attr('data-id');

    if (index == COLUMN_INDICES.NAME || COLUMN_INDICES.MARKUP) {
      if (id == -1) {
        if (getSiblingText($siblings, COLUMN_INDICES.NAME) && getSiblingText($siblings, COLUMN_INDICES.MARKUP)) {
          $tr.attr('data-id', ++maxId);
          appendEmptyRow($tr.parent());
        }
      }
    }

  }


  /**
   * Handles keydown event on each of contenteditable <td>
   * @param evt Keydown event object
   */
  function handleKeyDownEvent(evt) {
    //console.log('Keyup event', evt);
    var $td = $(evt.target),
        $parent,
        $next;

    // if enter key was pressed
    if (evt.keyCode == KEYCODE_ENTER) {
      evt.preventDefault();
      evt.cancelBubble = true;

      afterCellEdited($td);

      $next = $td.next();

      // is there any next sibling
      if ($next.size() == 0) {
        $next = $td.parent();

        // at this point, $next is parent <tr>
        if ($next.attr('data-id') == -1) {
          $td.blur();
          return;
        }

        // set $next to first editable <td> of next <tr>
        $next = $($next.next().children().get(COLUMN_INDICES.NAME));
      }

      // force $next <td> into edit mode
      $next.trigger('focus');

    }
  }

  function setupEventListeners($tblFormats) {
    //$tblFormats.on('input', handleInputEvent);
    $tblFormats.on('keydown', handleKeyDownEvent);
  }

  function init(evt) {
    var $tblFormats = $('.tbl-formats');


    var p = _deserializeFromStore();
      p.then(function(data){
        restoreUIState(data.optionsUiState);
      });
      p.then(function(data){
        populateUI($tblFormats, data.prefs);
        setupEventListeners($tblFormats);
      });
  }

  init();

});
