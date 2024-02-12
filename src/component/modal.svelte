<script>
	import Graph from "./graph.svelte";
	import Phylo from "./phylo.svelte";
    export let selectionData;
    export let metric;
    export let updateData;
</script>

<div class={'modal'}>
    <div class='header'>
        {#if selectionData.properties}
        <div>
            <h1>{`${selectionData.hex}`}</h1>
            <h3>{`${selectionData.latlng.lat}, ${selectionData.latlng.lng}`}</h3>
            <span>{selectionData.properties[metric]}</span>
        </div>
        {/if}
        {#if !selectionData || !selectionData.properties}
            <h3>Click on a hexagon to see data</h3>
        {/if}
        <div class="close">
            <button on:click={() => updateData(null)}>x</button>
        </div>
    </div>
    {#if selectionData.properties}
        <Graph metric={metric} point={[[selectionData.properties.tree_sizes, selectionData.properties[metric]]]}/>
        <Phylo />
    {/if}
</div>

<style lang="scss">

    @import '../style/frames.scss';
    @import '../style/colors.scss';
    .modal {

        @include container;

        box-shadow: 0px 0px 20px #00000055;
        position: absolute;
        top: 2vh;
        right: 2vh;
        height: 96vh;
        width: 35vw;
        padding: 1rem;
        box-sizing: border-box;
        flex-direction: column;
        align-items: center;
        gap: 2rem;

        .header {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            width: 100%;

            .close > button {
                width: 30px;
                aspect-ratio: 1/1;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background: white;
                box-shadow: 0px 0px 1px #00000055;
                border: solid 1px #00000000;
                border-radius: 5px;
                &:hover {
                    box-shadow: 0px 0px 3px #00000055;
                    border: solid 1px black;
                }
                &:active {
                    background: $light-gray;
                }
                transition: all 0.1s ease;
            }

        }

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