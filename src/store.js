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

export const baseFillOpacity = writable(0.78);
export const baseLineOpacity = writable(1.00);

export const currentMapPalette = writable({});


export const visualLayer = writable("hex");

export const metric = writable("pd");
export const pal = writable({});

export const nullModel = createNullModel()

export const selectionData = writable(null);

function createNullModel() {
    const { subscribe, set, update } = writable(null);
    return {
        subscribe,
        set,
        update
    }
}