<script>
	import { onMount } from 'svelte';
    import { FillLayer, LineLayer, MapLibre, GeoJSON } from 'svelte-maplibre';
    import geojsonExtent from '@mapbox/geojson-extent';
    import * as h3 from 'h3-js';

    import { objToDict, populateFeatures } from '../util/populate_hexbins';
    import { getPalette, getDiscretePalette } from '../util/colors';

    let hexagonFetchResolution = 6;
    const centerOfCalifornia = [-119.449444, 37.166111];

    export let metric;
    export let colorScheme;

    let selectedFeature, selectedId;
    let selectedHexStyle = {
        // "layout": {
        //     "line-join": "round",
        //     "line-cap": "round"
        // },
        "paint": {
            "line-color": "#00ffff",
            "line-width": 5
        }
    }

    let map;//: maplibregl.Map | undefined;
    let loaded = false//: boolean;
    let textLayers;//: maplibregl.LayerSpecification[] = [];
    $: if (map && loaded) {
        textLayers = map.getStyle().layers.filter((layer) => layer['source-layer'] === 'place');
        console.log(textLayers)
        //map.flyTo(centerOfCalifornia)
    }
    $: if(map && loaded) updateMetricPaintLayer(metric)
    //$: if(map && loaded) map.setPaintProperty('hex', 'fill-color', generatePalette(metric, colorScheme, true))
    // $: if (map && loaded) {
    // for (let layer of textLayers) {
    //     map.setPaintProperty(layer.id, 'text-color', colors.textColor);
    //     map.setPaintProperty(layer.id, 'text-halo-color', colors.textOutlineColor);
    // }
    // }

    function updateMetricPaintLayer(met) {

        // we try to find a workaround to transitions not firing on feature-state changes, see: https://github.com/mapbox/mapbox-gl-js/issues/11748

        let pal = generatePalette(met, colorScheme, true)
        map.setPaintProperty('hex', 'fill-color', pal)
        map.setPaintProperty('hex', 'fill-color-transition', { duration: 500, delay: 0})
        //map.setPaintProperty('hex', 'fill-color', `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`)
    }



    let rightPadding;
    const showBorder = true;
    const showFill = true;
    let hexagons;
    let hexdata = {};

    let maxes, mins;
    let mapPalette = getPalette(0, 5000, colorScheme);

    function generatePalette(m, scheme, interp = true) {
        if(!maxes || !mins) return;

        if(interp) {

            mapPalette = getPalette(mins[m], maxes[m], scheme);
            console.log(mapPalette)
            const len = mapPalette.length
            let colors = mapPalette.map((color, i) => [color[0], color[1]])
            //colors[colors.length - 1] = colors[colors.length - 1][0]
            colors = colors.flat()
            console.log(colors)
            
            return [
                "interpolate",
                ["linear"],
                ["get", m],
                ...colors
            ]
        }
        else {

            // mapPalette = getDiscretePalette(mins[m], maxes[m], scheme);
            // let colors = mapPalette.map((color, i) => [color[0], color[1]])
            // colors[colors.length - 1] = colors[colors.length - 1][0]
            // colors = colors.flat()
            // colors = colors.slice(1)
            // console.log(colors)
            return [
                "step",
                ["get", m],
                "#ccc", 0,
                "#fc4e2a", 600,
                "#00E676", 1300,
                "#2a4e9b"
                //"#ffeda0",10,"#ffeda0",20,"#fed976",50,"#feb24c",100,"#fd8d3c",200,"#fc4e2a",500,"#e31a1c"
            ]


            return ["step",["get",m],"#ffeda0",10,"#ffeda0",20,"#fed976",50,"#feb24c",100,"#fd8d3c",200,"#fc4e2a",500,"#e31a1c",750,"hsl(348, 100%, 37%)",1000,"#bd0026"]
        }
    }

    export let update;

    onMount(() => {
        fetch(`/phast/CA_hexbinned@${hexagonFetchResolution ?? 5}_birds.json`)
            .then((data) => data.json())
            .then((hex) => hexagons = hex)
            .then(() => {

                maxes = hexagons.properties?.maxes
                mins = hexagons.properties?.mins
                //populateFeatures(hexagons, hexagonFetchResolution).then((pop) => console.log(pop));

                // fetch('/phast/data/initial_poly_bird_data.json')
                // .then((data) => data.json())
                // .then((obj) => console.log(objToDict(obj)));

                const layers = map.getStyle().layers;
                console.log(layers)
                // Find the index of the first symbol layer in the map style
                let firstSymbolId = layers[71].id;
                // for (let i = 0; i < layers.length; i++) {
                //     if (layers[i].id === 'symbol') {
                //         firstSymbolId = layers[i].id;
                //         break;
                //     }
                // }

                console.log(map)
                map.doubleClickZoom._clickZoom._enabled = false;
                map.doubleClickZoom._tapZoom._enabled = false;

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
                        "fill-color": generatePalette(metric ?? "pd", colorScheme, false),
                        "fill-opacity": 0.75,
                        "fill-color-transition": {
                            "duration": 1000,
                            "delay": 0
                        },
                    },
                }, firstSymbolId);

                map.on('load', () => {
                    let hexBounds = geojsonExtent(hexagons)
                    rightPadding = (window.innerWidth) / 3;

                    console.log(hexBounds)
                    map.setMaxBounds([[-130, 30], [-100, 45]])
                    map.fitBounds(hexBounds, {
                        padding: { top: 50, left: 10, bottom: 50, right: rightPadding }
                    })
                    

                    map._canvas.style.filter = "none";

                    setInterval(() => {
                        }, 1000);


                })

                // backup in case the load event doesn't fire properly
                setTimeout(() => {
                    map._canvas.style.filter = "none";
                }, 3000)

                
                map.on('click', 'hex', (e) => {

                    let cell = h3.latLngToCell(e.lngLat.lat, e.lngLat.lng, hexagonFetchResolution)
                    
                    // map.fitBounds([
                    //     [32.958984, -5.353521],
                    //     [43.50585, 5.615985]
                    // ]);
                    //zoomToHexagon(cell, map)
                    map.flyTo([e.lngLat.lat, e.lngLat.lng])

                    // highlight hexagon clicked with new line layer

                    /*
                    let features = map.queryRenderedFeatures(e.point, { layers: ['hex'] });
                    if (!features.length) {
                        return;
                    }
                    if (typeof map.getLayer('selected-hex') !== "undefined"){         
                        map.removeLayer('selected-hex')
                        map.removeSource('selected-hex');  
                        if(cell == selectedId) {
                            update({});
                            return;
                        } 
                    }
                    
                    selectedFeature = features[0];
                    selectedId = cell;
                    map.addSource('selected-hex', {
                        "type":"geojson",
                        "data": selectedFeature.toJSON()
                    });
                    map.addLayer({
                        "id": "selected-hex",
                        "type": "line",
                        "source": "selected-hex",
                        ...selectedHexStyle
                    });

                    */
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