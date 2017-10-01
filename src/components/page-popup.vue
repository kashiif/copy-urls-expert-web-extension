<template>
  <div>
    <div class="panel-section panel-section-list">
      <div class="panel-list-item">
        <template-dropdown ref="templateDropdown" style="width: 100%;"/>
      </div>
    </div>
    <div class="panel-section panel-section-list">
      <panel-list-item :action="copyTabUrlsFromActiveWindow" title="Copy Urls From Current Window"/>
      <panel-list-item :action="copyTabUrlsFromAllWindows" title="Copy Urls From All Windows"/>
      <!--<panel-list-item action="active-group" title="Copy Urls From Active Group"/>-->
      <panel-list-item :action="copyTabUrlOfActiveTab" title="Copy Url Of Current Tab"/>
    </div>
  </div>
</template>

<script>
  import PanelListItem from './panel-list-item';
  import TemplateDropdown from './template-dropdown';
  import { getEntriesFromTabs, entriesToText } from '../lib/utils';
  import { copyToClipboard } from '../lib/clipboard-helper';

  function getEntriesForQuery(tabQuery) {
    const query = Object.assign({
      windowType: 'normal',
    }, tabQuery);

    return browser.tabs.query(query)
      .then(getEntriesFromTabs);
  }

  export default {
    components: {
      PanelListItem,
      TemplateDropdown,
    },

    methods: {
      copyTabUrlsFromActiveWindow(evt) {
        this.copyUrlsFromTabs({
          currentWindow: true,
        });
      },

      copyTabUrlsFromAllWindows(evt) {
        this.copyUrlsFromTabs({});
      },

      copyTabUrlOfActiveTab(evt) {
        this.copyUrlsFromTabs({
          currentWindow: true,
          active: true,
        });
      },

      copyUrlsFromTabs(query) {
        getEntriesForQuery(query)
          .then((entries) => {
            const templateDropdown = this.$refs.templateDropdown;
            const selectedTemplateId = templateDropdown.selectedTemplateId;
            if (!selectedTemplateId) {
              return;
            }

            const selectedTemplate = templateDropdown.formats.find(function(format) {
              return format.id === selectedTemplateId;
            });

            return entriesToText(entries, selectedTemplate);
          })
          .then((text) => {
            copyToClipboard(text);
          });
      },
    },
  }
</script>
<style>
</style>
