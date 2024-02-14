<script>
	import Controls from '../component/controls.svelte';
    import Legend from '../component/legend.svelte';
    import Logo from '../component/logo.svelte';
    import Modal from '../component/modal.svelte';
    import Map from "../container/map.svelte";

    let selectionData = null

    function updateSelectionData(data) {
        console.log("updating!!")
        selectionData = data
    }

    let metricLayer = "pd";
    function updateMetricLayer(layer) {
        metricLayer = layer;
    }

    let colorScheme = "*ibm_flip";
    function updateColorScheme(colors) {
        colorScheme = colors;
    }

    let showCounties = false;
    function updateShowCounties(show) {
        showCounties = show;
    }

</script>

<Map update={updateSelectionData} metric={metricLayer} colorScheme={colorScheme} selectionData={selectionData} showCounties={showCounties}/>
{#if selectionData}
    <Modal colorScheme={colorScheme} selectionData={selectionData} metric={metricLayer} updateData={updateSelectionData}/>
{/if}
<div class='control-container'>
    <Controls updateMetricLayer={updateMetricLayer} updateColorScheme={updateColorScheme} updateShowCounties={updateShowCounties}/>
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