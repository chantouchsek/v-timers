/**
 * Extends interfaces in Vue.js
 */

import { VTimers } from './';

declare module 'vue/types/vue' {
    interface Vue {
        $timer: VTimers;
    }
}
