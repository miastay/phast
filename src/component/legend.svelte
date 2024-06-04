<script>
	import { currentMapPalette } from '../store';
	import { getPalette } from '../util/colors';
    import { descs } from '../util/model';

    let scale = getPalette();
    let gradient;

    export let colorScheme;
    export let metric;

    let ticks = [0, 0.5, 1]

    $: scale = getPalette(0, 1, colorScheme).slice(1);
    $: gradient = createPaletteGradient(scale);
    $: $currentMapPalette && setTicks($currentMapPalette)

    export function createPaletteGradient(scale) {
        console.log(scale)
        let grad = `linear-gradient(${scale.map((item) => item[1]).flat().reverse()})`
        console.log(grad)
        return grad;
    }

    function setTicks(pal) {
        if(!pal?.length) return;
        let max = pal.length - 2;
        ticks[2] = Math.round(pal[max] ?? 1)
        ticks[1] = Math.round(pal[max - 2] ?? 0.5)
        ticks[0] = Math.round(pal[max - 4] ?? 0)
        console.log(pal)
    }

</script>

<div class="legend-container">
    <!-- <div class="gradient" style={`background-image: url("/phast/SVG/ticks.svg"), ${gradient}`}/> -->
    <div class="gradient" style={`background-image: none, ${gradient}`}/>
    <div class="label-container">
        <!-- {#each scale as color}
            {#if color[2]}
                <span>{`${color[2]} ${metric ?? ""}`}</span>
            {/if}
        {/each} -->
        {#if ticks}
            <span>{ticks[0] ?? 'min'}</span>
            <span>{ticks[1] ?? 'med'}</span>
            <span>{ticks[2] ?? 'max'}</span>
        {/if}
    </div>
</div>

<style lang="scss">

    @import '../style/frames.scss';
    @import '../style/colors.scss';

    .legend-container {

        @include container;

        flex-direction: row;
        gap: 0.75rem;
        min-height: 8vh;
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
                &::before {
                    content: '- ';
                    margin-left: -0.5rem;
                }
                font-size: 0.65rem;
                line-height: 0rem;
                color: $dark-gray;
                font-weight: 200;
                font-family: monospace;
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
            transition: background 0.3s ease;
        }
    }
</style>