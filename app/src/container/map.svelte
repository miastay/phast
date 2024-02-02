<head>
    <link href="https://api.mapbox.com/mapbox-gl-js/v3.1.2/mapbox-gl.css" rel="stylesheet">
    <script src="https://api.mapbox.com/mapbox-gl-js/v3.1.2/mapbox-gl.js"></script>
</head>

<script>

    import * as h3 from 'h3-js';
    import * as geojson2h3 from 'geojson2h3';

    let map = this;
    
    if (!map) {
        map = new mapboxgl.Map({
            container: mapContainer,
            center: [
                config.lng,
                config.lat,
            ],
            zoom: config.zoom,
            style: 'mapbox://styles/mapbox/light-v9'
        });
    }
    
    // Wait until the map loads, then yield the container again.
    // yield new Promise(resolve => {
    //     if (map.loaded()) resolve(map);
    //     else map.on('load', () => resolve(map));
    // });
    


    const centerHex = h3.geoToH3(config.lat, config.lng, 8);
    const kRing = h3.kRing(centerHex, 3);
    // Reduce hexagon list to a map with random values
    let hexagons = kRing.reduce((res, hexagon) => ({...res, [hexagon]: Math.random()}), {});

    renderHexes(map, hexagons);

    function renderHexes(map, hexagons) {
        
        // Transform the current hexagon map into a GeoJSON object
        const geojson = geojson2h3.h3SetToFeatureCollection(
            Object.keys(hexagons),
            hex => ({value: hexagons[hex]})
        );
        
        const sourceId = 'h3-hexes';
        const layerId = `${sourceId}-layer`;
        let source = map.getSource(sourceId);
        
        // Add the source and layer if we haven't created them yet
        if (!source) {
            map.addSource(sourceId, {
            type: 'geojson',
            data: geojson
            });
            map.addLayer({
            id: layerId,
            source: sourceId,
            type: 'fill',
            interactive: false,
            paint: {
                'fill-outline-color': 'rgba(0,0,0,0)',
            }
            });
            source = map.getSource(sourceId);
        }

        // Update the geojson data
        source.setData(geojson);
        
        // Update the layer paint properties, using the current config values
        map.setPaintProperty(layerId, 'fill-color', {
            property: 'value',
            stops: [
            [0, config.colorScale[0]],
            [0.5, config.colorScale[1]],
            [1, config.colorScale[2]]
            ]
        });
        
        map.setPaintProperty(layerId, 'fill-opacity', config.fillOpacity);
    }

</script>

<div>
    <h1><div>phast</div></h1>
</div>

<style lang="scss">
    h1 {
        color: blue;
    }
</style>