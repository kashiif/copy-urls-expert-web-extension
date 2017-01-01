(function() {

  document.addEventListener('click', function(evt){
    var target = evt.target;

    if (!target.classList.contains('cue-action')) {
      return;
    }

    // Send message to background script
    var message = {
        action: target.getAttribute('data-action')
      };

    chrome.runtime.sendMessage(message, function(){ console.log('L'); });

  });




})();