<template>
    <div class="row custom-format-row" :class="[isEditing? 'edit-mode': 'view-mode']">
        <div class="column small-4">
            <input type="text" v-model="editedFormat.name" v-if="isEditing">
            <template v-else>{{ format.name }}</template>
        </div>
        <div class="column small-4">
            <input type="text" v-model="editedFormat.markup" v-if="isEditing">
            <template v-else>{{ format.markup }}</template>
        </div>
<!--
        <div class="column small-3">
            <input :value="editedFormat.prefix" v-if="isEditing">
            <template v-else>{{ format.prefix }}</template>
        </div>
        <div class="column small-3">
            <input :value="editedFormat.postfix" v-if="isEditing">
            <template v-else>{{ format.postfix }}</template>
            {{ format.postfix }}
        </div>
-->
      <div class="column small-2" v-if="isEditing">
        <!-- TODO: Disable update until valid name and pattern -->
        <button @click="acceptEdit">Done</button>
      </div>
      <div class="column col-action small-2">
            <!-- TODO: Disable update until valid name and pattern -->
          <button @click="beginEdit">Edit</button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'custom-format-row',
    components: {},

    data() {
      return {
          isEditing: false,
          editedFormat: {},
      }
    },

    props: {
        format: {
            type: Object,
            default() {
                return null;
            },
        },
    },

    methods: {
        beginEdit() {
            this.editedFormat = Object.assign({}, this.format);
            this.isEditing = true;
        },
        acceptEdit() {
            this.isEditing = false;
            Object.assign(this.format, this.editedFormat);
        }
    }
};
</script>
<style lang="scss">
@import '../styles/variables.scss';

.custom-format-row {

  > .col-action {
    display: none;
  }

  &:hover {
     background-color: #00acee;

     &.view-mode > .col-action {
       display: block;
       float: left;
     }
  }
}

</style>
