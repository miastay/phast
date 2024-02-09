<script>
	import { getPalette } from '../util/colors';

    const scale = getPalette();

</script>

<div class="legend-container">
    {#each scale as color}
        {#if color[2]}
            <div class="item">
                <div class="square" style={`background: ${color[1]}`}/><span>{color[2]}</span>
            </div>
        {/if}
    {/each}
</div>

<style lang="scss">

    @import '../style/frames.scss';

    .legend-container {

        @include container;

        position: absolute;
        left: 10px;
        bottom: 50px;
        flex-direction: column-reverse;
        gap: 0.75rem;

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
    }
</style>