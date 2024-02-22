<script>
	import { generateRelativeMetric } from '../util/model';
	import Graph from "./graph.svelte";
	import Phylo from "./phylo.svelte";
    export let selectionData;
    export let metric;
    export let updateData;
    export let colorScheme;

    export let clade;
    export let updateClade;
    const clades = ['Birds', 'Squamates', 'Plants'];

    let showSummary;
    $: showSummary = selectionData.properties && selectionData.properties[metric] !== -1;

</script>

<div class={'modal'}>
    <div class='header'>
        <select bind:value={clade} on:change={() => updateClade(clade)} label="Clade">
            {#each clades as opt}
              <option value={opt}>{opt}</option>
            {/each}
        </select>
        <div class="close">
            <button on:click={() => updateData(null)}>x</button>
        </div>
        <!-- {#if showSummary}
        <div>
            <span>Value: {selectionData.properties[metric]}, Tree Size: {selectionData.properties['tree_sizes']}, Rel: {generateRelativeMetric(metric, selectionData.properties[metric], selectionData.properties['tree_sizes'])}</span>
        </div>
        {/if} -->
        {#if !showSummary}
        <div>
            <span>No data for this hexagon!</span>
        </div>
        {/if}
    </div>
    <div class='content'>
        {#if showSummary}
            <Graph colorScheme={colorScheme} metric={metric} point={[[selectionData.properties.tree_sizes, selectionData.properties[metric]]]}/>
            <Phylo newick={selectionData.properties.tree} hex_id={selectionData.properties.id}/>
        {/if}
    </div>
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
        padding: 0;
        box-sizing: border-box;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;

        .header {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            width: 100%;
            background: $theme-900;
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
            padding: 1rem;
            box-sizing: border-box;
            box-shadow: 0px 2px 6px #00000055;

            h1 {
                margin-block: 0;
                font-weight: 900;
                color: white;
            }

            > select {
                font-size: 1.5rem;
                font-weight: 900;
                color: white;
                background: none;
                border: solid 1px #ffffff00;
                border-radius: 5px;
                padding: 0.5rem;
                &:hover {
                    border: solid 1px white;
                }
                transition: all 0.3s ease;
                &::after {
                    color: red;
                }
            }

            .close > button {
                width: 30px;
                aspect-ratio: 1/1;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background: $theme-900;
                box-shadow: 0px 0px 1px #00000055;
                border: solid 1px $theme-100;
                border-radius: 5px;
                color: $theme-100;
                &:hover {
                    box-shadow: 0px 0px 3px #00000055;
                    border: solid 1px $theme-100;
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

    .content {
        padding: 1rem;
        width: inherit;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    .logo {
        width: 50px;
    }
</style>