<script>
	import Modal from '../component/modal.svelte';
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

<Mapbox update={updateSelectedCoordinates}/>
<Modal selectedCoordinates={selectedCoordinates}/>