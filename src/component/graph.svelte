<script>

    import * as d3 from 'd3';
	import { buildModel } from '../util/make_confidence_intervals';
  
    export let data;
    export let point;
    export let width = 640;
    export let height = 400;
    export let marginTop = 20;
    export let marginRight = 20;
    export let marginBottom = 30;
    export let marginLeft = 40;

    export let metric;
  
    let gx;
    let gy;

    let interval = null;
    let yAxis = [0, 10];
    let xAxis = [0, 10];
    let xAxisLabel = "";
    let yAxisLabel = "";

    let x, y, line;

    // let interval = [
    //     {x: 0, y: 0, ci_minus: 0.4, ci_plus: 0.6},
    //     {x: 0.5, y: 0.2, ci_minus: 0.4, ci_plus: 0.6},
    //     {x: 1, y: 0.3, ci_minus: 0.6, ci_plus: 0.7},
    //     {x: 2, y: 0.55, ci_minus: 0.65, ci_plus: 0.7},
    //     {x: 3, y: 0.65, ci_minus: 0.6, ci_plus: 0.75},
    // ]

    let model;

    function redrawModel(metric) {
        model = buildModel(metric)
        console.log(model)
        interval = model.confidence;
        yAxis = model.yAxis;
        xAxis = model.xAxis;
        xAxisLabel = model.xAxisLabel;
        yAxisLabel = model.yAxisLabel;
    }

    $: model = redrawModel(metric);

    $: x = d3.scaleLinear(d3.extent(xAxis), [marginLeft, width - marginRight]);
    $: y = d3.scaleLinear(d3.extent(yAxis), [height - marginBottom, marginTop]);
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

    const area = d3.area().x((d) => x(d.x)).y0((d) => y(d.low)).y1((d) => y(d.high))
    const li = d3.line((d) => x(d.x), (d) => y(d.y));
    const curveFunc = d3.line((d) => x(d.x), (d) => y(d.y)).curve(d3.curveBasis)//.x(function(d) { return d.x }).y(function(d) { return d.y })

</script>

{#if interval}
    <div class='graph-container'>
        <svg id="viz" viewBox={`0 0 ${width} ${height}`}>
            <g class="scale x" bind:this={gx} transform="translate(0,{height - marginBottom})" />
            <g class="scale y" bind:this={gy} transform="translate({marginLeft},0)" />

            <!-- <path class="line" fill="none" stroke="currentColor" stroke-width="1.5" d={line(data)} /> -->

            <path class="area" fill="#00ffff44" stroke="currentColor" stroke-width="0" d={area(interval)} />
            <path class="line" fill="none" stroke="currentColor" stroke-width="1.5" d={curveFunc(interval)} />

            <g class="point" fill="white" stroke="currentColor" stroke-width="1.5">
                {#each point as p, i}
                    <circle key={i} cx={x(p[0])} cy={y(p[1])} r="5" fill="white" />
                {/each}
            </g>

            <text text-anchor="center" x={width/2.2} y={height + 15}>{xAxisLabel}</text>
            <text text-anchor="center" x={-width / 2.2} y={-20} transform="rotate(-90)">{yAxisLabel}</text>

        </svg>
    </div>
{/if}

<style lang="scss">
    .graph-container {
        display: inline-block;
        position: relative;
        width: 100%;
        vertical-align: top;
        overflow: visible;
        > svg {
            overflow: visible;
            g.scale {
                font-size: 0.7rem;
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