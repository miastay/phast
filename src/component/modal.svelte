<script>

    import CircularProgress from '@smui/circular-progress';

	import { generateRelativeMetric } from '../util/model';
    import Select, { Option } from '@smui/select';
	import Graph from "./graph.svelte";
	import Phylo from "./phylo.svelte";
	import Builder from './builder.svelte';
	import Loader from './loader.svelte';
	import Summary from './summary.svelte';

    export let selectionData;
    export let metric;
    export let updateData;
    export let colorScheme;

    export let clade;
    export let updateClade;
    export let clades;

    export let isBuilt;
    export let showEcoregions;
    export let build;

    export let isFinishedBuilding;

    let showSummary;
    $: if(selectionData) showSummary = selectionData.properties && selectionData.properties[metric] !== -1;
    $: updateClade(clade);

</script>

<div class={'modal'}>

    {#if isBuilt}
        <div class='header'>
            <Select class="shaped" variant="outlined" bind:value={clade}>
                {#each clades as opt}
                    <Option value={opt}>{opt}</Option>
                {/each}
            </Select>
            <div class="close">
                <button on:click={() => updateData(null)}>x</button>
            </div>
            <!-- {#if showSummary}
            <div>
                <span>Value: {selectionData.properties[metric]}, Tree Size: {selectionData.properties['tree_sizes']}, Rel: {generateRelativeMetric(metric, selectionData.properties[metric], selectionData.properties['tree_sizes'])}</span>
            </div>
            {/if} -->
            
        </div>

        
        {#if !isFinishedBuilding}
            <div class="load">
                <Loader />
            </div>
        {/if}

        {#if !showSummary}
            <div>
                <p>Click on a hexagon to see phylogenetic statistics.</p>
            </div>
        {/if}

        {#if showSummary}
            <Summary data={selectionData} />
            <Graph colorScheme={colorScheme} metric={metric} point={[[selectionData.properties.tree_sizes, selectionData.properties[metric]]]}/>
            <Phylo clade={clade} newick={selectionData.properties.tree} hex_id={selectionData.properties.id}/>
        {/if}
    {/if}

    {#if !isBuilt}
        <Builder showEcoregions={showEcoregions} build={build}/>
    {/if}

</div>

<style lang="scss">

    @import '../style/frames.scss';
    @import '../style/colors.scss';
    .modal {

        box-shadow: 0px 0px 20px #00000055;
        background: white;

        display: grid;
        grid-template-rows: 1fr 3fr 5fr;
        grid-template-columns: 1fr;

        position: absolute;
        right: 0;
        width: 35vw;
        height: 100%;

        padding: 0;
        box-sizing: border-box;

        .load {
            height: 50%;
        }

        .header {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            background: $theme-500;
            padding: 1rem;
            box-shadow: 0px 2px 6px #00000055;

            h1 {
                margin-block: 0;
                font-weight: 900;
                color: white;
            }

            > select {
                font-size: 1.75rem;
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
                > option {
                    background: $theme-500 !important;
                    &:hover {
                        background: $theme-600;
                    }
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

    .logo {
        width: 50px;
    }
</style>