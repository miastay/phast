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

export const baseFillOpacity = writable(0.7);
export const baseLineOpacity = writable(1.00);

export const currentMapPalette = writable({});

export const nullModel = createNullModel()

function createNullModel() {
    const { subscribe, set, update } = writable(null);
    return {
        subscribe,
        set,
        update
    }
}