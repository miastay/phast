import { writable } from "svelte/store";
import 'maplibre-gl';

export const map = createMap()

function createMap() {
    const { subscribe, set, update } = writable(new Map());
    return {
        subscribe,
        set,
        update
    }
}