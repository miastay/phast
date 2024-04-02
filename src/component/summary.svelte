<script>
    export let data;

    const digits = 3;
    const rounded = (x) => Math.round(x * 10**digits) / 10**digits;

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
        <tr class="mono">
            <td>{data.hex}</td>
            <td>{rounded(data.properties.tree_sizes) ?? "Unknown"}</td>
            <td>{rounded(data.properties.pd) ?? "Unknown"}</td>
            <td>{rounded(data.properties.mpd) ?? "Unknown"}</td>
            <td>{rounded(data.properties.mntd) ?? "Unknown"}</td>
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
        tr.mono {
            font-family: monospace;
        }
    }
</style>
