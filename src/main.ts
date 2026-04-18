import { createApp } from 'vue';
import { createPinia } from 'pinia';
import './style.css';
import App from './App.vue';

const pinia = createPinia();
const app = createApp(App);

console.log(
    "Hi, I'm Terry. Thank you for checking out my Pomodoro Timer app. I built it to help you stay focused on whatever task you're working on. This app is completely free to use. Because it's a static Vue.js application, there is no backend server, and it does not collect personal data. If you'd like to see more of my work, visit my GitHub: https://github.com/terryluciano. Thanks again for stopping by!"
);

app.use(pinia);
app.mount('#app');
