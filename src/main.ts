import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { registerSW } from 'virtual:pwa-register';
import './style.css';
import App from './App.vue';

registerSW({ immediate: true });

const pinia = createPinia();
const app = createApp(App);

console.log(
	"Hey, I'm Terry. this is a Pomodoro timer I built to help you stay focused on whatever you're working on. It's completely free, and since it's a static Vue.js app with no backend, it doesn't collect any personal data. You can find more of my work on GitHub: https://github.com/terryluciano"
);

app.use(pinia);
app.mount('#app');
