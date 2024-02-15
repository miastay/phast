<script>

    import * as phylotree from 'phylotree';
	import { onMount } from 'svelte';

    export let newick;
    $: newick && treeref && rerender(newick);

    let treeref;

    function rerender(tree_str) {
        const maxdim = window.innerHeight / 2;

        const width = maxdim;
        const height = maxdim;

        let nwk = tree_str ?? `((((((((Tyrannus_verticalis:8.557778,(Sayornis_saya:3.781439,Sayornis_nigricans:3.781439):4.776338):19.243085,((((((Tachycineta_thalassina:7.164564,Stelgidopteryx_serripennis:7.164563):4.907843,Psaltriparus_minimus:12.072407):3.555338,Eremophila_alpestris:15.627745):0.954938,Baeolophus_inornatus:16.582683):1.204803,((((((Turdus_migratorius:9.645123,Catharus_guttatus:9.645123):2.400322,Sialia_mexicana:12.045446):2.685283,(Sturnus_vulgaris:11.154101,(Mimus_polyglottos:6.640306,Toxostoma_redivivum:6.640306):4.513794):3.576628):2.188836,(Thryomanes_bewickii:15.114159,Sitta_carolinensis:15.114158):1.805406):0.407621,Regulus_calendula:17.327187):0.145318,(((((Euphagus_cyanocephalus:4.083924,Molothrus_ater:4.083924):0.187559,Agelaius_phoeniceus:4.271483):2.672922,Sturnella_neglecta:6.944405):1.714005,(Chondestes_grammacus:7.510266,(((Melospiza_melodia:3.876051,Passerculus_sandwichensis:3.876051):1.651948,Melozone_crissalis:5.527999):0.208553,(Junco_hyemalis:4.32944,Zonotrichia_leucophrys:4.329439):1.407113):1.773713):1.148145):2.432439,(Spinus_psaltria:1.162173,Spinus_lawrencei:1.162173):9.928678):6.381655):0.314981):2.469957,(Lanius_ludovicianus:11.409307,(((Corvus_corax:4.701119,Corvus_brachyrhynchos:4.701119):3.288836,Pica_nuttalli:7.989953):0.514906,Aphelocoma_californica:8.50486):2.904448):8.848137):7.543419):11.243922,(Falco_peregrinus:4.801524,Falco_sparverius:4.801523):34.243259):18.167212,((((Colaptes_auratus:10.435479,Melanerpes_formicivorus:10.43548):25.154227,Megaceryle_alcyon:35.589708):21.232651,(Bubo_virginianus:13.486494,Athene_cunicularia:13.486494):43.335864):0.214221,((Buteo_jamaicensis:2.240332,Buteo_lineatus:2.240332):14.348763,Cathartes_aura:16.589095):40.447484):0.175416):0.552342,Charadrius_vociferus:57.764337):0.473736,(((Zenaida_macroura:9.944047,((Columba_livia:6.40713,Streptopelia_decaocto:6.407129):1.408266,Patagioenas_fasciata:7.815396):2.128651):24.836102,Podilymbus_podiceps:34.780148):0.63047,Calypte_anna:35.41062):22.827456):3.416457,(Ardea_herodias:61.247059,(Geococcyx_californianus:31.068293,Fulica_americana:31.068292):30.178765):0.407474):2.979476,(((Anas_platyrhynchos:7.034904,Lophodytes_cucullatus:7.034904):2.655406,Branta_canadensis:9.690311):44.315908,Callipepla_californica:54.006219):10.627788);`
        let tree = new phylotree.phylotree(nwk);
        let renderedTree = tree.render({
            height:height, 
            width:width,
            'left-right-spacing': 'fit-to-size', 
            'top-bottom-spacing': 'fit-to-size',
            'is-radial': true,
            'brush': false,
            'collapsible': false,
            'selectable': false,
            'reroot': false,
            'hide': false,
            container: "#tree_container",
        })
        console.log(renderedTree)
        let tree_svg = tree.display.show();
        tree_svg.setAttribute("viewBox", `${width/4} ${height/4} ${width/2} ${height/2}`); 
        // tree_svg.setAttribute("width", "100%"); 
        // tree_svg.setAttribute("height", "100%"); 
        console.log(tree_svg)
        treeref.appendChild(tree_svg)
        //tree_svg.style = "fill: none; stroke: black;"
    }

    onMount(() => {
        rerender(newick);        
    })

</script>

<div class="container">
    <h2>Taxa found in this area</h2>
    <div id="tree_container" bind:this={treeref}/>
</div>


<style lang="scss">

    @import '../style/frames.scss';
    @import '../style/colors.scss';

    :global(path.branch) {
        fill: none;
        stroke: black;
        stroke-width: 0.5px;
    }
    :global(text.phylotree-node-text) {
        fill: black !important;
        font-size: 0.2rem !important;
    }
    :global(circle) {
        fill: none;
        stroke: none;
    }

    .container {
        width: 100%;
        height: 100%;
    }

    #tree_container {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
    }
    :global(svg) {
        height: 100%;
    }

    h2 {
        @include graph-header;
        text-align: center;
    }

</style>