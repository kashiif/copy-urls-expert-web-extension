import Vue from 'vue';
import OptionsPage from '../../components/page-options';

require('./foundation.css');

new Vue({
  render: h => h(OptionsPage)
}).$mount('#cue_options');
