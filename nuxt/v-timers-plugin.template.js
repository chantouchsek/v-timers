import Vue from 'vue';
import VTimers from 'v-timers';

export default ({ app }) => {
  const [pluginOptions] = [<%= serialize(options) %>]

  Vue.use(VTimers, { ...pluginOptions });
  app.$timer = VTimers;
}
