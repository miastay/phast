<script>
	import { getPalette } from '../util/colors';
    import { descs } from '../util/make_confidence_intervals';

    let scale = getPalette();
    let gradient;

    export let colorScheme;
    export let metric;

    $: scale = getPalette(0, 1, colorScheme).slice(1);
    $: gradient = createPaletteGradient(scale);

    function createPaletteGradient(scale) {
        let grad = `url("/phast/SVG/ticks.svg"), linear-gradient(${scale.map((item) => item[1]).flat().reverse()})`
        console.log(grad)
        return grad;
    }

</script>

<div class="legend-container">
    <div class="gradient" style={`background-image: ${gradient}`}/>
    <div class="label-container">
        {#each scale as color}
            {#if color[2]}
                <span>{`${color[2]} ${descs[metric] ?? ""}`}</span>
            {/if}
        {/each}
    </div>
</div>

<style lang="scss">

    @import '../style/frames.scss';
    @import '../style/colors.scss';

    .legend-container {

        @include container;

        flex-direction: row;
        gap: 0.75rem;
        min-height: 5vh;
        background-color: #ffffffaa;
        backdrop-filter: blur(50px);
        cursor: default;
        user-select: none;

        .label-container {
            display: flex;
            flex-direction: column-reverse;
            justify-content: space-between;
            gap: 0.75rem;
            padding: 0.25rem 0;
            span {
                font-size: 0.85rem;
                line-height: 0.85rem;
                color: $dark-gray;
                font-weight: 200;
            }
        }

        .item {
            display: flex;
            flex-direction: row;
            gap: 0.75rem;
            align-items: center;
            .square {
                height: 25px;
                border-radius: 25px;
                aspect-ratio: 1/1;
            }
        }
        .gradient {
            width: 1rem;
            height: auto;
            background-image: none;
            background-size: 100% 35%, 100% 100%;
            background-position: center center;
            outline: solid 1px $dark-gray;
        }
    }
</style>