<template>
  <select v-model="selectedTemplateId">
    <option v-for="format in formats"
        :key="format.id" :value="format.id">
      {{ format.name }}
    </option>
  </select>
</template>

<script>
  import { getPrefs } from '../lib/prefs';
  export default {
    data() {
      const pageData = {
        formats: [],
      };

      getPrefs().then((prefs) => {
        pageData.formats.push(... prefs.formats);
      });

      return pageData;
    },
  }
</script>
<style>
</style>
