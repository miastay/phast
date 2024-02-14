<script>

    import * as d3 from 'd3';
	import { buildModel, generateRelativeMetric, descs } from '../util/model';
	import { getColorList, getPalette } from '../util/colors';
  
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
    let yAxisPos = 0;

    let x, y, line;

    // let interval = [
    //     {x: 0, y: 0, ci_minus: 0.4, ci_plus: 0.6},
    //     {x: 0.5, y: 0.2, ci_minus: 0.4, ci_plus: 0.6},
    //     {x: 1, y: 0.3, ci_minus: 0.6, ci_plus: 0.7},
    //     {x: 2, y: 0.55, ci_minus: 0.65, ci_plus: 0.7},
    //     {x: 3, y: 0.65, ci_minus: 0.6, ci_plus: 0.75},
    // ]

    let scale;
    export let colorScheme;
    $: scale = getColorList(colorScheme)

    let model;

    function redrawModel(metric) {
        model = buildModel(metric)
        console.log(model)
        interval = model.confidence;
        yAxis = model.yAxis;
        xAxis = model.xAxis;
        xAxisLabel = model.xAxisLabel;
        yAxisLabel = model.yAxisLabel;
        yAxisPos = getYAxisPos(yAxisLabel);
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

    $: console.log("relative:", generateRelativeMetric(metric, point[0][1], point[0][0]))

    function getYAxisPos(label) {
        console.log("label length:", label.length)
        return (-1 * (height / 2)) - (label.length * 2.5)
    }

    const area = d3.area().x((d) => x(d.x)).y0((d) => y(d.low)).y1((d) => y(d.high))
    const li = d3.line((d) => x(d.x), (d) => y(d.y));
    const ciLow = d3.line((d) => x(d.x), (d) => y(d.low));
    const ciHigh = d3.line((d) => x(d.x), (d) => y(d.high));

    const areaAbove = d3.area().x((d) => x(d.x)).y0((d) => y(d.high)).y1((d) => -1 * y(yAxis[1]))
    const areaBelow = d3.area().x((d) => x(d.x)).y0((d) => y(yAxis[0])).y1((d) => y(d.low))

    const curveFunc = d3.line((d) => x(d.x), (d) => y(d.y)).curve(d3.curveBasis)//.x(function(d) { return d.x }).y(function(d) { return d.y })

</script>

{#if interval && metric}
<div class='graph-container'>
    <h2>{descs[metric]} by tree size</h2>
    <svg id="viz" viewBox={`0 0 ${width} ${height}`}>
        <defs>
            <linearGradient id="Gradient1" x1="0" x2="0" y1="0" y2="0.2">
              <stop class="stop1" offset="0%" />
              <stop class="stop2" offset="50%" />
              <stop class="stop3" offset="100%" />
            </linearGradient>
        </defs>
        <g class="scale x" bind:this={gx} transform="translate(0,{height - marginBottom})" />
        <g class="scale y" bind:this={gy} transform="translate({marginLeft},0)" />

        <!-- <path class="line" fill="none" stroke="currentColor" stroke-width="1.5" d={line(data)} /> -->

        <path class="area above" fill={scale[scale.length - 1]} stroke="currentColor" stroke-width="0" d={areaAbove(interval)} />
        <path class="area below" fill={scale[1]} stroke="currentColor" stroke-width="0" d={areaBelow(interval)} />
        <path class="area ci" fill={scale[Math.ceil(scale.length / 2)]} stroke="currentColor" stroke-width="0" d={area(interval)} />

        <!-- <path class="line" fill="none" stroke="black" stroke-width="1" d={ciLow(interval)} />
        <path class="line" fill="none" stroke="black" stroke-width="1" d={ciHigh(interval)} /> -->

        <g class="point" fill="white" stroke="currentColor" stroke-width="1.5">
            {#each point as p, i}
                <circle key={i} cx={x(p[0])} cy={y(p[1])} r="5" fill={"white"} class="anim-point" />
            {/each}
        </g>

        <text class="axis-label" text-anchor="center" x={width / 2} y={height + 12}>{xAxisLabel}</text>
        <text class="axis-label" text-anchor="center" transform="rotate(-90)" x={yAxisPos} y={-10} >{yAxisLabel}</text>

    </svg>
</div>
{/if}

<style lang="scss">

    @import '../style/frames.scss';
    @import '../style/colors.scss';
    @import '../style/anim.scss';

    .graph-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        width: 95%;
        max-height: 35%;
        vertical-align: top;
        overflow: visible;

        > h2 {
            @include graph-header;
            margin-left: 1rem;
        }

        > svg {
            height: 100%;
            overflow: hidden;
            //background: white;
            g.scale, .axis-label {
                font-size: 0.7rem;
                font-weight: 500;
            }
            g.point circle {
                fill: white;
                stroke: black;
                &.anim-point {
                    transition: all $anim-med-long ease;
                }
            }
            g.path.point-line {
                stroke: green;
                stroke-width: 2;
            }

            .stop1 {
                stop-color: white;
            }
            .stop2 {
                stop-color: red;
            }
            .stop3 {
                stop-color: green;
            }

            .area {
                transition: all $anim-med ease;
                opacity: 0.5;
            }

        }
    }
</style>