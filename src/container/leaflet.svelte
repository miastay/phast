<script>
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment';

    let mapElement;
    let map;

    export let update;

    const hexStyle = {
        "fillColor": "#00ff00",
        "color": "#00ff00",
        "weight": 1,
        "opacity": 0.65
    }

    const centerOfCalifornia = [37.166111, -119.449444]

    onMount(async () => {

        if(browser) {
            const leaflet = await import('leaflet');

            map = leaflet.map(mapElement).setView(centerOfCalifornia, 13);

            leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            // leaflet.marker([51.5, -0.09]).addTo(map)
            //     .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
            //     .openPopup();

            fetch("/phast/CA_hexbinned@5.json")
            .then((data) => data.json())
            .then((hexagons) => {
                console.log(hexagons)


                let hexLayer = leaflet.geoJSON(
                    hexagons, 
                    {   style: hexStyle,
                        onEachFeature: onEachHex
                    }
                ).addTo(map);

                let windowHeight = window.innerHeight;
                console.log(windowHeight)
                let minZoomByHeight = windowHeight / 105;

                let windowWidth = window.innerWidth;
                let rightPadding = (windowWidth) / 3;

                /**
                 * 600: 5.7
                 * 700: 6
                 * 800: 
                */

                //map.setMinZoom(6.5)
                map.flyToBounds(hexLayer.getBounds(), {
                    paddingTopLeft: [0,0],
                    paddingBottomRight: [rightPadding,50],
                    duration: 0.4
                })

            })

        }
    });

    function handleHexClick(e) {
        update(e.latlng); 
    }

    function onEachHex(feature, layer) {
        layer.on({
            //mouseover: highlightFeature,
            //mouseout: resetHighlight,
            click: handleHexClick
        });
    }

    onDestroy(async () => {
        if(map) {
            console.log('Unloading Leaflet map.');
            map.remove();
        }
    });
  </script>
  
  <div bind:this={mapElement}></div>

<style>
    @import 'leaflet/dist/leaflet.css';
    div {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 0;
    }
    .leaflet-tile-pane {
        filter: saturate(0);
    }
</style>
  