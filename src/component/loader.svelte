<script>
    import { ProgressCircular, MaterialApp } from 'svelte-materialify';
	import { getBrandColors } from '../util/colors';

    export let message;

</script>

<div class="loading-container">
    <ProgressCircular size={50} indeterminate color={getBrandColors()['500']} />
    {#if message}
        <h3>
            {message}
        </h3>
    {/if}
</div>

<style lang='scss'>

    @import '../style/colors.scss';

    .loading-container {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        align-items: center;
        justify-content: center;
        h3 {
            color: $slate-400;
        }
    }
</style>
