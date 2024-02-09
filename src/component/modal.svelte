<script>
	import Graph from "./graph.svelte";
    export let selectionData;
    export let metric;
</script>

<div class={'modal'}>
    {#if selectionData.properties}
        <h1>{`${selectionData.hex}`}</h1>
        <h3>{`${selectionData.latlng.lat}, ${selectionData.latlng.lng}`}</h3>
        <span>{selectionData.properties[metric]}</span>
        <Graph data={[0.4, 0.7, 0.8, 0.9, 1]} point={[[1.2, selectionData.properties.pd]]}/>
    {/if}
    {#if !selectionData.properties}
    <h3>Click on a hexagon to see data</h3>
    {/if}
</div>

<style lang="scss">

    @import '../style/frames.scss';
    .modal {

        @include container;

        box-shadow: 0px 0px 20px #00000055;
        position: absolute;
        top: 8vh;
        right: 8vh;
        height: 82vh;
        width: 35vw;
        padding: 2rem;
        box-sizing: border-box;
        flex-direction: column;
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