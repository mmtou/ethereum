// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import MuseUI from 'muse-ui';
import 'muse-ui/dist/muse-ui.css';
import Loading from 'muse-ui-loading';
import Web3 from "web3";
import {formatAmount} from "./utils/amountFormat"

Vue.config.productionTip = false

Vue.use(MuseUI);
Vue.use(Loading);

var web3;
if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  // set the provider you want from Web3.providers
  web3 = new Web3(new Web3.providers.HttpProvider("http://eth.awservice.net"));
}
Vue.prototype.$web3 = web3;

Vue.filter('formatAmount', formatAmount);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
