<script>
    import { onMount } from 'svelte';
    import Select from "@smui/select";
	import { Option } from "@smui/select";
    import { schemes } from '../util/colors';

    import { baseFillOpacity } from '../store';

    export let updateColorScheme;
    export let updateShowCounties;
    export let updateShowEcoregions;
    export let updateDrawing;
    export let updateDrawnPath;

    export let isDrawing;

    let colorScheme;
    let showCounties;
    let showEcoregions;

    let mountBaseFillOpacity = $baseFillOpacity;
    
    const colors = Object.keys(schemes)

    onMount(() => {
        updateColorScheme(colorScheme)
    })
    
</script>

<div class='controls'>
    <div class="control-item">
        <h4>Palette</h4>
        <select bind:value={colorScheme} on:change={() => updateColorScheme(colorScheme)} label="Color Scheme">
            {#each colors as opt}
              <option value={opt}>{opt}</option>
            {/each}
        </select>
    </div>
    <div class="control-item">
        <h4>Show county lines?</h4>
        <input type="checkbox" bind:checked={showCounties} on:change={() => updateShowCounties(showCounties)}/>
    </div>
    <div class="control-item">
        <h4>Show ecoregions?</h4>
        <input type="checkbox" bind:checked={showEcoregions} on:change={() => updateShowEcoregions(showEcoregions)}/>
    </div>
    <div class="control-item">
        <h4>Draw Mode?</h4>
        <button on:click={() => updateDrawing(true)}>Draw Polygon</button>
        <button on:click={() => updateDrawnPath(null)}>Reset</button>
    </div>
    <div class="control-item">
        <h4>Fill Opacity</h4>
        <input type="range" min="0" max="100" value={mountBaseFillOpacity * 100} on:input={(e) => baseFillOpacity.set(Number.parseInt(e.target.value) / 100)}/>
    </div>
</div>

<style lang="scss">

    @import '../style/frames.scss';
    @import '../style/colors.scss';
    .controls {

        @include container;

        cursor: default;
        user-select: none;

        display: flex;
        flex-direction: column;

        gap: 1rem;
        background-color: #ffffffaa;
        backdrop-filter: blur(50px);

        .control-item {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
            h4 {
                font-size: 1rem;
                margin-block: 0;
                color: $dark-gray;
            }
        }
    }
</style>