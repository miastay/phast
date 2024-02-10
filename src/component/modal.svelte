<script>
	import Graph from "./graph.svelte";
	import Phylo from "./phylo.svelte";
    export let selectionData;
    export let metric;
</script>

<div class={'modal'}>
    <div class='header'>
        {#if selectionData.properties}
            <h1>{`${selectionData.hex}`}</h1>
            <h3>{`${selectionData.latlng.lat}, ${selectionData.latlng.lng}`}</h3>
            <span>{selectionData.properties[metric]}</span>
        {/if}
        {#if !selectionData || !selectionData.properties}
            <h3>Click on a hexagon to see data</h3>
        {/if}
    </div>
    {#if selectionData.properties}
        <Graph metric={metric} point={[[selectionData.properties.tree_sizes, selectionData.properties[metric]]]}/>
        <Phylo />
    {/if}
</div>

<style lang="scss">

    @import '../style/frames.scss';
    .modal {

        @include container;

        box-shadow: 0px 0px 20px #00000055;
        position: absolute;
        top: 2vh;
        right: 2vh;
        height: 96vh;
        width: 35vw;
        padding: 2rem;
        box-sizing: border-box;
        flex-direction: column;
        align-items: center;
        gap: 2rem;
        h1 {
            margin-block: 0;
        }
        &:hover {
            //opacity: 0.5;
        }
        transition: opacity 0.3s ease;
    }
    .logo {
        width: 50px;
    }
</style>