<template>
    <div>
        <h1>Test Options Page</h1>
        <custom-formats-panel :formats="formats"></custom-formats-panel>
    </div>
</template>
<script>
import CustomFormatsPanel from './custom-formats-panel';

const DEFAULT_FORMATS = [
  { id: 1, name: 'test1', markup: '$url$n' },
  { id: 2, name: 'test 2', markup: '$title$n$url$n$n' }
];

export default {
    components: {
        CustomFormatsPanel,
    },

    computed: {
    },

    data() {
        const pageData = {
          formats: {
            value: [],
            loaded: false,
            error: null,
          }
        };

        if (typeof browser === 'undefined') {
          // running as web-app
          Object.assign(pageData.formats, {
            value: DEFAULT_FORMATS,
            loaded: true,
          });
          return pageData;
        }

        browser.storage.local.get(['formats']).then((prefs) => {

          const value = prefs.formats ? JSON.parse(prefs.format) : DEFAULT_FORMATS;

          Object.assign(pageData.formats, {
            value,
            loaded: true,
          });
        });

        return pageData;
    },

    mounted() {
    },
};
</script>
<style>
</style>
