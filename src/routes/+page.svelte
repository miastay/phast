<script>
	import Controls from '../component/controls.svelte';
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

    let metricLayer = "pd";
    function updateMetricLayer(layer) {
        metricLayer = layer;
    }

</script>

<Map update={updateSelectionData} metric={metricLayer}/>
<Modal selectionData={selectionData} metric={metricLayer}/>
<Legend />
<Controls updateMetricLayer={updateMetricLayer}/>