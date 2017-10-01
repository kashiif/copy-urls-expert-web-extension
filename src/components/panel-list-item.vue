<template>
    <div class="panel-list-item">
        <a class="text cue-action"
           href="#"
           @click="action">
            {{ title }}
        </a>
    </div>
</template>

<script>
    export default {
        name: 'panel-list-item',
        props: {
          action: {
            type: Function,
            default() {
              return function() {};
            },
          },
          title: {
            type: String
          }
        },
    }
</script>
<style>
</style>
