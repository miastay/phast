<script>
	import { onMount } from 'svelte';
    import { FillLayer, LineLayer, MapLibre, GeoJSON } from 'svelte-maplibre';
    import geojsonExtent from '@mapbox/geojson-extent';
    import * as h3 from 'h3-js';

    import { populateFeatures } from '../populate_hexbins';
    import { getPalette } from '../util/colors';


    let hexagonFetchResolution = 6;
    const centerOfCalifornia = [-119.449444, 37.166111];

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

    let rightPadding;
    const showBorder = true;
    const showFill = true;
    let hexagons;
    let hexdata = {};

    const mapPalette = getPalette();

    function generatePalette() {
        const len = mapPalette.length
        let colors = mapPalette.map((color, i) => [color[0], color[1]])
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

                const layers = map.getStyle().layers;
                // Find the index of the first symbol layer in the map style
                let firstSymbolId;
                for (let i = 0; i < layers.length; i++) {
                    if (layers[i].type === 'symbol') {
                        firstSymbolId = layers[i].id;
                        break;
                    }
                }


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
                        'fill-opacity': 1
                    }
                }, firstSymbolId);


                map.on('load', () => {
                    let hexBounds = geojsonExtent(hexagons)
                    rightPadding = (window.innerWidth) / 3;

                    //populateFeatures(hexagons).then((featurec) => console.log(featurec))

                    console.log(hexBounds)
                    map.fitBounds(hexBounds, {
                        padding: { top: 50, left: 10, bottom: 50, right: rightPadding }
                    })

                    console.log()
                    map._canvas.style.filter = "none";

                })

                
                map.on('click', 'hex', (e) => {


                    let cell = h3.latLngToCell(e.lngLat.lat, e.lngLat.lng, hexagonFetchResolution)
                    // map.fitBounds([
                    //     [32.958984, -5.353521],
                    //     [43.50585, 5.615985]
                    // ]);
                    zoomToHexagon(cell, map)

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

    function zoomToHexagon(index, map) {
        let minLat, maxLat, minLon, maxLon;
        let vertices = h3.cellToBoundary(index).flat();
        let lats = vertices.filter(function(x, i) { return i % 2 == 0; });
        let lngs = vertices.filter(function(x, i) { return i % 2 == 1; });

        console.log(lats)
        console.log(lngs)

        minLat = Math.min(...lats); maxLat = Math.max(...lats);
        minLon = Math.min(...lngs); maxLon = Math.max(...lngs);
        map.fitBounds([
            [minLon, minLat],
            [maxLon, maxLat]
        ], {
            padding: { top: 100, left: 50, bottom: 100, right: rightPadding},
            duration: 750
        });
    }


    const darkMode = false;
    let source = darkMode ? 'dark-matter' : 'positron';

    //https://basemaps.cartocdn.com/gl/{source}-gl-style/style.json
    ///phast/osm_liberty.json

</script>

<MapLibre
  bind:map
  bind:loaded
  style="https://basemaps.cartocdn.com/gl/{source}-gl-style/style.json"  
  standardControls
  center={centerOfCalifornia}
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
    :global(canvas) {
        filter: blur(30px);
        transition: filter 0.5s ease;
    }
</style>