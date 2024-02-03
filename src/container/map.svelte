<script>
	import { onMount } from 'svelte';
    import { FillLayer, LineLayer, MapLibre, GeoJSON } from 'svelte-maplibre';
    import geojsonExtent from '@mapbox/geojson-extent';

    let hexagonFetchResolution = 6;
    const centerOfCalifornia = [37.166111, -119.449444];

    let map;//: maplibregl.Map | undefined;
    let loaded = false//: boolean;
    let textLayers;//: maplibregl.LayerSpecification[] = [];
    $: if (map && loaded) {
        textLayers = map.getStyle().layers.filter((layer) => layer['source-layer'] === 'place');
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

    onMount(() => {
        fetch(`/phast/CA_hexbinned@${hexagonFetchResolution ?? 5}.json`)
            .then((data) => data.json())
            .then((hex) => hexagons = hex)
            .then(() => {
                let hexBounds = geojsonExtent(hexagons)
                let rightPadding = (window.innerWidth) / 3;
                console.log(hexBounds)
                map.fitBounds(hexBounds, {
                    padding: { top: 50, left: 10, bottom: 50, right: rightPadding }
                })
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
{#if hexagons}
  <GeoJSON id="hexagons" data={hexagons}>
      <FillLayer
        id="hex-fill"
        paint={{
          'fill-color': '#00ffff',
          'fill-opacity': 0.5,
        }}
        beforeLayerType="symbol"
        manageHoverState
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
{/if}
</MapLibre>

<style>
    :global(.map) {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 0;
    }
</style>