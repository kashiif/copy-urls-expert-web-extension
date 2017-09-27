<template>
    <div>
        <div class="row">
            <ul class="list-unstyled">
                <li v-for="format in formats.value"
                    :key="format.id">
                    <custom-format-row :format="format" />
                </li>
            </ul>

            <div class="columns">
                <button @click="saveTemplates">
                    Save!
                </button>
            </div>
        </div>
    </div>
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
        saveTemplates() {
            alert(1)
        },
    },
};
</script>
<style lang="scss">
</style>
