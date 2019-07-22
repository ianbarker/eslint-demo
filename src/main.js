import Vue from 'vue';
import entryList from './components/thing';
import vuetify from './plugins/vuetify';

new Vue({
    el: '#app',
    render: h => h(entryList),
    vuetify
});
