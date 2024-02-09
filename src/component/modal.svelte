<script>
	import Graph from "./graph.svelte";
	import Phylo from "./phylo.svelte";
    import { reverseGeocode } from '../util/geocoder';

    export let selectionData;
    export let metric;

    let geocode = "";

    async function runGeocode() {
        reverseGeocode(selectionData.latlng.lat, selectionData.latlng.lng).then((loc) => geocode = loc)
    }
    $: if(selectionData.latlng) reverseGeocode(selectionData.latlng.lat, selectionData.latlng.lng).then((loc) => geocode = loc)

</script>

<div class={'modal'}>
    {#if selectionData.properties}
        <h1>{`bbbb`}</h1>
        <button on:click={runGeocode}>reverseGeocode</button>
        <div class="header">
            <h3>{geocode}</h3>
        </div>
        <code>{`${selectionData.hex} @ ${selectionData.latlng.lat}, ${selectionData.latlng.lng}`}</code>
        <span>{selectionData.properties[metric]}</span>
        <Graph metric={metric} data={[0.4, 0.7, 0.8, 0.9, 1]} point={[[1.2, selectionData.properties[metric]]]}/>
        <Phylo />
    {/if}
    {#if !selectionData || !selectionData.properties}
    <h3>Click on a hexagon to see data</h3>
    {/if}
</div>

<style lang="scss">

    @import '../style/frames.scss';
    .modal {

        @include container;

        box-shadow: 0px 0px 20px #00000055;
        position: absolute;
        top: 8vh;
        right: 8vh;
        height: 82vh;
        width: 35vw;
        padding: 2rem;
        box-sizing: border-box;
        flex-direction: column;

        .header {
            h3 {
                &:before {
                    content: 'Near ';
                    font-weight: 300;
                }
                margin-block: 0;
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