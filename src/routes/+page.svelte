<script>
	import Controls from '../component/controls.svelte';
	import Drawer from '../component/drawer.svelte';
    import Legend from '../component/legend.svelte';
    import Logo from '../component/logo.svelte';
    import Modal from '../component/modal.svelte';
    import Map from "../container/map.svelte";

    import { nullModel } from '../store';

    let selectionData = null

    function updateSelectionData(data) {
        if(!data) return;
        console.log("updating!!")
        selectionData = data
    }

    let metricLayer = "pd";
    function updateMetricLayer(layer) {
        metricLayer = layer;
    }

    let colorScheme = "*ibm";
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

    let isFinishedBuilding = false;
    function finishBuilding() {
        isFinishedBuilding = true;
    }

    let isBuilt = false;
    $: console.log($nullModel);

</script>

<main>
    <Map finishBuilding={finishBuilding} metric={metricLayer} colorScheme={colorScheme} showCounties={showCounties} showEcoregions={showEcoregions} drawnPath={path} clade={clade} clades={clades}/>
    <Modal isBuilt={isBuilt} isFinishedBuilding={isFinishedBuilding} updateMetricLayer={updateMetricLayer} showEcoregions={updateShowEcoregions} colorScheme={colorScheme} metric={metricLayer} clade={clade} clades={clades} updateClade={updateClade}/>
</main>
{#if $nullModel}
<div class='control-container'>
    <Controls updateColorScheme={updateColorScheme} updateShowCounties={updateShowCounties} updateShowEcoregions={updateShowEcoregions} updateDrawing={updateDrawing} drawing={drawing} updateDrawnPath={updatePath}/>
    <Legend colorScheme={colorScheme} metric={metricLayer}/>
</div>
{/if}
{#if drawing}
    <Drawer updatePath={updatePath} updateIsDrawing={updateDrawing} isDrawing={drawing}/>
{/if}

<style lang="scss">

    main {
        display: grid;
        //grid-template-columns: 3fr 2fr;
        overflow: hidden;
    }

    .control-container {
        position: absolute;
        left: 10px;
        bottom: 40px;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
</style>