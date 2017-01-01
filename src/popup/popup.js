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

    chrome.runtime.sendMessage(message, function(response){
      var copyText = document.querySelector('#txt-clipboard');
      copyText.textContent = response.text;
      copyText.select();
      document.execCommand('Copy');
    });

  });




})();
