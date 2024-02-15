<script>
	import { generateRelativeMetric } from '../util/model';
	import Graph from "./graph.svelte";
	import Phylo from "./phylo.svelte";
    export let selectionData;
    export let metric;
    export let updateData;
    export let colorScheme;

    let showSummary;
    $: showSummary = selectionData.properties && selectionData.properties[metric] !== -1;

</script>

<div class={'modal'}>
    <div class='header'>
        {#if showSummary}
        <div>
            <span>Value: {selectionData.properties[metric]}, Tree Size: {selectionData.properties['tree_sizes']}, Rel: {generateRelativeMetric(metric, selectionData.properties[metric], selectionData.properties['tree_sizes'])}</span>
        </div>
        {/if}
        {#if !showSummary}
        <div>
            <span>No data for this hexagon!</span>
        </div>
        {/if}
        <div class="close">
            <button on:click={() => updateData(null)}>x</button>
        </div>
    </div>
    {#if showSummary}
        <Graph colorScheme={colorScheme} metric={metric} point={[[selectionData.properties.tree_sizes, selectionData.properties[metric]]]}/>
        <Phylo newick={selectionData.properties.tree}/>
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
        justify-content: space-between;

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
        transition: all 0.3s ease;
    }
    .logo {
        width: 50px;
    }
</style>