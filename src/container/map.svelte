<script>
	import { onMount } from 'svelte';
    import { FillLayer, LineLayer, MapLibre, GeoJSON } from 'svelte-maplibre';
    import geojsonExtent from '@mapbox/geojson-extent';
    import * as h3 from 'h3-js';

    import { populateFeatures } from '../populate_hexbins';



    let hexagonFetchResolution = 6;
    const centerOfCalifornia = [37.166111, -119.449444];

    let map;//: maplibregl.Map | undefined;
    let loaded = false//: boolean;
    let textLayers;//: maplibregl.LayerSpecification[] = [];
    $: if (map && loaded) {
        textLayers = map.getStyle().layers.filter((layer) => layer['source-layer'] === 'place');
        console.log(textLayers)
        //map.flyTo(centerOfCalifornia)
    }

    // $: if (map && loaded) {
    // for (let layer of textLayers) {
    //     map.setPaintProperty(layer.id, 'text-color', colors.textColor);
    //     map.setPaintProperty(layer.id, 'text-halo-color', colors.textOutlineColor);
    // }
    // }

    const showBorder = true;
    const showFill = true;
    let hexagons;
    let hexdata = {};

    const mapPalette = [
        "#ff0000",
        "#ffff00",
        "#00ff00",
        "#00ffff",
        "#0000ff",
        "#ff00ff",
    ]

    function generatePalette() {
        const len = mapPalette.length
        let colors = mapPalette.map((color, i) => [i / len, color])
        //colors[colors.length - 1] = colors[colors.length - 1][0]
        colors = colors.flat()
        console.log(colors)
        return [
            "interpolate",
            ["linear"],
            ["get", "pd"],
            ...colors
        ]
    }

    export let update;

    onMount(() => {
        fetch(`/phast/CA_hexbinned@${hexagonFetchResolution ?? 5}_populated.json`)
            .then((data) => data.json())
            .then((hex) => hexagons = hex)
            .then(() => {

                console.log(generatePalette())

                map.addSource('hexlayer', {
                    'type': 'geojson',
                    'data': hexagons
                });
                map.addLayer({
                    'id': 'hex',
                    'type': 'fill',
                    'source': 'hexlayer',
                    'layout': {},
                    'paint': {
                        "fill-color": generatePalette(),
                        'fill-opacity': 0.8
                    }
                });


                let hexBounds = geojsonExtent(hexagons)
                let rightPadding = (window.innerWidth) / 3;

                //populateFeatures(hexagons).then((featurec) => console.log(featurec))

                console.log(hexBounds)
                map.fitBounds(hexBounds, {
                    padding: { top: 50, left: 10, bottom: 50, right: rightPadding }
                })
                
                map.on('click', 'hex', (e) => {
                    let cell = h3.latLngToCell(e.lngLat.lat, e.lngLat.lng, hexagonFetchResolution)
                    console.log(cell)
                    update({
                        latlng: e.lngLat,
                        hex: cell,
                        properties: e.features[0].properties
                    })
                });

                map.on('mouseenter', 'hex', () => {
                    map.getCanvas().style.cursor = 'pointer';
                });

                // Change it back to a pointer when it leaves.
                map.on('mouseleave', 'hex', () => {
                    map.getCanvas().style.cursor = '';
                });




            })
    });


</script>

<MapLibre
  bind:map
  bind:loaded
  style="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
  standardControls
  center={[-98.137, 40.137]}
  zoom={4}
>
<!-- {#if hexagons}
  <GeoJSON id="hexagons" data={hexagons}>
      <FillLayer
        id="hex-fill"
        paint={{
          'fill-color': '#00ffff',
          'fill-opacity': 0.5,
        }}
        beforeLayerType="symbol"
        on:click={(e) => console.log(e)}
      />
      <LineLayer
        layout={{ 
            'line-cap': 'round', 
            'line-join': 'round' 
        }}
        paint={{ 
            'line-color': '#0000ff', 
            'line-width': 1 
        }}
        beforeLayerType="symbol"
      />
  </GeoJSON>
{/if} -->
</MapLibre>

<style>
    :global(.map) {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 0;
    }
</style>