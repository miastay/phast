<script>
	import Controls from '../component/controls.svelte';
	import Drawer from '../component/drawer.svelte';
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

    let showEcoregions = false;
    function updateShowEcoregions(show) {
        showEcoregions = show;
    }

    let drawing = false;
    function updateDrawing(draw) {
        drawing = draw;
    }

    let path = null;
    function updatePath(p) {
        path = p;
    }

    let clade = 'Birds';
    function updateClade(c) {
        clade = c;
    }
    const clades = ['Birds', 'Plants'];

</script>

<Map update={updateSelectionData} metric={metricLayer} colorScheme={colorScheme} selectionData={selectionData} showCounties={showCounties} showEcoregions={showEcoregions} drawnPath={path} clade={clade} clades={clades}/>
{#if selectionData}
    <Modal colorScheme={colorScheme} selectionData={selectionData} metric={metricLayer} updateData={updateSelectionData} clade={clade} clades={clades} updateClade={updateClade}/>
{/if}
<div class='control-container'>
    <Controls updateMetricLayer={updateMetricLayer} updateColorScheme={updateColorScheme} updateShowCounties={updateShowCounties} updateShowEcoregions={updateShowEcoregions} updateDrawing={updateDrawing} drawing={drawing} updateDrawnPath={updatePath}/>
    <Legend colorScheme={colorScheme} metric={metricLayer}/>
</div>
{#if drawing}
    <Drawer updatePath={updatePath} updateIsDrawing={updateDrawing} isDrawing={drawing}/>
{/if}

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