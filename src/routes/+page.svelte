<script>
	import Legend from '../component/legend.svelte';
    import Logo from '../component/logo.svelte';
    import Modal from '../component/modal.svelte';
    import Map from "../container/map.svelte";

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
<Legend />