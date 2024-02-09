<script>
    import Select from "@smui/select";
	import { Option } from "@smui/select";

    export let updateMetricLayer;
    let metric;
    const options = ["pd", "mpd", "mntd"]
    
</script>

<div class='controls'>
    <select bind:value={metric} on:change={() => updateMetricLayer(metric)} label="Diversity Metric">
        {#each options as opt}
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