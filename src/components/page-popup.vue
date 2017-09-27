<template>
    <div class="panel-section panel-section-list">
        <panel-list-item action="active-win" title="Copy Urls From Current Window"></panel-list-item>
        <panel-list-item action="all-win" title="Copy Urls From All Windows"></panel-list-item>
        <panel-list-item action="active-group" title="Copy Urls From Active Group"></panel-list-item>
        <panel-list-item action="active-tab" title="Copy Url Of Current Tab"></panel-list-item>
    </div>
</template>

<script>
    import PanelListItem from './panel-list-item';

    export default {
        components: {
            PanelListItem,
        },
    }
</script>
<style>
</style>
