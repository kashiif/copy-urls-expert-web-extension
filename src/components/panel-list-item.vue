<template>
    <div class="panel-list-item">
        <div class="text cue-action" :data-action="action">{{ title }}</div>
    </div>
</template>

<script>
    export default {
        name: 'panel-list-item',
        props: ['action', 'title']
    }
</script>
<style>
</style>
