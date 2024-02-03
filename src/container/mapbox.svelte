<script>

    /**
     * 
     *      Mapbox integration
     * 
    */


    //import { Map } from "mapbox-gl";
    import pkg from 'mapbox-gl';
    const { Map } = pkg;
    import "../../node_modules/mapbox-gl/dist/mapbox-gl.css"

    import { onMount, onDestroy } from 'svelte';
    import { getMapboxKey } from '../keys.js';

    import * as h3 from 'h3-js';
    import * as geojson2h3 from 'geojson2h3';

    //var geojsonExtent = require('geojson-extent');
    import geojsonExtent from '@mapbox/geojson-extent';

    console.log(geojsonExtent({ type: 'Point', coordinates: [0, 0] }));


    let map;
    let mapContainer;
    let lng, lat, zoom;

    export let update;

    // set initial map position and zoom

    const centerOfCalifornia = [37.166111, -119.449444]

    lat = centerOfCalifornia[0];
    lng = centerOfCalifornia[1];
    zoom = 6;
    let resolution = 5;


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
                let h3set = geojson2h3.featureToH3Set(cali.features[0], resolution)
                console.log(h3set)
                let hexes = geojson2h3.h3SetToMultiPolygonFeature(h3set)
                console.log(hexes)
                map.addSource('hexagons', {
                    type: 'geojson',
                    // Use a URL for the value for the `data` property.
                    data: hexes
                })
                map.addLayer({
                    'id': 'hexagons-line-layer',
                    'type': 'line',
                    'source': 'hexagons',
                    'paint': {
                        "line-color": "#000000",//"#aaa",
                        "line-width": 0.1,
                    },
                });
                map.addLayer({
                    'id': 'hexagons-layer',
                    'type': 'fill',
                    'source': 'hexagons',
                    'paint': {
                        "fill-color": "#0000ff",//"#aaa",
                        "fill-opacity": 0,
                    },
                });
                
                // fix California to the left third
                map.fitBounds(geojsonExtent(hexes), { padding: 30 });
                let b = map.getBounds()
                let widthInCoords = b._ne.lng - b._sw.lng;
                console.log(widthInCoords)
                map.flyTo({center: {lng: lng + (widthInCoords / 5), lat: map.getCenter().lat}})
                console.log(map.getBounds())
            })
        })

        map.on('click', 'hexagons-layer', (e) => { 
            console.log(e);
            update(e.lngLat); 
        });
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

  