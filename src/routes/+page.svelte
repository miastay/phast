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

    let colorScheme = "blBluCyWt";
    function updateColorScheme(colors) {
        colorScheme = colors;
    }

</script>

<Map update={updateSelectionData} metric={metricLayer} colorScheme={colorScheme}/>
<Modal selectionData={selectionData} metric={metricLayer}/>
<div class='control-container'>
    <Controls updateMetricLayer={updateMetricLayer} updateColorScheme={updateColorScheme}/>
    <Legend colorScheme={colorScheme} metric={metricLayer}/>
</div>

<style lang="scss">
    .control-container {
        position: absolute;
        left: 10px;
        bottom: 40px;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
</style>