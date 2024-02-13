<script>
    import { onMount } from 'svelte';
    import Select from "@smui/select";
	import { Option } from "@smui/select";
    import { metrics } from "../util/make_confidence_intervals";
    import { schemes } from '../util/colors';

    export let updateMetricLayer;
    export let updateColorScheme;
    export let updateShowCounties;

    let metric;
    let colorScheme;
    let showCounties;
    
    const colors = Object.keys(schemes)

    onMount(() => {
        updateMetricLayer(metric)
        updateColorScheme(colorScheme)
    })
    
</script>

<div class='controls'>
    <div class="control-item">
        <h4>Metric</h4>
        <select bind:value={metric} on:change={() => updateMetricLayer(metric)} label="Diversity Metric">
            {#each metrics as opt}
              <option value={opt}>{opt}</option>
            {/each}
        </select>
    </div>
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