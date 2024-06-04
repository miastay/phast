<script>
    import Logo from "./logo.svelte";
    import Select, { Option } from '@smui/select';
    import { nullModel, selectionData, visualLayer, metric } from '../store';
    import { metrics } from "../util/model";

    export let updateMetricLayer;

    export let clade;
    export let updateClade;
    export let clades = [];

    export let visualLayers = [];

</script>

<div class="menu">
    <div class="logo"><Logo white/></div>
    <div class='test'>
        Testing
        <Select class="shaped" variant="outlined" bind:value={$metric} on:change={() => updateMetricLayer(metric)}>
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
</div>

<style lang="scss">
    @import '../style/colors.scss';
    @import '../style/frames.scss';
    .menu {
        @include container;
        &:hover {
            background: $theme-500;
        }
        position: fixed;
        left: 1rem;
        top: 1rem;
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 2rem;
        padding: 1rem;
        background: $theme-500;
        color: white;
        .logo {
            height: 30px;
        }
    }
</style>