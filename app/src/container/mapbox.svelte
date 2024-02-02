<script>
    //import { Map } from "mapbox-gl";
    import pkg from 'mapbox-gl';
    const { Map } = pkg;
    import "../../node_modules/mapbox-gl/dist/mapbox-gl.css"

    import { onMount, onDestroy } from 'svelte';
    import { getMapboxKey } from '../keys.js';

    import * as h3 from 'h3-js';
    import * as geojson2h3 from 'geojson2h3';


    let map;
    let mapContainer;
    let lng, lat, zoom;

    // set initial map position and zoom
    lat = 37.773972;
    lng = -122.431297;
    zoom = 5.6;


    onMount(() => {

        const initialState = { lng: lng, lat: lat, zoom: zoom };
        map = new Map({
            container: mapContainer,
            accessToken: getMapboxKey(),
            style: `mapbox.json`,
            center: [initialState.lng, initialState.lat],
            zoom: initialState.zoom,
        });
        map.on('load', async () => {
            fetchCaliforniaPolygon().then((cali) => {
                let h3set = geojson2h3.featureToH3Set(cali.features[0], 5)
                console.log(h3set)
                let hexes = geojson2h3.h3SetToMultiPolygonFeature(h3set)
                console.log(hexes)
                map.addSource('hexagons', {
                    type: 'geojson',
                    // Use a URL for the value for the `data` property.
                    data: hexes
                })
                map.addLayer({
                    'id': 'hexagons-layer',
                    'type': 'line',
                    'source': 'hexagons',
                    'paint': {
                        "line-color": "#aaa",
                        "line-width": 0.1,
                    },
                });
            })
        })

        map.on('click', 'hexagons-layer', (e) => { console.log(e) });
        map.on('mouseenter', 'hexagons-layer', () => {
            map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', 'hexagons-layer', () => {
            map.getCanvas().style.cursor = '';
        });

    });

    onDestroy(() => {
        //map.remove();
    });


    async function fetchCaliforniaPolygon() {
        return fetch("California_State_Boundary.geojson").then((data) => { return data.json() })
    }


</script>

<div class="map-wrap">
    <div class="map" bind:this={mapContainer} />
</div>

<style>
    .map {
        position: absolute;
        width: 100%;
        height: 100%;
    }
</style>

  