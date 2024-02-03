<script>
	import Modal from '../component/modal.svelte';
	import Leaflet from '../container/leaflet.svelte';
    import Map from "../container/map.svelte";
	import Mapbox from "../container/mapbox.svelte";

    let selectionData = {
        latlng: {lat: 0, lng: 0},
        hex: ""
    };

    function updateSelectionData(data) {
        console.log("updating!!")
        selectionData = data
    }

</script>

<Map update={updateSelectionData}/>

<Modal selectionData={selectionData}/>