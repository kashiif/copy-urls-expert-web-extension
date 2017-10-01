<template>
    <ul class="list-unstyled">
        <li v-for="format in formats.value"
            :key="format.id">
            <custom-format-row :format="format" />
        </li>
    </ul>
</template>

<script>
import CustomFormatRow from './custom-format-row';

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
    methods: {
    },
};
</script>
<style lang="scss">
</style>
