<script>
    export let data;
</script>

<div class="summary-container">
    <table>
        <thead>
            <td>Hex</td>
            <td>Tree Size</td>
            <td>PD</td>
            <td>MPD</td>
            <td>MNTD</td>
        </thead>
        <tr>
            <td>{data.hex}</td>
            <td>{data.properties.tree_sizes}</td>
            <td>{data.properties.pd}</td>
            <td>{data.properties.mpd}</td>
            <td>{data.properties.mntd}</td>
        </tr>
    </table>
</div>

<style lang='scss'>

    @import '../style/colors.scss';

    .summary-container {
        padding: 1rem;
        max-height: 30%;
        td {
            outline: solid 1px $slate-400;
            padding: 0.5rem 1rem;
        }
        thead {
            background: $slate-600;
            color: white;
        }
    }
</style>
