<script>
	import Modal from '../component/modal.svelte';
	import Leaflet from '../container/leaflet.svelte';
    import Map from "../container/map.svelte";
	import Mapbox from "../container/mapbox.svelte";

    let selectedCoordinates = {
        lat: 0,
        lng: 0
    };

    function updateSelectedCoordinates(latlng) {
        console.log("updating!!")
        selectedCoordinates = latlng
    }

</script>

<Leaflet update={updateSelectedCoordinates}/>

<Modal selectedCoordinates={selectedCoordinates}/>