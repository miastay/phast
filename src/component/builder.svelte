<script>
    import Select, { Option } from '@smui/select';
    import Button, { Label } from '@smui/button';
	import Logo from './logo.svelte';

    import { map } from "../store";

    export let showEcoregions;
    export let build;

    export let nullRegion;
    const nullRegions = [
        {
            "name": "All of California",
            "next": null
        },
        {
            "name": "By Ecoregion",
            "next": {
                "name": "ecoregion",
                "options": [
                    { 
                        "name": "Ecoregion 1",
                    },
                    { 
                        "name": "Ecoregion 2",
                    },
                    { 
                        "name": "Ecoregion 3",
                    }
                ]
            }
        },
        {
            "name": "Surface",
            "next": "object"
        },
    ]

    $: if(nullRegion && nullRegion.next?.name === "ecoregion") { showEcoregions(true) } else { showEcoregions(false) };

    export let subNullRegion;
    const subNullRegions = [
        "x", "y", "z"
    ]

    export let altRegion;
    const altRegions = nullRegions;

    function listLayers() {
        let sourceFeatures = $map.querySourceFeatures('ecoregions');
        console.log(sourceFeatures)
        let regions = []
        for(let feat of sourceFeatures) {
            if(regions.filter((x) => x.ids.includes(feat.id)).length == 0) {
                let nm = `${feat.properties.US_L3NAME}`;
                let existingName = regions.filter((x) => x.name === nm)[0];
                console.log(existingName)
                if(!existingName || existingName?.length == 0) {
                    regions.push({
                        ids: [feat.id],
                        name: `${feat.properties.US_L3NAME}`
                    })
                } else {
                    existingName.ids = [...existingName.ids, feat.id]
                }
            }
        }

        regions = regions.sort((a, b) => (a.name).localeCompare(b.name))
        //console.log(sourceFeatures.filter((x) => x.properties.US_L3NAME === "Central Basin and Range"));
        console.log(regions)
        nullRegions[1].next.options = regions;
    }

    $: highlightEcoregion(subNullRegion);

    function highlightEcoregion(subr) {
        if(!subr) return;
        console.log(subr)
        // clear any selected regions
        let sourceFeatures = $map.querySourceFeatures('ecoregions');
        for(let feat of sourceFeatures) {
            $map.setFeatureState(
                { source: 'ecoregions', id: feat.id },
                { hover: false }
            );
        }
        for(let id of subr.ids) {
            $map.setFeatureState(
                { source: 'ecoregions', id: id },
                { hover: true }
            );
        }
    }

</script>

<div class="builder">
    <div class="logo">
        <Logo />
    </div>
    <div class="steps">
        <div class="step">
            <h2>Select a null model</h2>
            <Select class="shaped" variant="filled" bind:value={nullRegion}>
                {#each nullRegions as opt}
                    <Option value={opt}>{opt.name}</Option>
                {/each}
            </Select>
        </div>
    
        {#if nullRegion?.next}
            <div class={`step ${!nullRegion?.next && 'grayed'}`}>
                <h2>Select which {nullRegion?.next?.name} to use</h2>
                
                <Select class="shaped" variant="filled" bind:value={subNullRegion}>
                    {#each nullRegion?.next?.options as opt}
                        <Option value={opt}>{opt.name}</Option>
                    {/each}
                </Select>
            </div>
        {/if}
    
        <div class={`step ${!nullRegion && 'grayed'}`}>
            <h2>Select a different region to compare</h2>
            <Select class="shaped" variant="filled" bind:value={altRegion}>
                {#each altRegions as opt}
                    <Option value={opt}>{opt}</Option>
                {/each}
            </Select>
        </div>
        <Button class="theme-button" variant="raised" on:click={() => build()}>
            <Label>Build</Label>
        </Button>
        <button on:click={() => listLayers()}>list layers</button>
    </div>
</div>

<style lang='scss'>

    @import '../style/colors.scss';

    .builder {

        padding: 2rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        
        .steps {
            display: grid;
            gap: 1rem;
            grid-template-columns: 1fr;
            counter-reset: number;
            .step {
                counter-increment: number;
                padding: 2rem;
                display: flex;
                flex-direction: column;
                gap: 1rem;
                border: solid 1px black;
                h2 {
                    margin-block: 0;
                    font-size: 1.5rem;
                    &::before {
                        content: counter(number)". ";
                        margin-right: 1rem;
                    }
                    font-family: 'SF Pro', sans-serif;
                }
                &.grayed {
                    opacity: 0.35;
                }
                transition: opacity 0.3s ease;
            }
        }
        
        .logo {
            width: 50%;
            display: flex;
            align-items: center;
            flex-direction: column;
            margin-bottom: 2rem;
        }

        :global(.theme-button) {
            color: white !important;
            text-transform: none !important;
            font-family: 'SF Pro', sans-serif !important;
            font-weight: 600;
            letter-spacing: 0;
            font-size: 1rem;
            padding: 2rem 1rem;
        }

    }
</style>
