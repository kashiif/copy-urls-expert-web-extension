<template>
    <ul class="list-unstyled list-formats">
        <li v-for="format in formats.value"
            :key="format.id">
            <custom-format-row :format="format" />
        </li>
        <li>
            <div class="row">
                <div class="column small-4">
                    <input type="text" v-model="newFormat.name">
                </div>
                <div class="column small-4">
                    <input type="text" v-model="newFormat.markup">
                </div>
                <div class="column end small-2">
                    <button @click="acceptNew">Add</button>
                </div>
            </div>

        </li>
    </ul>
</template>

<script>
  import CustomFormatRow from './custom-format-row';

  function getEmptyFormat() {
    return {
      name: '',
      markup: '',
    };
  }

  export default {
    name: 'custom-formats-panel',
    components: {
      CustomFormatRow
    },
    props: {
      formats: {
        type: Object,
        default() {
          return {
            value: [],
            loaded: true,
          };
        },
      },
    },
    data() {
      return {
        newFormat: getEmptyFormat(),
      };
    },
    methods: {
      acceptNew(evt) {
        let greatestId = 1;
        const formats = this.formats.value;

        formats.forEach(function(f){
          if (f.id > greatestId) {
            greatestId = f.id;
          }
        });

        formats.push(Object.assign({ id: greatestId + 1 }, this.newFormat));
        Object.assign(this.newFormat, getEmptyFormat());
      }
    }
  };
</script>
<style lang="scss">
    .list-unstyled {
        list-style: none;
        padding-left: 0;
    }

    .list-formats input {
        width: 100%;
    }
</style>
