<script>
	import { onMount } from 'svelte';
    import { FillLayer, LineLayer, MapLibre, GeoJSON, Marker } from 'svelte-maplibre';
    import geojsonExtent from '@mapbox/geojson-extent';
    import * as h3 from 'h3-js';

    import { objToDict, populateFeatures } from '../util/populate_hexbins';
    import { getPalette, getDiscretePalette } from '../util/colors';

    import { metrics } from "../util/make_confidence_intervals";

    let hexagonFetchResolution = 6;
    const centerOfCalifornia = [-119.449444, 37.166111];

    export let metric;
    export let colorScheme;
    export let selectionData;
    export let showCounties;

    const layerTransitionTime = 500;

    let map;//: maplibregl.Map | undefined;
    let loaded = false//: boolean;
    let textLayers;//: maplibregl.LayerSpecification[] = [];
    let firstSymbolId;
    let marker;
    let selectedLngLat = [-119.449444, 37.166111];

    $: if (map && loaded) {
        textLayers = map.getStyle().layers.filter((layer) => layer['source-layer'] === 'place');
        console.log(textLayers)
    }
    $: if(map && loaded) updateMetricPaintLayer(metric)
    $: if(map && loaded) updateLayerPalettes(colorScheme)
    $: if(map && loaded) updateShowCounties(showCounties)

    function updateMetricPaintLayer(met) {

        console.log(met)
        // we try to find a workaround to transitions not firing on feature-state changes, see: https://github.com/mapbox/mapbox-gl-js/issues/11748
        map.moveLayer(`hex-${met}`, 'place_hamlet');

        setTimeout(() => {
            clearHexLayers([`hex-${met}`])
        }, layerTransitionTime / 4);

        map.setPaintProperty(`hex-${met}`, 'fill-opacity', 1)
    }

    function clearHexLayers(exclude = []) {
        let layersToClear = map.getStyle().layers.filter((layer) => layer.source === "hexlayer" && !(exclude.includes(layer.id)))
        for(let layer of layersToClear) {
            map.setPaintProperty(layer.id, 'fill-opacity', 0)
        }
    }
    function updateLayerPalettes(colors) {
        let hexLayers = map.getStyle().layers.filter((layer) => layer.source === "hexlayer")
        for(let layer of hexLayers) {
            let layerMetric = layer.id.split('-')[1]
            let pal = generatePalette(layerMetric, colors, true)
            console.log("palette:", pal)
            map.setPaintProperty(layer.id, 'fill-color', pal)
        }
    }

    function updateShowCounties(shown) {
        if(shown) {
            map.setPaintProperty('counties', 'line-opacity', 1)
        } else {
            map.setPaintProperty('counties', 'line-opacity', 0)
        }
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
        console.log("generating for ", m)
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

            return [
                "step",
                ["get", m],
                "#ccc", 0,
                "#fc4e2a", 600,
                "#00E676", 1300,
                "#2a4e9b"
            ]

        }
    }

    export let update;

    onMount(() => {
        fetch(`/phast/CA_hexbinned@${hexagonFetchResolution ?? 5}_birds_err.json`)
            .then((data) => data.json())
            .then((hex) => hexagons = hex)
            .then(() => {

                maxes = hexagons.properties?.maxes
                mins = hexagons.properties?.mins

                //populateFeatures(hexagons, hexagonFetchResolution).then((txt) => console.log(txt))
                
                // Find the index of the first symbol layer in the map style
                const layers = map.getStyle().layers;
                let firstSymbolId = layers[71].id;

                console.log(map)
                map.doubleClickZoom._clickZoom._enabled = false;
                map.doubleClickZoom._tapZoom._enabled = false;


                // generate one layer per metric, we fade opacity rather than feature-state switching

                map.addSource('hexlayer', {
                    'type': 'geojson',
                    'data': hexagons
                });
                for(let mt of metrics) {
                    let id = `hex-${mt}`
                    map.addLayer({
                        'id': id,
                        'type': 'fill',
                        'source': 'hexlayer',
                        'layout': {},
                        'paint': {
                            "fill-color": generatePalette(mt, colorScheme, true),
                            "fill-opacity": 0.75,
                            "fill-color-transition": {
                                "duration": 500,
                                "delay": 0
                            },
                        },
                    }, firstSymbolId);
                    console.log("added layer for ", mt)
                }
                //console.log(map.getStyle().layers)
                loadLineFeatures('California_County_Boundaries.geojson', 'counties', map);

                let firstMetricId = `hex-${metrics[0]}`;
                map.on('click', firstMetricId, (e) => {
                    console.log(e)
                    let cell = h3.latLngToCell(e.lngLat.lat, e.lngLat.lng, hexagonFetchResolution)
                    zoomToHexagon(cell, map)
                    if(cell === selectionData?.hex) {
                        update(null)
                        return;
                    }

                    console.log(map.getStyle().layers)

                    let newLatLng = h3.cellToLatLng(cell);
                    selectedLngLat = {lng: newLatLng[1], lat: newLatLng[0]}

                    console.log(cell)
                    update({
                        latlng: e.lngLat,
                        hex: cell,
                        properties: e.features[0].properties
                    })
                    
                });
                map.on('mouseenter', firstMetricId, () => {
                    map.getCanvas().style.cursor = 'pointer';
                });
                map.on('mouseleave', firstMetricId, () => {
                    map.getCanvas().style.cursor = '';
                });

                //map.on('load', () => {
                   // console.log("loaded")
                    zoomFitCenter();
                    //zoomFitAnim();
                //})

                // backup in case the load event doesn't fire properly
                setTimeout(() => {
                    console.log("no load on timeout")
                    map._canvas.style.filter = "none";
                    if(!loaded) {
                        zoomFitCenter();
                        //zoomFitAnim();
                    }
                }, 3000)

                //generateReserveSurfaces(map);

        })
        
    });

    async function zoomFitAnim() {
        let hexBounds = geojsonExtent(hexagons)
        rightPadding = (window.innerWidth) / 3;

        //map.setMaxBounds([[-130, 30], [-100, 45]])
        map.fitBounds(hexBounds, {
            padding: { top: 50, left: 10, bottom: 50, right: rightPadding }
        })

        map._canvas.style.filter = "none";
    }

    function zoomFitCenter() {
        let hexBounds = geojsonExtent(hexagons)
        map.fitBounds(hexBounds, {
            padding: { top: 50, left: 10, bottom: 50, right: 50 }
        })
    }

    function zoomToHexagon(index, map) {

        let center = h3.cellToLatLng(index);
        console.log(center)

        rightPadding = (2 * (window.innerWidth)) / 5;

        map.flyTo({center: [center[1], center[0]], essential: true,
            padding: { right: rightPadding},
            duration: 750
        })

        // let minLat, maxLat, minLon, maxLon;
        // let vertices = h3.cellToBoundary(index).flat();
        // let lats = vertices.filter(function(x, i) { return i % 2 == 0; });
        // let lngs = vertices.filter(function(x, i) { return i % 2 == 1; });

        // console.log(lats)
        // console.log(lngs)

        // minLat = Math.min(...lats); maxLat = Math.max(...lats);
        // minLon = Math.min(...lngs); maxLon = Math.max(...lngs);
        // map.fitBounds([
        //     [minLon, minLat],
        //     [maxLon, maxLat]
        // ], {
        //     padding: { top: 100, left: 50, bottom: 100, right: rightPadding},
        //     duration: 750
        // });
    }

    async function loadLineFeatures(path, id, map) {
        fetch(`/phast/${path}`)
        .then((data) => data.json())
        .then((surface) => {
            map.addSource(path, {
                'type': 'geojson',
                'data': surface
            });
            map.addLayer({
                'id': id,
                'type': 'line',
                'source': path,
                'layout': {},
                'paint': {
                    "line-color": "#000000",
                    "line-width": 0.25,
                    "line-opacity": 0
                },
            });
            console.log("added surface layer")
        })
    }

    function generateReserveSurfaces(map) {
        fetch(`/phast/surfaces/Angelo_Boundary.geojson`)
        .then((data) => data.json())
        .then((surface) => {
            console.log(surface)
            map.addSource('angelo_reserve', {
                'type': 'geojson',
                'data': surface
            });
            map.addLayer({
                'id': 'angelo',
                'type': 'fill',
                'source': 'angelo_reserve',
                'layout': {},
                'paint': {
                    "fill-color": "#ff0000",
                },
            });
            console.log("added surface layer")
        })
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
{#if selectionData?.hex}
    <Marker
        bind:this={marker}
        lngLat={selectedLngLat}
        class="hex-marker" 
    >
        <svg class="marker-svg" id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 70.46 62.88">
            <defs>
            <style>
                .fill {
                    fill: #000;
                    stroke: solid 1px red;
                }
                .stroke {
                    stroke: #fff;
                }
            </style>
            </defs>
            <g id="Layer_1-2" data-name="Layer 1">
            <g>
                <path class="fill" d="m35.23,60.88c-1.81,0-3.43-.93-4.33-2.5L2.68,9.5c-.9-1.57-.9-3.44,0-5,.9-1.57,2.52-2.5,4.33-2.5h56.44c1.81,0,3.43.93,4.33,2.5.9,1.56.9,3.43,0,5l-28.22,48.88c-.9,1.57-2.52,2.5-4.33,2.5Z"/>
                <path d="m63.45,4c1.56,0,2.34,1.05,2.6,1.5.26.45.78,1.65,0,3l-28.22,48.88c-.78,1.35-2.08,1.5-2.6,1.5s-1.82-.15-2.6-1.5L4.41,8.5c-.78-1.35-.26-2.55,0-3,.26-.45,1.03-1.5,2.6-1.5h56.44m0-4H7.01C1.62,0-1.75,5.83.95,10.5l28.22,48.88c1.35,2.33,3.7,3.5,6.06,3.5s4.72-1.17,6.06-3.5l28.22-48.88c2.69-4.67-.67-10.5-6.06-10.5h0Z"/>
            </g>
            </g>
        </svg>
    </Marker>
{/if}
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

<style lang="scss">
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
    :global(.hex-marker) {
        width: 30px;
        top: -9px;
        overflow: visible;
        &:hover {
            cursor: pointer;
        }
    }
</style>