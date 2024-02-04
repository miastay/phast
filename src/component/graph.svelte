<script>

    import * as d3 from 'd3';
  
    export let data;
    export let point;
    export let width = 640;
    export let height = 400;
    export let marginTop = 20;
    export let marginRight = 20;
    export let marginBottom = 30;
    export let marginLeft = 40;
  
    let gx;
    let gy;
  
    $: x = d3.scaleLinear([0, data.length - 1], [marginLeft, width - marginRight]);
    $: y = d3.scaleLinear(d3.extent([0,1]), [height - marginBottom, marginTop]);
    $: line = d3.line((d, i) => x(i), y);
    $: d3.select(gy).call(d3.axisLeft(y));
    $: d3.select(gx).call(d3.axisBottom(x));

    $: d3.select("svg").append("div")
        .classed("svg-container", true) //container class to make it responsive
        .append("svg")
        //responsive SVG needs these 2 attributes and no width and height attr
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", `0 0 ${width} ${height}`)
        //class to make it responsive
        .classed("svg-content-responsive", true); 

</script>

<div class='graph-container'>
    <svg viewBox={`0 0 ${width} ${height}`}>
        <g class="scale x" bind:this={gx} transform="translate(0,{height - marginBottom})" />
        <g class="scale y" bind:this={gy} transform="translate({marginLeft},0)" />
        <path class="line" fill="none" stroke="currentColor" stroke-width="1.5" d={line(data)} />
        <g class="point" fill="white" stroke="currentColor" stroke-width="1.5">
            {#each point as p, i}
                <circle key={i} cx={x(p[0])} cy={y(p[1])} r="5" fill="white" />
            {/each}
        </g>
        <path class="point-line" fill="none" stroke="currentColor" stroke-width="1.5" d={line([point[0][1]])} />
    </svg>
</div>

<style lang="scss">
    .graph-container {
        display: inline-block;
        position: relative;
        width: 100%;
        vertical-align: top;
        overflow: hidden;
        > svg {
            g.scale {
                font-size: 1rem;
            }
            g.point circle {
                fill: red;
                stroke: none;
            }
            g.path.point-line {
                stroke: green;
                stroke-width: 2;
            }
        }
    }
</style>