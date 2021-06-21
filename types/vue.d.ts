/**
 * Extends interfaces in Vue.js
 */

import { VTimers } from './';
import Vue from "vue";

interface ITimers {
    name?: string
    callback?: Function | string
    autoStart?: boolean
    repeat?: boolean
    immediate?: boolean
    time?: number
    isSwitchTab?: boolean
}
interface TimersInterface {
    [key: string]: ITimers
}

declare module 'vue/types/vue' {
    interface Vue {
        $timer: VTimers;
    }
}

declare module 'vue/types/options' {
    interface ComponentOptions<V extends Vue> {
        timers?: TimersInterface
    }
}
