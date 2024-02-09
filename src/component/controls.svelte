<script>
    import Select from "@smui/select";
	import { Option } from "@smui/select";
    import { metrics } from "../util/make_confidence_intervals";

    export let updateMetricLayer;
    export let updateColorScheme;

    let metric;

    let colorScheme;

    import { schemes } from '../util/colors';
    const colors = Object.keys(schemes)
    
</script>

<div class='controls'>
    <select bind:value={metric} on:change={() => updateMetricLayer(metric)} label="Diversity Metric">
        {#each metrics as opt}
          <option value={opt}>{opt}</option>
        {/each}
    </select>
    <select bind:value={colorScheme} on:change={() => updateColorScheme(colorScheme)} label="Color Scheme">
        {#each colors as opt}
          <option value={opt}>{opt}</option>
        {/each}
    </select>
</div>

<style lang="scss">
    .controls {
        position: absolute;
        left: 10px;
        bottom: 200px;
    }
</style>