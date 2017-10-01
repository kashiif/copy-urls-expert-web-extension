<template>
  <div>
    <div class="row">
      <div class="columns">
        <custom-formats-panel :formats="formats"></custom-formats-panel>
      </div>
    </div>

    <div class="row">
      <div class="columns">
        <button @click="saveOptions">
          Save!
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import CustomFormatsPanel from './custom-formats-panel';
import { getPrefs, setPrefs } from '../lib/prefs';

export default {
  components: {
    CustomFormatsPanel,
  },

  data() {
    const pageData = {
      formats: {
        value: [],
        loaded: false,
        error: null,
      }
    };

    getPrefs().then((prefs) => {
      Object.assign(pageData.formats, {
        value: prefs.formats,
        loaded: true,
      });
    });

    return pageData;
  },

  methods: {
    saveOptions(evt) {
      setPrefs({
        formats: this.formats.value,
      });
    },
  },

};
</script>
<style>
</style>
