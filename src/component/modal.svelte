<script>

    import CircularProgress from '@smui/circular-progress';

	import { generateRelativeMetric } from '../util/model';
    import Select, { Option } from '@smui/select';
	import Graph from "./graph.svelte";
	import Phylo from "./phylo.svelte";
	import Builder from './builder.svelte';
	import Loader from './loader.svelte';
	import Summary from './summary.svelte';
    import { metrics } from "../util/model";
	import { nullModel, selectionData, visualLayer, metric } from '../store';
	import About from './about.svelte';

    export let colorScheme;

    export let clade;
    export let updateClade;
    export let clades;

    export let visualLayers;


    export let isBuilt;
    export let showEcoregions;

    export let isFinishedBuilding;

    let showSummary;
    $: updateSummary($selectionData);
    $: updateClade(clade);

    const updateSummary = (selection) => {
        showSummary = selection?.properties && selection?.properties[metric] !== -1;
    }

</script>

<div class={'modal'}>

    {#if $nullModel}
        <div class='header'>
            <div class='test'>
                Testing
                <Select class="shaped" variant="outlined" bind:value={$metric}>
                    {#each metrics as opt}
                        <Option value={opt}>{opt}</Option>
                    {/each}
                </Select>
                of
                <Select class="shaped" variant="outlined" bind:value={clade}>
                    {#each clades as opt}
                        <Option value={opt}>{opt}</Option>
                    {/each}
                </Select>
                at the
                <Select class="shaped" variant="outlined" bind:value={$visualLayer}>
                    {#each visualLayers as opt}
                        <Option value={opt}>{opt}</Option>
                    {/each}
                </Select>
                level
            </div>
            {#if showSummary}
                <div class="close">
                    <button on:click={() => { updateSummary(null); selectionData.set(null); console.log($selectionData)}}>x</button>
                </div>
            {/if}
            <!-- {#if showSummary}
            <div>
                <span>Value: {selectionData.properties[metric]}, Tree Size: {selectionData.properties['tree_sizes']}, Rel: {generateRelativeMetric(metric, selectionData.properties[metric], selectionData.properties['tree_sizes'])}</span>
            </div>
            {/if} -->
            
        </div>
        <!-- <button on:click={() => console.log(JSON.stringify($nullModel))}>null</button> -->
        
        {#if !isFinishedBuilding}
            <div class="load">
                <Loader message="Building model..."/>
            </div>
        {/if}

        {#if !showSummary}
            <About />
        {/if}

        {#if showSummary}
            <Summary data={$selectionData} />
            <Graph colorScheme={colorScheme} metric={metric} point={[[$selectionData?.properties?.tree_sizes, $selectionData?.properties[metric]]]}/>
            <Phylo clade={clade} present={$selectionData?.properties?.present} newick={$selectionData?.properties?.tree} hex_id={$selectionData?.properties?.id}/>
        {/if}
    {/if}

    {#if !$nullModel}
        <Builder showEcoregions={showEcoregions}/>
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
        //width: 35vw;
        width: min-content;
        min-width: 450px;
        height: 100%;
        padding: 0;
        box-sizing: border-box;

        .load {
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }

        .header {

            display: flex;
            flex-direction: row;
            justify-content: space-between;
            background: $theme-500;
            padding: 1rem;
            box-shadow: 0px 2px 6px #00000055;

            .test {
                display: flex;
                flex-direction: row;
                align-items: center;
                gap: 1rem;
            }

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
                background: transparent;
                box-shadow: 0px 0px 1px #00000055;
                border: solid 1px $theme-700;
                border-radius: 5px;
                color: $theme-700;
                &:active {
                    filter: brightness(0);
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

    :global(.mdc-select__anchor) {
        width: auto;
    }

</style>