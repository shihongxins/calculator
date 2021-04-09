import { createApp } from 'vue';
import App from './App.vue';
import store from './store';
import math from './math';
import './assets/css/normalize.css';
import './assets/css/iconfont/iconfont.css';

const app = createApp(App);
app.config.globalProperties.$math = math;
app.use(store).mount('#app');
